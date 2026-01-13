'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Invoice, InvoiceItem, DEFAULT_INVOICE, CURRENCIES } from '@/types/invoice';
import { storage } from '@/lib/storage';
import { generatePDF } from '@/lib/generatePDF';
import InvoicePreview from './InvoicePreview';

interface InvoiceFormProps {
  invoiceId?: string;
}

export default function InvoiceForm({ invoiceId }: InvoiceFormProps) {
  const [invoice, setInvoice] = useState<Invoice>(() => ({
    ...DEFAULT_INVOICE,
    id: uuidv4(),
    invoiceNumber: '',
    createdAt: new Date().toISOString(),
  }));
  const [isPremium, setIsPremium] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const settings = storage.getSettings();
    setIsPremium(settings.isPremium);

    if (invoiceId) {
      const existing = storage.getInvoice(invoiceId);
      if (existing) {
        setInvoice(existing);
        return;
      }
    }

    // Apply defaults for new invoice
    setInvoice((prev) => ({
      ...prev,
      invoiceNumber: storage.getNextInvoiceNumber(),
      fromName: settings.defaultFromName,
      fromEmail: settings.defaultFromEmail,
      fromAddress: settings.defaultFromAddress,
      fromPhone: settings.defaultFromPhone,
      currency: settings.defaultCurrency,
      taxRate: settings.defaultTaxRate,
      accentColor: settings.defaultAccentColor,
      logo: settings.logo,
    }));
  }, [invoiceId]);

  const updateField = (field: keyof Invoice, value: string | number | boolean) => {
    setInvoice((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
    setSaved(false);
  };

  const addItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [...prev.items, { id: uuidv4(), description: '', quantity: 1, price: 0 }],
    }));
  };

  const removeItem = (index: number) => {
    if (invoice.items.length <= 1) return;
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      updateField('logo', base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    storage.saveInvoice(invoice);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDownload = async () => {
    await generatePDF(invoice);
  };

  const currency = CURRENCIES.find((c) => c.code === invoice.currency) || CURRENCIES[0];
  const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const tax = subtotal * (invoice.taxRate / 100);
  const total = subtotal + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-8">
        {/* Form */}
        <div className="space-y-6">
          {/* Invoice Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoice Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={invoice.invoiceNumber}
                  onChange={(e) => updateField('invoiceNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select
                  value={invoice.currency}
                  onChange={(e) => updateField('currency', e.target.value)}
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
                  Invoice Date
                </label>
                <input
                  type="date"
                  value={invoice.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={invoice.dueDate}
                  onChange={(e) => updateField('dueDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {/* From Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">From (Your Business)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  value={invoice.fromName}
                  onChange={(e) => updateField('fromName', e.target.value)}
                  placeholder="Your Business Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={invoice.fromEmail}
                    onChange={(e) => updateField('fromEmail', e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={invoice.fromPhone}
                    onChange={(e) => updateField('fromPhone', e.target.value)}
                    placeholder="+1 234 567 890"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={invoice.fromAddress}
                  onChange={(e) => updateField('fromAddress', e.target.value)}
                  placeholder="123 Business St&#10;City, State 12345"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {/* To Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">To (Client)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                <input
                  type="text"
                  value={invoice.toName}
                  onChange={(e) => updateField('toName', e.target.value)}
                  placeholder="Client Name or Company"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={invoice.toEmail}
                  onChange={(e) => updateField('toEmail', e.target.value)}
                  placeholder="client@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={invoice.toAddress}
                  onChange={(e) => updateField('toAddress', e.target.value)}
                  placeholder="Client Address"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Items</h2>
            <div className="space-y-4">
              {invoice.items.map((item, index) => (
                <div key={item.id} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="Description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div className="w-20">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      min="1"
                      placeholder="Qty"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div className="w-28">
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      placeholder="Price"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <button
                    onClick={() => removeItem(index)}
                    className="p-2 text-gray-400 hover:text-red-500"
                    disabled={invoice.items.length <= 1}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={addItem}
                className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Item
              </button>
            </div>

            {/* Tax */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Tax Rate (%)</label>
                <input
                  type="number"
                  value={invoice.taxRate}
                  onChange={(e) => updateField('taxRate', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.1"
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Totals */}
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  {currency.symbol}
                  {subtotal.toFixed(2)}
                </span>
              </div>
              {invoice.taxRate > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax ({invoice.taxRate}%)</span>
                  <span className="font-medium">
                    {currency.symbol}
                    {tax.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                <span>Total</span>
                <span className="text-primary-600">
                  {currency.symbol}
                  {total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Options */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Options</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={invoice.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="Payment terms, bank details, thank you message..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPaid"
                  checked={invoice.isPaid}
                  onChange={(e) => updateField('isPaid', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isPaid" className="ml-2 text-sm text-gray-700">
                  Mark as Paid
                </label>
              </div>

              {/* Premium Features */}
              <div className={`space-y-4 ${!isPremium ? 'opacity-50' : ''}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Accent Color
                    {!isPremium && (
                      <span className="ml-2 text-xs text-yellow-600">(Premium)</span>
                    )}
                  </span>
                  <input
                    type="color"
                    value={invoice.accentColor}
                    onChange={(e) => updateField('accentColor', e.target.value)}
                    disabled={!isPremium}
                    className="h-10 w-20 cursor-pointer rounded border border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo
                    {!isPremium && <span className="ml-2 text-xs text-yellow-600">(Premium)</span>}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={!isPremium}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                  {invoice.logo && (
                    <div className="mt-2">
                      <img src={invoice.logo} alt="Logo preview" className="h-12 object-contain" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 flex items-center justify-center"
            >
              {saved ? (
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
                'Save Invoice'
              )}
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 py-3 px-4 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download PDF
            </button>
          </div>

          {/* Mobile Preview Toggle */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="lg:hidden w-full py-3 px-4 border border-primary-600 text-primary-600 rounded-md font-medium"
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>

        {/* Preview */}
        <div className={`lg:block ${showPreview ? 'block' : 'hidden'}`}>
          <div className="sticky top-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
            <InvoicePreview invoice={invoice} />
          </div>
        </div>
      </div>
    </div>
  );
}
