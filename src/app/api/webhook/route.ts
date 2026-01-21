import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase/client';
import { createErrorResponse, createSuccessResponse } from '@/lib/api/errors';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || '';

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      return createErrorResponse(
        'Webhook signature verification failed',
        'VALIDATION_ERROR',
        400,
        { signature_error: err }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('✅ Checkout completed:', session.id);

        const userId = session.metadata?.user_id;
        if (!userId) {
          console.error('❌ No user_id in session metadata');
          break;
        }

        if (!session.subscription) {
          console.error('❌ No subscription in session');
          break;
        }

        // Get subscription details from Stripe
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        if (!supabaseAdmin) {
          console.error('❌ Supabase admin client not configured');
          break;
        }

        // Update user settings with premium status
        const { error: updateError } = await supabaseAdmin
          .from('user_settings')
          .update({
            is_premium: true,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscription.id,
            premium_until: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq('user_id', userId);

        if (updateError) {
          console.error('❌ Failed to update user settings:', updateError);
        } else {
          console.log('✅ User premium status updated');
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('📝 Subscription updated:', subscription.id);

        if (!supabaseAdmin) {
          console.error('❌ Supabase admin client not configured');
          break;
        }

        // Update premium_until date
        const { error: updateError } = await supabaseAdmin
          .from('user_settings')
          .update({
            premium_until: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);

        if (updateError) {
          console.error('❌ Failed to update subscription:', updateError);
        } else {
          console.log('✅ Subscription updated in Supabase');
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('❌ Subscription cancelled:', subscription.id);

        if (!supabaseAdmin) {
          console.error('❌ Supabase admin client not configured');
          break;
        }

        // Revoke premium status
        const { error: updateError } = await supabaseAdmin
          .from('user_settings')
          .update({
            is_premium: false,
            premium_until: null,
          })
          .eq('stripe_subscription_id', subscription.id);

        if (updateError) {
          console.error('❌ Failed to revoke premium status:', updateError);
        } else {
          console.log('✅ Premium status revoked');
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('✅ Payment succeeded:', invoice.id);
        // Subscription renewal - premium_until will be updated via subscription.updated event
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('❌ Payment failed:', invoice.id);
        break;
      }

      default:
        console.log('ℹ️ Unhandled event type:', event.type);
    }

    return createSuccessResponse({ received: true });
  } catch (error) {
    return createErrorResponse(
      'Webhook handler failed',
      'INTERNAL_ERROR',
      500,
      { error }
    );
  }
}
