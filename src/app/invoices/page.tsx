'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useInvoices } from '@/hooks/useInvoices';
import { useSettings } from '@/hooks/useSettings';
import { Invoice, CURRENCIES } from '@/types/invoice';
import { generatePDF } from '@/lib/generatePDF';

const FREE_INVOICE_LIMIT = 3;

export default function InvoicesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { fetchInvoices, removeInvoice, markPaid, markUnpaid, loading: invoicesLoading } = useInvoices();
  const { fetchSettings } = useSettings();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!user || authLoading) return;

    const loadData = async () => {
      try {
        // Load invoices and settings in parallel
        const [invoiceData, settings] = await Promise.all([
          fetchInvoices(),
          fetchSettings()
        ]);
        setInvoices(invoiceData);
        setIsPremium(settings?.isPremium || false);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load invoices';
        setError(message);
      }
    };

    loadData();
  }, [user, authLoading, fetchInvoices, fetchSettings]);

  const handleMarkAsPaid = async (id: string) => {
    setUpdating(id);
    setError('');

    try {
      const result = await markPaid(id);
      if (!result) {
        setError('Failed to mark invoice as paid');
        return;
      }
      // Update local state
      setInvoices(invoices.map((inv) => (inv.id === id ? result : inv)));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to mark invoice as paid';
      setError(message);
    } finally {
      setUpdating(null);
    }
  };

  const handleMarkAsUnpaid = async (id: string) => {
    setUpdating(id);
    setError('');

    try {
      const result = await markUnpaid(id);
      if (!result) {
        setError('Failed to mark invoice as unpaid');
        return;
      }
      // Update local state
      setInvoices(invoices.map((inv) => (inv.id === id ? result : inv)));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to mark invoice as unpaid';
      setError(message);
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;

    setDeleting(id);
    setError('');

    try {
      const success = await removeInvoice(id);
      if (!success) {
        setError('Failed to delete invoice');
        return;
      }
      setInvoices(invoices.filter((inv) => inv.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete invoice';
      setError(message);
    } finally {
      setDeleting(null);
    }
  };

  const handleDownload = async (invoice: Invoice) => {
    await generatePDF(invoice);
  };

  const getCurrency = (code: string) => {
    return CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];
  };

  const getTotal = (invoice: Invoice) => {
    const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    return subtotal + subtotal * (invoice.taxRate / 100);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (authLoading || invoicesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading invoices...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Invoices</h1>
          <Link
            href="/create"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            New Invoice
          </Link>
        </div>

        {invoices.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No invoices yet</h2>
            <p className="text-gray-600 mb-6">Create your first invoice to get started.</p>
            <Link
              href="/create"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Create Your First Invoice
            </Link>
          </div>
        ) : (
          <>
            {/* Upgrade Banner for Free Users with More Than 3 Invoices */}
            {!isPremium && invoices.length > FREE_INVOICE_LIMIT && (
              <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-amber-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="font-medium text-amber-800">
                        Free plan: Tracking {FREE_INVOICE_LIMIT} of {invoices.length} invoices
                      </p>
                      <p className="text-sm text-amber-600">
                        Upgrade to Premium to track all your invoices and send unlimited reminders
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/pricing"
                    className="ml-4 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all whitespace-nowrap"
                  >
                    Upgrade Now
                  </Link>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.map((invoice, index) => {
                    const isLocked = !isPremium && index >= FREE_INVOICE_LIMIT;
                    const currency = getCurrency(invoice.currency);
                    const total = getTotal(invoice);
                    const isOverdue =
                      !invoice.isPaid && new Date(invoice.dueDate) < new Date();

                    // Render locked (blurred) row for free users beyond limit
                    if (isLocked) {
                      return (
                        <tr key={invoice.id} className="relative">
                          <td colSpan={6} className="px-6 py-4">
                            <div className="flex items-center justify-between blur-sm select-none pointer-events-none">
                              <div className="flex items-center space-x-8">
                                <span className="text-sm font-medium text-gray-400">{invoice.invoiceNumber}</span>
                                <span className="text-sm text-gray-400">{invoice.toName || 'Client'}</span>
                                <span className="text-sm text-gray-400">{formatDate(invoice.date)}</span>
                                <span className="text-sm text-gray-400">{currency.symbol}{total.toFixed(2)}</span>
                              </div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50">
                              <Link
                                href="/pricing"
                                className="flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
                              >
                                <svg className="w-4 h-4 mr-1.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Unlock with Premium
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {invoice.invoiceNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{invoice.toName || 'No client'}</div>
                          <div className="text-sm text-gray-500">{invoice.toEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(invoice.date)}</div>
                          <div className="text-sm text-gray-500">
                            Due: {formatDate(invoice.dueDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {currency.symbol}
                            {total.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {invoice.isPaid ? (
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              Paid
                            </span>
                          ) : isOverdue ? (
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                              Overdue
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          )}
                        </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3 flex justify-end">
                        <Link
                          href={`/create?invoiceId=${invoice.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit Invoice"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDownload(invoice)}
                          className="text-primary-600 hover:text-primary-900"
                          title="Download PDF"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => (invoice.isPaid ? handleMarkAsUnpaid(invoice.id) : handleMarkAsPaid(invoice.id))}
                          disabled={updating === invoice.id}
                          className={`mr-4 ${
                            updating === invoice.id
                              ? 'text-gray-400 cursor-not-allowed'
                              : invoice.isPaid
                              ? 'text-green-600 hover:text-green-900'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                          title={invoice.isPaid ? 'Mark as Unpaid' : 'Mark as Paid'}
                        >
                          {updating === invoice.id ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                          ) : invoice.isPaid ? (
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5"
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
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(invoice.id)}
                          disabled={deleting === invoice.id}
                          className={`${
                            deleting === invoice.id
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-red-600 hover:text-red-900'
                          }`}
                          title="Delete"
                        >
                          {deleting === invoice.id ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                          ) : (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
