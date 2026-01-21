'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToastContext } from '@/contexts/ToastContext';
import { supabase } from '@/lib/supabase/client';

type VerificationState = 'loading' | 'success' | 'processing' | 'error';

interface VerifySessionResponse {
  verified: boolean;
  premiumActive: boolean;
  processing: boolean;
  error?: string;
  code?: string;
}

export default function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { error: showError } = useToastContext();

  const [state, setState] = useState<VerificationState>('loading');
  const [error, setError] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (!authLoading && user) {
      verifySession();
    }
  }, [user, authLoading]);

  const verifySession = async (isRetry = false) => {
    try {
      const sessionId = searchParams.get('session_id');

      if (!sessionId) {
        setError('Invalid success page access');
        setState('error');
        return;
      }

      // Get current session for auth token
      const { data: { session: authSession } } = await supabase.auth.getSession();
      if (!authSession?.access_token) {
        setError('Session expired. Please log in again.');
        setState('error');
        router.push('/auth/login');
        return;
      }

      const response = await fetch('/api/verify-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authSession.access_token}`,
        },
        body: JSON.stringify({ session_id: sessionId }),
      });

      const data: VerifySessionResponse = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to verify payment');
        setState('error');
        showError(data.error || 'Payment verification failed');
        return;
      }

      if (!data.verified) {
        setError('Payment verification failed');
        setState('error');
        showError('Payment was not completed successfully');
        return;
      }

      if (data.premiumActive) {
        // Premium is already active
        setState('success');
      } else if (data.processing) {
        // Webhook is still processing, poll for updates
        if (isRetry && pollCount < 5) {
          setState('processing');
          setPollCount(pollCount + 1);
          // Wait 2 seconds before polling again
          setTimeout(() => {
            verifySession(true);
          }, 2000);
        } else if (!isRetry) {
          setState('processing');
          setPollCount(1);
          // Start polling
          setTimeout(() => {
            verifySession(true);
          }, 2000);
        } else {
          // Max polling attempts reached, but payment is verified
          setState('success');
        }
      } else {
        // Payment verified but not processing
        setState('success');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      setState('error');
      showError(message);
    }
  };

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment...</h1>
          <p className="text-gray-600">Please wait while we verify your payment.</p>
        </div>
      </div>
    );
  }

  if (state === 'processing') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-amber-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Upgrade...</h1>
          <p className="text-gray-600 mb-6">
            Payment received! We're activating your premium features.
          </p>
          <p className="text-sm text-gray-500">This usually takes a few seconds...</p>
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Verification Failed</h1>
          <p className="text-gray-600 mb-6">{error || 'There was an issue verifying your payment.'}</p>

          <Link
            href="/pricing"
            className="inline-flex items-center justify-center w-full py-3 px-6 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 mb-3"
          >
            Return to Pricing
          </Link>

          <Link href="/" className="block text-gray-600 hover:text-gray-900 text-sm">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Premium!</h1>
        <p className="text-gray-600 mb-6">
          Your upgrade was successful. You now have access to all premium features including custom
          branding, logo uploads, and custom accent colors.
        </p>

        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-4 mb-6">
          <p className="font-semibold">Premium Features Unlocked</p>
          <ul className="text-sm mt-2 space-y-1 text-left">
            <li>✓ Custom accent colors</li>
            <li>✓ Add your logo to invoices</li>
            <li>✓ Remove InvoiceGen branding</li>
            <li>✓ Priority support</li>
          </ul>
        </div>

        <Link
          href="/create"
          className="inline-flex items-center justify-center w-full py-3 px-6 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
        >
          Create Your First Premium Invoice
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>

        <Link href="/" className="block mt-4 text-gray-600 hover:text-gray-900 text-sm">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
