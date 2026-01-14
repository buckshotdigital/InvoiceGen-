import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'How to Create a Professional Invoice (Complete Guide) | InvoiceGen',
  description:
    'Learn how to create professional invoices step-by-step. Includes what to include, common mistakes to avoid, and free templates.',
  keywords: [
    'how to create an invoice',
    'how to make an invoice',
    'professional invoice',
    'invoice guide',
    'create invoice',
  ],
  alternates: {
    canonical: 'https://invoice-gen-two-rho.vercel.app/blog/how-to-create-a-professional-invoice',
  },
};

export default function HowToCreateInvoicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-16">
        <article>
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/blog" className="hover:text-primary-600">
              Blog
            </Link>
            <span className="mx-2">/</span>
            <span>How to Create a Professional Invoice</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              How to Create a Professional Invoice (Complete Guide)
            </h1>
            <div className="flex items-center text-sm text-gray-500">
              <span>January 13, 2026</span>
              <span className="mx-2">·</span>
              <span>8 min read</span>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8">
              A professional invoice does more than request payment - it builds trust with your
              clients and reflects the quality of your work. This guide covers everything you need
              to know about creating invoices that get paid on time.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              What to Include on Every Invoice
            </h2>
            <p className="text-gray-600 mb-4">
              A complete invoice should include these essential elements:
            </p>

            <div className="bg-white rounded-lg border border-gray-200 p-6 my-6">
              <h3 className="font-semibold text-gray-900 mb-3">Required Information</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>
                    <strong>Your business information:</strong> Name, address, email, phone number
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>
                    <strong>Client information:</strong> Name, company, address
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>
                    <strong>Invoice number:</strong> Unique identifier for tracking (e.g.,
                    INV-2024-001)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>
                    <strong>Dates:</strong> Invoice date and payment due date
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>
                    <strong>Line items:</strong> Description, quantity, and price for each
                    service/product
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>
                    <strong>Totals:</strong> Subtotal, tax (if applicable), and final total
                  </span>
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              Step-by-Step: Creating Your Invoice
            </h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              1. Add Your Business Details
            </h3>
            <p className="text-gray-600 mb-4">
              Start with your business name, address, email, and phone. This is typically at the
              top of the invoice. If you have a logo, include it to reinforce your brand (available
              with <Link href="/pricing" className="text-primary-600 hover:underline">InvoiceGen Premium</Link>).
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              2. Add Client Information
            </h3>
            <p className="text-gray-600 mb-4">
              Include your client&apos;s name or company name and address. This helps with record-keeping
              and ensures the invoice reaches the right person.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              3. Create a Unique Invoice Number
            </h3>
            <p className="text-gray-600 mb-4">
              Use a consistent numbering system. A common format is: INV-YEAR-NUMBER (e.g.,
              INV-2024-0042). Our{' '}
              <Link href="/free-invoice-generator" className="text-primary-600 hover:underline">
                free invoice generator
              </Link>{' '}
              creates these automatically.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              4. Set Clear Dates
            </h3>
            <p className="text-gray-600 mb-4">
              Include the invoice date (when you&apos;re sending it) and a due date. Common payment
              terms are Net 15 (due in 15 days) or Net 30 (due in 30 days).
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              5. List Your Services/Products
            </h3>
            <p className="text-gray-600 mb-4">
              Be specific. Instead of &ldquo;Design work - $500&rdquo;, try &ldquo;Homepage redesign including
              mobile responsive layout - $500&rdquo;. Clients appreciate knowing exactly what they&apos;re
              paying for.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              6. Calculate Totals
            </h3>
            <p className="text-gray-600 mb-4">
              Show the subtotal, any applicable taxes, and the final total. Our{' '}
              <Link href="/invoice-maker" className="text-primary-600 hover:underline">
                invoice maker
              </Link>{' '}
              handles these calculations automatically.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              Common Invoice Mistakes to Avoid
            </h2>

            <div className="bg-red-50 border border-red-100 rounded-lg p-6 my-6">
              <h3 className="font-semibold text-red-800 mb-3">Mistakes That Delay Payment</h3>
              <ul className="space-y-2 text-red-700">
                <li>
                  <strong>Missing payment terms:</strong> Always specify when payment is due
                </li>
                <li>
                  <strong>Vague descriptions:</strong> Be specific about what you delivered
                </li>
                <li>
                  <strong>Wrong client details:</strong> Double-check names and addresses
                </li>
                <li>
                  <strong>No invoice number:</strong> Makes tracking and follow-up difficult
                </li>
                <li>
                  <strong>Sending late:</strong> Invoice immediately when work is complete
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              Sample Invoice (Example)
            </h2>
            <p className="text-gray-600 mb-4">
              Here&apos;s what a professional invoice looks like. Use our{' '}
              <Link href="/invoice-template" className="text-primary-600 hover:underline">
                free invoice template
              </Link>{' '}
              to create your own:
            </p>

            <div className="bg-white rounded-lg border border-gray-200 p-6 my-6 text-sm">
              <div className="border-t-4 border-primary-600 -mt-6 -mx-6 mb-4"></div>
              <div className="flex justify-between mb-4">
                <div>
                  <strong className="text-lg text-primary-600">INVOICE</strong>
                  <br />
                  <span className="text-gray-600">Your Business Name</span>
                  <br />
                  <span className="text-gray-600">your@email.com</span>
                </div>
                <div className="text-right text-gray-600">
                  <strong>#INV-2024-0001</strong>
                  <br />
                  Date: Jan 13, 2026
                  <br />
                  Due: Feb 12, 2026
                </div>
              </div>
              <div className="mb-4">
                <span className="text-gray-500 text-xs uppercase">Bill To:</span>
                <br />
                Client Company Name
              </div>
              <table className="w-full mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-2">Description</th>
                    <th className="text-right p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">Website Development</td>
                    <td className="text-right p-2">$2,500.00</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Logo Design</td>
                    <td className="text-right p-2">$500.00</td>
                  </tr>
                </tbody>
              </table>
              <div className="text-right">
                <div className="text-gray-600">Subtotal: $3,000.00</div>
                <div className="text-gray-600">Tax (10%): $300.00</div>
                <div className="font-bold text-lg text-primary-600 mt-2">Total: $3,300.00</div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              Payment Terms to Include
            </h2>
            <p className="text-gray-600 mb-4">Add these in the notes section of your invoice:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>
                <strong>Payment due date:</strong> &ldquo;Payment due within 30 days&rdquo;
              </li>
              <li>
                <strong>Accepted payment methods:</strong> &ldquo;Pay via bank transfer, credit card, or
                PayPal&rdquo;
              </li>
              <li>
                <strong>Bank details:</strong> If accepting transfers, include your account info
              </li>
              <li>
                <strong>Late fee policy:</strong> &ldquo;A 1.5% monthly fee applies to overdue balances&rdquo;
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Next Steps</h2>
            <p className="text-gray-600 mb-4">
              Now that you know how to create a professional invoice:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-8">
              <li>
                <Link href="/free-invoice-generator" className="text-primary-600 hover:underline">
                  Create your first invoice
                </Link>{' '}
                using our free generator
              </li>
              <li>
                Read our guide on{' '}
                <Link
                  href="/blog/best-practices-for-getting-paid-faster"
                  className="text-primary-600 hover:underline"
                >
                  getting paid faster
                </Link>
              </li>
              <li>
                Choose the right{' '}
                <Link
                  href="/blog/invoice-templates-for-freelancers"
                  className="text-primary-600 hover:underline"
                >
                  invoice template for your work
                </Link>
              </li>
            </ul>
          </div>

          {/* CTA Box */}
          <div className="bg-primary-50 rounded-xl p-8 mt-12 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Ready to Create Your Invoice?
            </h3>
            <p className="text-gray-600 mb-6">
              Use our free invoice generator to create professional invoices in minutes.
            </p>
            <Link
              href="/create"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700"
            >
              Create Invoice Now
            </Link>
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} InvoiceGen. Free invoice generator.</p>
          <div className="mt-4 space-x-4">
            <Link href="/free-invoice-generator" className="hover:text-white">Free Invoice Generator</Link>
            <Link href="/invoice-maker" className="hover:text-white">Invoice Maker</Link>
            <Link href="/invoice-template" className="hover:text-white">Templates</Link>
            <Link href="/blog" className="hover:text-white">Blog</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
