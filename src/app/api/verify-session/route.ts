import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createErrorResponse, createSuccessResponse } from '@/lib/api/errors';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    // Get access token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createErrorResponse('Authentication required', 'UNAUTHORIZED', 401);
    }
    const accessToken = authHeader.replace('Bearer ', '');

    // Verify user with Supabase using the token
    const supabase = createServerSupabaseClient(accessToken);
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return createErrorResponse('Invalid or expired token', 'UNAUTHORIZED', 401);
    }

    // Get session_id from request body
    const body = await request.json();
    const { session_id } = body;

    if (!session_id) {
      return createErrorResponse(
        'session_id is required',
        'MISSING_REQUIRED_FIELD',
        400,
        { missing: 'session_id' }
      );
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id as string);

    // Verify payment status
    if (session.payment_status !== 'paid') {
      return createSuccessResponse(
        {
          verified: false,
          premiumActive: false,
          processing: false,
        },
        'Payment not completed'
      );
    }

    // Verify the session belongs to the authenticated user
    if (session.metadata?.user_id !== user.id) {
      return createErrorResponse(
        'Session does not belong to authenticated user',
        'VALIDATION_ERROR',
        403
      );
    }

    // Check if webhook has processed the subscription
    const { data: userSettings, error: settingsError } = await supabase
      .from('user_settings')
      .select('is_premium, premium_until')
      .eq('user_id', user.id)
      .single();

    if (settingsError && settingsError.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      return createErrorResponse(
        'Failed to fetch user settings',
        'DATABASE_ERROR',
        500,
        { details: settingsError }
      );
    }

    const isPremiumActive = !!(
      userSettings?.is_premium &&
      userSettings?.premium_until &&
      new Date(userSettings.premium_until) > new Date()
    );

    return createSuccessResponse(
      {
        verified: true,
        premiumActive: isPremiumActive,
        processing: !isPremiumActive, // If payment verified but premium not active, webhook is processing
      },
      'Session verified'
    );
  } catch (error) {
    // Handle Stripe errors
    if (error instanceof Stripe.errors.StripeInvalidRequestError) {
      return createErrorResponse(
        'Invalid session ID',
        'NOT_FOUND',
        404,
        { stripe_error: error.message }
      );
    }

    return createErrorResponse(
      'Failed to verify session',
      'EXTERNAL_API_ERROR',
      500,
      { error }
    );
  }
}
