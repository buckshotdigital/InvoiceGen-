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

    // Verify user with Supabase using the token (secure server-side verification)
    const supabase = createServerSupabaseClient(accessToken);
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return createErrorResponse('Invalid or expired token', 'UNAUTHORIZED', 401);
    }

    if (!process.env.STRIPE_PRICE_ID) {
      return createErrorResponse(
        'Stripe configuration incomplete',
        'VALIDATION_ERROR',
        400,
        { missing: 'STRIPE_PRICE_ID' }
      );
    }

    const domain = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${domain}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/pricing`,
      customer_email: user.email || undefined,
      metadata: {
        product: 'invoicegen_premium',
        user_id: user.id,
      },
    });

    return createSuccessResponse({ url: session.url }, 'Checkout session created');
  } catch (error) {
    return createErrorResponse(
      'Failed to create checkout session',
      'EXTERNAL_API_ERROR',
      500,
      { stripe_error: error }
    );
  }
}
