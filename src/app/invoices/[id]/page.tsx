'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import SendReminderModal from '@/components/SendReminderModal';
import { useAuth } from '@/contexts/AuthContext';
import { useToastContext } from '@/contexts/ToastContext';
import { useSettings } from '@/hooks/useSettings';
import { Invoice, CURRENCIES, UserSettings } from '@/types/invoice';
import { ReminderType } from '@/lib/email/templates';
import { getInvoices, markInvoiceAsPaid } from '@/lib/api/invoices';

export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.id as string;
  const { user, loading: authLoading } = useAuth();
  const { fetchSettings } = useSettings();
  const { success: showSuccess, error: showError } = useToastContext();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user && invoiceId) {
      loadInvoice();
      loadSettings();
    }
  }, [user, authLoading, invoiceId]);

  const loadInvoice = async () => {
    if (!user) return;
    setLoading(true);
    setError('');

    try {
      const invoices = await getInvoices(user.id);
      const found = invoices.find((inv) => inv.id === invoiceId);
      if (!found) {
        setError('Invoice not found');
        return;
      }
      setInvoice(found);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load invoice';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const result = await fetchSettings();
      setSettings(result);
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const handleSendReminder = async (subject: string, reminderType: ReminderType) => {
    if (!invoice || !user) {
      throw new Error('Missing required data');
    }

    try {
      const response = await fetch('/api/reminders/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          invoiceId: invoice.id,
          reminderType,
          customSubject: subject,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send reminder');
      }

      showSuccess(`Reminder sent to ${invoice.toEmail}`);
      setIsReminderModalOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send reminder';
      showError(message);
      throw err;
    }
  };

  const handleMarkAsPaid = async () => {
    if (!invoice || !user) return;

    setIsMarkingPaid(true);
    try {
      const result = await markInvoiceAsPaid(user.id, invoice.id);

      if (result) {
        setInvoice(result);
        showSuccess(`Invoice ${invoice.invoiceNumber} marked as paid`);
      } else {
        showError('Failed to mark invoice as paid');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to mark invoice as paid';
      showError(message);
    } finally {
      setIsMarkingPaid(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading invoice...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !invoice) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Invoice Not Found</h2>
            <p className="text-gray-600 mb-6">The invoice you're looking for doesn't exist.</p>
            <Link
              href="/invoices"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              Back to Invoices
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currency = CURRENCIES.find((c) => c.code === invoice.currency) || CURRENCIES[0];
  const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const tax = subtotal * (invoice.taxRate / 100);
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoice {invoice.invoiceNumber}</h1>
            <p className="mt-2 text-gray-600">
              {invoice.isPaid ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Paid
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  Pending
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/create?invoiceId=${invoice.id}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
            >
              Edit
            </Link>
            {!invoice.isPaid && (
              <>
                <button
                  onClick={handleMarkAsPaid}
                  disabled={isMarkingPaid}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 font-medium"
                >
                  {isMarkingPaid ? 'Marking...' : 'Mark as Paid'}
                </button>
                <button
                  onClick={() => setIsReminderModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-medium"
                >
                  Send Reminder
                </button>
              </>
            )}
            <Link
              href="/invoices"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
            >
              Back
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Invoice Details */}
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* From Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">From</h3>
              <p className="font-medium text-gray-900">{invoice.fromName}</p>
              <p className="text-gray-600">{invoice.fromEmail}</p>
              {invoice.fromPhone && <p className="text-gray-600">{invoice.fromPhone}</p>}
              {invoice.fromAddress && (
                <p className="text-gray-600 mt-2 whitespace-pre-line">{invoice.fromAddress}</p>
              )}
            </div>

            {/* To Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Bill To</h3>
              <p className="font-medium text-gray-900">{invoice.toName}</p>
              <p className="text-gray-600">{invoice.toEmail}</p>
              {invoice.toAddress && (
                <p className="text-gray-600 mt-2 whitespace-pre-line">{invoice.toAddress}</p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-600">Invoice Date</p>
              <p className="font-medium text-gray-900">
                {new Date(invoice.date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Due Date</p>
              <p className="font-medium text-gray-900">
                {new Date(invoice.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">
                    Description
                  </th>
                  <th className="text-right py-2 px-4 text-sm font-semibold text-gray-700">
                    Qty
                  </th>
                  <th className="text-right py-2 px-4 text-sm font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="text-right py-2 px-4 text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-900">{item.description}</td>
                    <td className="text-right py-3 px-4 text-gray-900">{item.quantity}</td>
                    <td className="text-right py-3 px-4 text-gray-900">
                      {currency.symbol}
                      {item.price.toFixed(2)}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-900">
                      {currency.symbol}
                      {(item.quantity * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-700">Subtotal:</span>
                <span className="font-medium text-gray-900">
                  {currency.symbol}
                  {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-700">Tax ({invoice.taxRate}%):</span>
                <span className="font-medium text-gray-900">
                  {currency.symbol}
                  {tax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-2 text-lg">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="font-bold text-gray-900">
                  {currency.symbol}
                  {total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="pt-8 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Notes</h3>
              <p className="text-gray-600 whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Send Reminder Modal */}
      {settings && (
        <SendReminderModal
          invoice={invoice}
          businessName={settings.defaultFromName || 'Our Business'}
          businessEmail={settings.defaultFromEmail || user?.email || 'invoices@bdsalesinc.ca'}
          isOpen={isReminderModalOpen}
          onClose={() => setIsReminderModalOpen(false)}
          onSend={handleSendReminder}
        />
      )}
    </div>
  );
}
