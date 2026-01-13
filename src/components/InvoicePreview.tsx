'use client';

import { Invoice, CURRENCIES } from '@/types/invoice';

interface InvoicePreviewProps {
  invoice: Invoice;
}

export default function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const currency = CURRENCIES.find((c) => c.code === invoice.currency) || CURRENCIES[0];
  const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const tax = subtotal * (invoice.taxRate / 100);
  const total = subtotal + tax;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Accent bar */}
      <div className="h-2" style={{ backgroundColor: invoice.accentColor }} />

      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            {invoice.logo && (
              <img src={invoice.logo} alt="Logo" className="h-12 mb-4 object-contain" />
            )}
            <h1 className="text-3xl font-bold" style={{ color: invoice.accentColor }}>
              INVOICE
            </h1>
          </div>
          <div className="text-right text-sm">
            <p className="font-medium"># {invoice.invoiceNumber || 'INV-0000'}</p>
            <p className="text-gray-600">Date: {formatDate(invoice.date)}</p>
            <p className="text-gray-600">Due: {formatDate(invoice.dueDate)}</p>
            {invoice.isPaid && (
              <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                PAID
              </span>
            )}
          </div>
        </div>

        {/* From / To */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">From</p>
            <p className="font-semibold">{invoice.fromName || 'Your Business Name'}</p>
            <p className="text-sm text-gray-600">{invoice.fromEmail}</p>
            <p className="text-sm text-gray-600">{invoice.fromPhone}</p>
            <p className="text-sm text-gray-600 whitespace-pre-line">{invoice.fromAddress}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">To</p>
            <p className="font-semibold">{invoice.toName || 'Client Name'}</p>
            <p className="text-sm text-gray-600">{invoice.toEmail}</p>
            <p className="text-sm text-gray-600 whitespace-pre-line">{invoice.toAddress}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <div
            className="grid grid-cols-12 gap-4 py-3 px-4 text-xs font-medium text-white uppercase tracking-wide rounded-t"
            style={{ backgroundColor: invoice.accentColor }}
          >
            <div className="col-span-6">Description</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>

          <div className="divide-y divide-gray-100">
            {invoice.items.map((item, index) => (
              <div key={item.id || index} className="grid grid-cols-12 gap-4 py-3 px-4 text-sm">
                <div className="col-span-6">{item.description || 'Item'}</div>
                <div className="col-span-2 text-center text-gray-600">{item.quantity}</div>
                <div className="col-span-2 text-right text-gray-600">
                  {currency.symbol}
                  {item.price.toFixed(2)}
                </div>
                <div className="col-span-2 text-right font-medium">
                  {currency.symbol}
                  {(item.quantity * item.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>
                {currency.symbol}
                {subtotal.toFixed(2)}
              </span>
            </div>
            {invoice.taxRate > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax ({invoice.taxRate}%)</span>
                <span>
                  {currency.symbol}
                  {tax.toFixed(2)}
                </span>
              </div>
            )}
            <div
              className="flex justify-between text-lg font-bold pt-2 border-t"
              style={{ borderColor: invoice.accentColor }}
            >
              <span>Total</span>
              <span style={{ color: invoice.accentColor }}>
                {currency.symbol}
                {total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Notes</p>
            <p className="text-sm text-gray-600 whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">Generated with InvoiceGen</p>
        </div>
      </div>
    </div>
  );
}
