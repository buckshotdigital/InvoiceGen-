import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Invoice Template - Free Professional Invoice Templates | InvoiceGen',
  description:
    'Free invoice templates for freelancers, contractors, and small businesses. Professional designs with automatic calculations. Download as PDF instantly.',
  keywords: [
    'invoice template',
    'invoice template free',
    'professional invoice template',
    'freelance invoice template',
    'contractor invoice template',
  ],
  alternates: {
    canonical: 'https://invoice-generator-kappa-red.vercel.app/invoice-template',
  },
  openGraph: {
    title: 'Invoice Template - Free Professional Invoice Templates',
    description: 'Free invoice templates for freelancers and small businesses. Download as PDF.',
    type: 'website',
    url: 'https://invoice-generator-kappa-red.vercel.app/invoice-template',
  },
};

export default function InvoiceTemplatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Free Invoice Templates
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Professional invoice templates that make you look credible. Just fill in your details
            and download. No design skills needed.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all"
          >
            Use Template Free
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </section>

        {/* Template Preview */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Invoice Template</h2>
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="h-2 bg-primary-600 -mt-8 -mx-8 mb-6 rounded-t-xl"></div>
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="text-3xl font-bold text-primary-600">INVOICE</div>
              </div>
              <div className="text-right text-sm text-gray-600">
                <p className="font-medium"># INV-2024-0001</p>
                <p>Date: January 13, 2026</p>
                <p>Due: February 12, 2026</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 mb-6 text-sm">
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">From</p>
                <p className="font-semibold">Your Business Name</p>
                <p className="text-gray-600">your@email.com</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">To</p>
                <p className="font-semibold">Client Company</p>
                <p className="text-gray-600">client@email.com</p>
              </div>
            </div>
            <div className="bg-primary-600 text-white text-xs uppercase font-medium py-2 px-4 rounded grid grid-cols-4 mb-2">
              <span>Description</span>
              <span className="text-center">Qty</span>
              <span className="text-right">Price</span>
              <span className="text-right">Amount</span>
            </div>
            <div className="border-b border-gray-100 py-2 px-4 grid grid-cols-4 text-sm">
              <span>Web Development</span>
              <span className="text-center text-gray-600">1</span>
              <span className="text-right text-gray-600">$2,500.00</span>
              <span className="text-right font-medium">$2,500.00</span>
            </div>
            <div className="border-b border-gray-100 py-2 px-4 grid grid-cols-4 text-sm">
              <span>UI Design</span>
              <span className="text-center text-gray-600">1</span>
              <span className="text-right text-gray-600">$1,200.00</span>
              <span className="text-right font-medium">$1,200.00</span>
            </div>
            <div className="flex justify-end mt-4">
              <div className="w-48 text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Subtotal</span>
                  <span>$3,700.00</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span>$370.00</span>
                </div>
                <div className="flex justify-between py-2 font-bold border-t border-primary-600 mt-2">
                  <span>Total</span>
                  <span className="text-primary-600">$4,070.00</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-gray-500 mt-4 text-sm">
            This is a preview. <Link href="/create" className="text-primary-600 hover:underline">Create your own invoice</Link> with your details.
          </p>
        </section>

        {/* Template Types */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Invoice Templates for Every Use Case</h2>
          <p className="text-gray-600 mb-6">
            Our template works for various billing scenarios. Check out our guide on
            <Link href="/blog/invoice-templates-for-freelancers" className="text-primary-600 hover:underline"> invoice templates for freelancers</Link> for
            specific examples.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">Hourly Billing</h3>
              <p className="text-gray-600 text-sm mb-3">
                Bill clients by the hour. Add line items like &ldquo;Development - 10 hours @ $100/hr&rdquo;.
              </p>
              <p className="text-xs text-gray-500">Best for: Consultants, developers, designers</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">Fixed Project</h3>
              <p className="text-gray-600 text-sm mb-3">
                Bill a flat rate for completed projects. One line item with the total project cost.
              </p>
              <p className="text-xs text-gray-500">Best for: Contractors, agencies, one-time projects</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">Retainer</h3>
              <p className="text-gray-600 text-sm mb-3">
                Monthly recurring invoices for ongoing work. Same amount each billing period.
              </p>
              <p className="text-xs text-gray-500">Best for: Marketing agencies, ongoing support</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">Milestone Billing</h3>
              <p className="text-gray-600 text-sm mb-3">
                Bill at project milestones. Multiple invoices throughout a larger project.
              </p>
              <p className="text-xs text-gray-500">Best for: Large projects, construction, development</p>
            </div>
          </div>
        </section>

        {/* What to Include */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What to Include in Your Invoice</h2>
          <p className="text-gray-600 mb-4">
            A professional invoice should include these essential elements. Our template handles the formatting -
            you just fill in the details. Read our complete guide on
            <Link href="/blog/how-to-create-a-professional-invoice" className="text-primary-600 hover:underline"> how to create a professional invoice</Link>.
          </p>
          <ul className="space-y-3">
            {[
              { item: 'Your business name and contact info', required: true },
              { item: 'Client name and contact info', required: true },
              { item: 'Unique invoice number', required: true },
              { item: 'Invoice date and due date', required: true },
              { item: 'Itemized list of services/products', required: true },
              { item: 'Quantities and prices', required: true },
              { item: 'Subtotal, tax, and total', required: true },
              { item: 'Payment terms and methods', required: false },
              { item: 'Late fee policy', required: false },
              { item: 'Your logo (Premium)', required: false },
            ].map((line) => (
              <li key={line.item} className="flex items-center">
                {line.required ? (
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )}
                <span className={line.required ? 'text-gray-900' : 'text-gray-600'}>
                  {line.item}
                  {!line.required && <span className="text-gray-400 ml-1">(optional)</span>}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Invoice Template FAQ</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Are these invoice templates free?</h3>
              <p className="text-gray-600">
                Yes! Our <Link href="/free-invoice-generator" className="text-primary-600 hover:underline">free invoice generator</Link> includes
                professional templates at no cost. Premium features like custom colors and logos are optional upgrades.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I customize the template?</h3>
              <p className="text-gray-600">
                Free users get a professional blue template. <Link href="/pricing" className="text-primary-600 hover:underline">Premium users</Link> can
                customize colors and add their logo for full branding.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What format are the invoices?</h3>
              <p className="text-gray-600">
                Invoices are downloaded as PDF files, which is the standard format for business documents.
                PDFs look the same on any device and are easy to email to clients.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-primary-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Use Our Invoice Template Now</h2>
          <p className="text-gray-600 mb-6">Fill in your details and download a professional invoice in minutes.</p>
          <Link
            href="/create"
            className="inline-flex items-center px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700"
          >
            Create Your Invoice
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} InvoiceGen. Free invoice templates for freelancers and small businesses.</p>
          <div className="mt-4 space-x-4">
            <Link href="/free-invoice-generator" className="hover:text-white">Free Invoice Generator</Link>
            <Link href="/invoice-maker" className="hover:text-white">Invoice Maker</Link>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <Link href="/pricing" className="hover:text-white">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
