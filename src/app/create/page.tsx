'use client';

import { Suspense } from 'react';
import Header from '@/components/Header';
import InvoiceForm from '@/components/InvoiceForm';
import { useSearchParams } from 'next/navigation';

function CreatePageContent() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get('invoiceId');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <InvoiceForm invoiceId={invoiceId || undefined} />
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CreatePageContent />
    </Suspense>
  );
}
