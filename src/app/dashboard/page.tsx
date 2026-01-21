'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import SendReminderModal from '@/components/SendReminderModal';
import ReminderHistoryModal from '@/components/ReminderHistoryModal';
import { useAuth } from '@/contexts/AuthContext';
import { useToastContext } from '@/contexts/ToastContext';
import { useInvoices } from '@/hooks/useInvoices';
import { deleteInvoice } from '@/lib/api/invoices';
import { useSettings } from '@/hooks/useSettings';
import { Invoice, CURRENCIES, UserSettings } from '@/types/invoice';
import { ReminderType } from '@/lib/email/templates';
import { getDashboardMetrics, DashboardMetrics, getFilteredInvoices, FilterOptions } from '@/lib/api/dashboard';

type StatusFilter = 'all' | 'paid' | 'pending' | 'overdue';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { fetchSettings } = useSettings();
  const { success: showSuccess, error: showError } = useToastContext();

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      loadDashboard();
      // Fetch user settings
      fetchSettings().then(setSettings).catch(() => {
        setSettings(null);
      });
    }
  }, [user, authLoading, fetchSettings]);

  const loadDashboard = async () => {
    if (!user) return;
    setLoading(true);
    setError('');

    try {
      // Load metrics and invoices in parallel
      const [metricsData, invoicesData] = await Promise.all([
        getDashboardMetrics(user.id),
        getFilteredInvoices(user.id, {
          status: statusFilter,
          searchTerm,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        }),
      ]);

      setMetrics(metricsData);
      setInvoices(invoicesData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load dashboard';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Reload when filters change
  useEffect(() => {
    if (user && !authLoading) {
      const timer = setTimeout(() => {
        loadDashboard();
      }, 300); // Debounce filter changes
      return () => clearTimeout(timer);
    }
  }, [statusFilter, searchTerm, startDate, endDate]);

  const handleResetFilters = () => {
    setStatusFilter('all');
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
  };

  const handleOpenReminderModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsReminderModalOpen(true);
  };

  const handleCloseReminderModal = () => {
    setIsReminderModalOpen(false);
    setSelectedInvoice(null);
  };

  const handleSendReminder = async (subject: string, reminderType: ReminderType) => {
    if (!selectedInvoice || !user) {
      throw new Error('Missing required data');
    }

    try {
      console.log('📤 Sending reminder for invoice:', selectedInvoice.id);

      const response = await fetch('/api/reminders/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          invoiceId: selectedInvoice.id,
          reminderType,
          customSubject: subject,
          userId: user.id,
        }),
      });

      console.log('📨 Response status:', response.status);

      if (!response.ok) {
        const data = await response.json();
        const errorMsg = data.error || 'Failed to send reminder';
        console.error('❌ API error:', errorMsg);
        throw new Error(errorMsg);
      }

      const result = await response.json();
      console.log('✅ Success response:', result);

      // Success - show toast, close modal and reload data
      showSuccess(`Reminder sent to ${selectedInvoice.toEmail}`);
      handleCloseReminderModal();
      await loadDashboard();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send reminder';
      console.error('❌ Error in handleSendReminder:', message);
      showError(message);
      // Re-throw so modal can catch it
      throw err;
    }
  };

  const handleDeleteInvoice = async () => {
    if (!invoiceToDelete || !user) return;

    setIsDeleting(true);
    try {
      const success = await deleteInvoice(user.id, invoiceToDelete.id);
      if (success) {
        setInvoiceToDelete(null);
        setIsDeleteConfirming(false);
        showSuccess(`Invoice ${invoiceToDelete.invoiceNumber} deleted`);
        await loadDashboard();
      } else {
        showError('Failed to delete invoice');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete invoice';
      showError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Dashboard</h1>
            <p className="mt-2 text-gray-600">Track your invoices and payments at a glance</p>
          </div>
          <Link
            href="/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            + Create Invoice
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Metrics Cards */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Outstanding */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Outstanding</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {formatCurrency(metrics.totalOutstanding)}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Collection Rate */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Collection Rate</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{metrics.collectionRate}%</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Overdue Count */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue Invoices</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{metrics.overdueCount}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Average Days Overdue */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Days Overdue</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{metrics.averageDaysOverdue} days</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="space-y-4">
            {/* Status Tabs */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Status</p>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'paid', 'pending', 'overdue'] as StatusFilter[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      statusFilter === status
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search by invoice #, client name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Reset Button */}
            {(statusFilter !== 'all' || searchTerm || startDate || endDate) && (
              <button
                onClick={handleResetFilters}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">
              Invoices {invoices.length > 0 && `(${invoices.length})`}
            </h2>
          </div>

          {invoices.length === 0 ? (
            <div className="px-6 py-12 text-center">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No invoices found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or create a new invoice</p>
              <Link
                href="/create"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Create Invoice
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Last Reminder
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.map((invoice) => {
                    const currency = getCurrency(invoice.currency);
                    const total = getTotal(invoice);
                    const isOverdue = !invoice.isPaid && new Date(invoice.dueDate) < new Date();
                    const daysUntilDue = Math.ceil(
                      (new Date(invoice.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    );

                    return (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{invoice.toName}</div>
                          <div className="text-sm text-gray-500">{invoice.toEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(invoice.dueDate)}</div>
                          {!invoice.isPaid && (
                            <div className={`text-xs font-medium ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                              {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days remaining`}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          {invoice.lastReminderSent || invoice.last_reminder_sent ? (
                            <div>
                              <div className="text-sm text-gray-900">
                                {formatDate(invoice.lastReminderSent || invoice.last_reminder_sent || '')}
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedInvoice(invoice);
                                  setIsHistoryModalOpen(true);
                                }}
                                className="text-xs text-primary-600 hover:text-primary-700"
                              >
                                {invoice.reminderCount || invoice.reminder_count || 1} sent - View history
                              </button>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Never</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex gap-2 justify-end">
                            {!invoice.isPaid && (
                              <button
                                onClick={() => handleOpenReminderModal(invoice)}
                                className="text-blue-600 hover:text-blue-700 font-medium"
                              >
                                Send Reminder
                              </button>
                            )}
                            <Link
                              href={`/create?invoiceId=${invoice.id}`}
                              className="text-primary-600 hover:text-primary-700 font-medium"
                            >
                              Edit
                            </Link>
                            <Link
                              href={`/invoices/${invoice.id}`}
                              className="text-primary-600 hover:text-primary-700 font-medium"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => {
                                setInvoiceToDelete(invoice);
                                setIsDeleteConfirming(true);
                              }}
                              className="text-red-600 hover:text-red-700 font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteConfirming && invoiceToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Delete Invoice?</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete invoice <strong>{invoiceToDelete.invoiceNumber}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setIsDeleteConfirming(false);
                    setInvoiceToDelete(null);
                  }}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteInvoice}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isDeleting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Reminder Modal */}
      {selectedInvoice && settings && (
        <SendReminderModal
          invoice={selectedInvoice}
          businessName={settings.defaultFromName || 'Our Business'}
          businessEmail={settings.defaultFromEmail || user?.email || 'invoices@bdsalesinc.ca'}
          isOpen={isReminderModalOpen}
          onClose={handleCloseReminderModal}
          onSend={handleSendReminder}
        />
      )}

      {/* Reminder History Modal */}
      {selectedInvoice && user && (
        <ReminderHistoryModal
          invoice={selectedInvoice}
          userId={user.id}
          isOpen={isHistoryModalOpen}
          onClose={() => {
            setIsHistoryModalOpen(false);
            setSelectedInvoice(null);
          }}
        />
      )}
    </div>
  );
}
