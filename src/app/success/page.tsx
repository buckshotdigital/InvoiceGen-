'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { storage } from '@/lib/storage';

export default function SuccessPage() {
  useEffect(() => {
    // Set premium status for 1 month
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    storage.setPremium(oneMonthFromNow.toISOString());
  }, []);

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
