import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getUserSettings } from '@/lib/api/settings';
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

    // Get user settings
    const settings = await getUserSettings(user.id);

    if (!settings) {
      return createErrorResponse(
        'User settings not found',
        'NOT_FOUND',
        404
      );
    }

    // Verify stripe_customer_id exists
    if (!settings.stripeCustomerId) {
      return createErrorResponse(
        'User does not have an active subscription',
        'NO_SUBSCRIPTION',
        400
      );
    }

    // Get return URL
    const domain = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000';
    const returnUrl = `${domain}/pricing`;

    // Create billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: settings.stripeCustomerId,
      return_url: returnUrl,
    });

    return createSuccessResponse(
      { url: session.url },
      'Billing portal session created'
    );
  } catch (error) {
    // Handle Stripe errors
    if (error instanceof Stripe.errors.StripeInvalidRequestError) {
      return createErrorResponse(
        'Invalid customer ID',
        'VALIDATION_ERROR',
        400,
        { stripe_error: error.message }
      );
    }

    return createErrorResponse(
      'Failed to create billing portal session',
      'EXTERNAL_API_ERROR',
      500,
      { error }
    );
  }
}
