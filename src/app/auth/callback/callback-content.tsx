'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('Authenticating...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code and type from URL params
        const code = searchParams.get('code');
        const type = searchParams.get('type');
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        // Handle error from OAuth provider
        if (errorParam) {
          setError(errorDescription || 'Authentication failed');
          setLoading(false);
          return;
        }

        if (!code) {
          // Check if there's a hash fragment (for email confirmation)
          // Supabase sometimes puts tokens in hash
          const hash = window.location.hash;
          if (hash) {
            // Let Supabase handle the hash
            const { error: hashError } = await supabase.auth.getSession();
            if (hashError) {
              throw hashError;
            }
            router.push('/dashboard');
            return;
          }

          setError('No authorization code received');
          setLoading(false);
          return;
        }

        // Handle different callback types
        if (type === 'recovery') {
          setMessage('Processing password reset...');
          // Exchange code for session
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            throw exchangeError;
          }
          // Redirect to password reset page
          router.push('/auth/reset-password');
          return;
        }

        if (type === 'signup' || type === 'email') {
          setMessage('Verifying your email...');
          // Exchange code for session (email confirmation)
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            throw exchangeError;
          }
          // Redirect to dashboard with success message
          router.push('/dashboard?verified=true');
          return;
        }

        // Default: OAuth or other callback
        setMessage('Completing sign in...');
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          throw exchangeError;
        }

        // Redirect to dashboard
        router.push('/dashboard');
      } catch (err) {
        console.error('Callback error:', err);
        setError('Failed to authenticate. Please try again.');
        setLoading(false);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{message}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <div className="max-w-md">
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-800">{error}</p>
          </div>
          <button
            onClick={() => router.push('/auth/login')}
            className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return null;
}
