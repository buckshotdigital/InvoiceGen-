'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToastContext } from '@/contexts/ToastContext';
import { useSettings } from '@/hooks/useSettings';
import { supabase } from '@/lib/supabase/client';

export default function Header() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { fetchSettings } = useSettings();
  const { error: showError } = useToastContext();
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadPremiumStatus();
    }
  }, [user]);

  const loadPremiumStatus = async () => {
    try {
      const settings = await fetchSettings();
      setIsPremium(settings?.isPremium || false);
    } catch (err) {
      console.error('Failed to load premium status:', err);
    }
  };

  const handleManageSubscription = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        showError(data.error || 'Failed to open subscription management');
        return;
      }

      if (data.url) {
        router.push(data.url);
      } else {
        showError('Failed to open subscription management');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error managing subscription';
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <svg
              className="w-8 h-8 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="text-xl font-bold text-gray-900">InvoiceGen</span>
          </Link>

          <nav className="flex items-center space-x-4">
            <Link
              href="/create"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Create Invoice
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Dashboard
              </Link>
            )}
            <Link
              href="/invoices"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              My Invoices
            </Link>
            {user ? (
              <>
                {isPremium ? (
                  <button
                    onClick={handleManageSubscription}
                    disabled={isLoading}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    Premium • {isLoading ? 'Loading...' : 'Manage'}
                  </button>
                ) : (
                  <Link
                    href="/pricing"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Upgrade
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
