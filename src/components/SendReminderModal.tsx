'use client';

import { useState } from 'react';
import { Invoice } from '@/types/invoice';
import { determineReminderType, generateEmailTemplate, ReminderType } from '@/lib/email/templates';

interface SendReminderModalProps {
  invoice: Invoice;
  businessName: string;
  businessEmail: string;
  isOpen: boolean;
  onClose: () => void;
  onSend: (subject: string, reminderType: ReminderType, customMessage?: string) => Promise<void>;
}

interface QuotaInfo {
  isPremium: boolean;
  remindersUsedThisMonth: number;
  remainingReminders: number;
}

export default function SendReminderModal({
  invoice,
  businessName,
  businessEmail,
  isOpen,
  onClose,
  onSend,
}: SendReminderModalProps) {
  const [loading, setSending] = useState(false);
  const [error, setError] = useState('');
  const [subject, setSubject] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [selectedType, setSelectedType] = useState<ReminderType>('overdue_1_7');
  const [showPreview, setShowPreview] = useState(false);
  const [quota, setQuota] = useState<QuotaInfo | null>(null);

  // Generate initial template
  const emailTemplate = generateEmailTemplate(invoice, selectedType, businessName, businessEmail);

  if (!isOpen) return null;

  const handleSend = async () => {
    setSending(true);
    setError('');

    try {
      console.log('🔔 Modal sending reminder...');
      await onSend(subject || emailTemplate.subject, selectedType, customMessage || undefined);
      console.log('✅ Modal: reminder sent successfully');
      // Only close if send was successful
      setSubject('');
      setCustomMessage('');
      // Modal will close via parent state
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send reminder';
      console.error('❌ Modal: send failed:', message);
      setError(message);

      // Check if it's a limit exceeded error
      if (message.includes('monthly reminder limit')) {
        // Keep modal open to show upgrade prompt
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Send Payment Reminder</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Success Message */}
          {!error && loading && (
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-sm text-blue-800">Sending reminder...</p>
            </div>
          )}

          {/* Error Message with Upgrade Prompt */}
          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm font-medium text-red-800 mb-1">Error sending reminder:</p>
              <p className="text-sm text-red-700 mb-3">{error}</p>

              {error.includes('monthly reminder limit') && (
                <div className="mt-4 pt-4 border-t border-red-200">
                  <p className="text-sm text-red-700 mb-3">
                    You're on the Free plan which allows <strong>3 reminders per month</strong>.
                  </p>
                  <a
                    href="/pricing"
                    className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                  >
                    Upgrade to Premium for Unlimited Reminders
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Invoice Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Invoice Number</p>
                <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Client</p>
                <p className="font-medium text-gray-900">{invoice.toName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900 break-all">{invoice.toEmail}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Due Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Reminder Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Reminder Type</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'due_soon' as ReminderType, label: 'Due Soon', desc: '3 days before' },
                { value: 'overdue_1_7' as ReminderType, label: 'Overdue 1-7 days', desc: 'Professional' },
                { value: 'overdue_8_30' as ReminderType, label: 'Overdue 8-30 days', desc: 'Firm notice' },
                { value: 'final_notice' as ReminderType, label: 'Final Notice', desc: 'Serious action' },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`p-3 rounded-lg border-2 text-left transition ${
                    selectedType === type.value
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900">{type.label}</p>
                  <p className="text-xs text-gray-500">{type.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Subject Line */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={emailTemplate.subject}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
            <p className="mt-1 text-xs text-gray-500">Leave blank to use default subject</p>
          </div>

          {/* Email Body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Message</label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Enter your custom message here, or leave blank to use the default template message..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 resize-y"
            />
            <p className="mt-1 text-xs text-gray-500">
              Customize the main message. Leave blank for the default reminder message based on type selected above.
            </p>
          </div>

          {/* Quota Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Free Plan:</strong> 3 reminders per month
            </p>
            <p className="text-sm text-blue-700">
              After this reminder, you'll have sent your reminders for this month.{' '}
              <a href="/pricing" className="font-medium underline hover:no-underline">
                Upgrade to Premium
              </a>{' '}
              for unlimited reminders.
            </p>
          </div>

          {/* Preview Toggle */}
          <div>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {showPreview ? '▼ Hide' : '▶ Show'} Email Preview
            </button>

            {showPreview && (
              <div className="mt-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-600 font-medium mb-2">Subject:</p>
                <p className="text-sm text-gray-900 mb-3">{subject || emailTemplate.subject}</p>
                <p className="text-xs text-gray-600 font-medium mb-2">Message:</p>
                <div className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200 mb-3">
                  {customMessage || (
                    <span className="text-gray-500 italic">Default template message will be used</span>
                  )}
                </div>
                <p className="text-xs text-gray-600 font-medium mb-2">Full Email Preview:</p>
                <div
                  className="text-xs text-gray-700 bg-white p-3 rounded border border-gray-200 max-h-48 overflow-y-auto"
                  dangerouslySetInnerHTML={{
                    __html: emailTemplate.html.substring(0, 500) + '...',
                  }}
                />
              </div>
            )}
          </div>

          {/* Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              ℹ️ This reminder will be sent to <strong>{invoice.toEmail}</strong> and logged in your system.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
            {loading ? 'Sending...' : 'Send Reminder'}
          </button>
        </div>
      </div>
    </div>
  );
}
