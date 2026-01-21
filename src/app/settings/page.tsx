'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useToastContext } from '@/contexts/ToastContext';
import { useSettings } from '@/hooks/useSettings';
import { CURRENCIES } from '@/types/invoice';

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const { fetchSettings, updateSettings, loading: settingsLoading } = useSettings();
  const { success: showSuccess, error: showError } = useToastContext();

  const [formData, setFormData] = useState({
    defaultFromName: '',
    defaultFromEmail: '',
    defaultFromAddress: '',
    defaultFromPhone: '',
    defaultCurrency: 'USD',
    defaultTaxRate: 0,
    defaultAccentColor: '#2563eb',
    customSenderEmail: '',
  });

  const [showResendGuide, setShowResendGuide] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user || authLoading) return;

    const loadSettings = async () => {
      try {
        const settings = await fetchSettings();
        if (settings) {
          // Auto-populate business name from user's name/email if not set
          const defaultBusinessName = settings.defaultFromName ||
            user?.user_metadata?.full_name ||
            user?.user_metadata?.name ||
            (user?.email ? user.email.split('@')[0] : '');

          // Auto-populate email from user's email if not set
          const defaultEmail = settings.defaultFromEmail || user?.email || '';

          setFormData({
            defaultFromName: defaultBusinessName,
            defaultFromEmail: defaultEmail,
            defaultFromAddress: settings.defaultFromAddress || '',
            defaultFromPhone: settings.defaultFromPhone || '',
            defaultCurrency: settings.defaultCurrency || 'USD',
            defaultTaxRate: settings.defaultTaxRate || 0,
            defaultAccentColor: settings.defaultAccentColor || '#2563eb',
            customSenderEmail: settings.customSenderEmail || '',
          });
          setIsPremium(settings.isPremium || false);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load settings';
        setError(message);
      }
    };

    loadSettings();
  }, [user, authLoading, fetchSettings]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'defaultTaxRate'
          ? parseFloat(value) || 0
          : value,
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      const result = await updateSettings(formData);
      if (!result) {
        showError('Failed to update settings');
        setError('Failed to update settings');
        return;
      }

      showSuccess('Settings saved successfully');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update settings';
      showError(message);
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      showSuccess('Logged out successfully');
      router.push('/auth/login');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to logout';
      showError(message);
      setError(message);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">Manage your account and default invoice settings</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="grid gap-8">
          {/* Account Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Account</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                />
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md text-red-700 font-medium hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Business Defaults Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Default Invoice Settings</h2>

            <div className="space-y-6">
              {/* From Section */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">From (Your Business)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      name="defaultFromName"
                      value={formData.defaultFromName}
                      onChange={handleChange}
                      placeholder="Your Business Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      This name appears on your invoices and email reminders (e.g., "From: {formData.defaultFromName || 'Your Business'}")
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="defaultFromEmail"
                        value={formData.defaultFromEmail}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Client replies to reminders go to this email
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        name="defaultFromPhone"
                        value={formData.defaultFromPhone}
                        onChange={handleChange}
                        placeholder="+1 234 567 890"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      name="defaultFromAddress"
                      value={formData.defaultFromAddress}
                      onChange={handleChange}
                      placeholder="123 Business St&#10;City, State 12345"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Invoice Defaults */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Invoice Defaults</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Default Currency
                      </label>
                      <select
                        name="defaultCurrency"
                        value={formData.defaultCurrency}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      >
                        {CURRENCIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.code} ({c.symbol})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Default Tax Rate (%)
                      </label>
                      <input
                        type="number"
                        name="defaultTaxRate"
                        value={formData.defaultTaxRate}
                        onChange={handleChange}
                        min="0"
                        step="0.1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Accent Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        name="defaultAccentColor"
                        value={formData.defaultAccentColor}
                        onChange={handleChange}
                        className="h-10 w-20 cursor-pointer rounded border border-gray-300"
                      />
                      <span className="text-sm text-gray-600">{formData.defaultAccentColor}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Email Domain Section - Premium Only */}
          <div className={`bg-white rounded-lg shadow p-6 ${!isPremium ? 'relative' : ''}`}>
            {!isPremium && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] rounded-lg z-10 flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 mb-3">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Feature</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Custom email domains are available for Premium users
                  </p>
                  <a
                    href="/pricing"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-medium rounded-lg hover:from-amber-500 hover:to-yellow-600 transition-all"
                  >
                    Upgrade to Premium
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Custom Email Domain</h2>
                <p className="text-sm text-gray-500">Send reminders from your own email domain</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-400 to-yellow-500 text-white">
                Premium
              </span>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-3">
                  By default, email reminders are sent from our verified domain with your email as the reply-to address.
                  If you have your own domain verified with Resend, you can send emails directly from your domain for better deliverability and branding.
                </p>
                <button
                  type="button"
                  onClick={() => setShowResendGuide(!showResendGuide)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
                  disabled={!isPremium}
                >
                  {showResendGuide ? 'Hide' : 'Show'} setup guide
                  <svg
                    className={`ml-1 w-4 h-4 transform transition-transform ${showResendGuide ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {showResendGuide && isPremium && (
                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <h4 className="font-medium text-blue-900 mb-3">How to Set Up Your Own Email Domain (Free)</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                    <li>
                      <strong>Create a Resend account:</strong>{' '}
                      <a
                        href="https://resend.com/signup"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-blue-600"
                      >
                        Sign up at resend.com
                      </a>{' '}
                      (free tier includes 3,000 emails/month)
                    </li>
                    <li>
                      <strong>Add your domain:</strong> Go to Resend Dashboard → Domains → Add Domain
                    </li>
                    <li>
                      <strong>Verify DNS records:</strong> Add the DNS records Resend provides to your domain registrar:
                      <ul className="list-disc list-inside ml-4 mt-1 text-blue-700">
                        <li>SPF record (TXT)</li>
                        <li>DKIM records (CNAME)</li>
                        <li>Optional: DMARC record (TXT)</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Wait for verification:</strong> DNS propagation usually takes a few minutes to hours
                    </li>
                    <li>
                      <strong>Enter your email below:</strong> Use the format <code className="bg-blue-100 px-1 rounded">invoices@yourdomain.com</code>
                    </li>
                  </ol>
                  <p className="mt-3 text-xs text-blue-700">
                    Note: You must use the same Resend account that InvoiceGen uses, or contact support to link accounts.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Sender Email
                </label>
                <input
                  type="email"
                  name="customSenderEmail"
                  value={formData.customSenderEmail}
                  onChange={handleChange}
                  placeholder="invoices@yourdomain.com"
                  disabled={!isPremium}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 ${!isPremium ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Leave empty to use the default sender. Only enter an email from a domain you have verified with Resend.
                </p>
              </div>

              {formData.customSenderEmail && isPremium && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="text-sm text-yellow-800">
                    <strong>Important:</strong> Ensure this domain is verified in Resend before saving.
                    Emails will fail to send if the domain is not properly configured.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex-1 py-3 px-4 border border-gray-300 rounded-md font-medium flex items-center justify-center ${
                saving
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2"></div>
                  Saving...
                </>
              ) : saved ? (
                <>
                  <svg
                    className="w-5 h-5 mr-2 text-green-500"
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
                  Saved!
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
