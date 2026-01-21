import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Invoice Maker - Create & Send Professional Invoices | InvoiceGen',
  description:
    'Make professional invoices online in minutes. Free invoice maker with automatic calculations, multiple currencies, and instant PDF download. Perfect for freelancers.',
  keywords: [
    'invoice maker',
    'make invoice online',
    'invoice creator',
    'create invoice',
    'online invoice maker',
  ],
  alternates: {
    canonical: 'https://invoice-generator-kappa-red.vercel.app/invoice-maker',
  },
  openGraph: {
    title: 'Invoice Maker - Create & Send Professional Invoices',
    description: 'Make professional invoices online in minutes. Free, fast, and easy to use.',
    type: 'website',
    url: 'https://invoice-generator-kappa-red.vercel.app/invoice-maker',
  },
};

export default function InvoiceMakerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Invoice Maker
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Make professional invoices that get you paid faster. Our invoice maker handles
            the formatting so you can focus on your work.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all"
          >
            Make an Invoice (Free)
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </section>

        {/* Why Use an Invoice Maker */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Use an Online Invoice Maker?</h2>
          <p className="text-gray-600 mb-4">
            Creating invoices manually in Word or Excel is time-consuming and error-prone.
            An invoice maker automates the boring parts: formatting, calculations, and professional
            layout. You just enter your information and get a polished invoice ready to send.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold text-gray-900 mb-2">Save Time</h3>
              <p className="text-gray-600 text-sm">
                Create invoices in under 2 minutes instead of 15+ minutes with manual methods.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="text-3xl mb-3">✓</div>
              <h3 className="font-semibold text-gray-900 mb-2">Avoid Errors</h3>
              <p className="text-gray-600 text-sm">
                Automatic calculations mean no more math mistakes on your invoices.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="text-3xl mb-3">💼</div>
              <h3 className="font-semibold text-gray-900 mb-2">Look Professional</h3>
              <p className="text-gray-600 text-sm">
                Clean, modern design that builds trust with your clients.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What Our Invoice Maker Includes</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Auto Calculations', desc: 'Subtotals, taxes, and totals calculated automatically' },
              { title: 'Multiple Currencies', desc: 'Bill clients in USD, EUR, GBP, and more' },
              { title: 'PDF Export', desc: 'Download professional PDFs instantly' },
              { title: 'Invoice Numbering', desc: 'Automatic sequential invoice numbers' },
              { title: 'Due Date Tracking', desc: 'Set payment terms and due dates' },
              { title: 'Tax Support', desc: 'Add tax rates and see calculated amounts' },
              { title: 'Notes Section', desc: 'Add payment terms, bank details, or thank you notes' },
              { title: 'Paid Status', desc: 'Mark invoices as paid for your records' },
            ].map((feature) => (
              <div key={feature.title} className="flex items-start p-4 bg-white rounded-lg border border-gray-100">
                <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tips Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tips for Making Invoices That Get Paid</h2>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">1. Send Invoices Promptly</h3>
              <p className="text-gray-600">
                Send your invoice as soon as the work is complete. The longer you wait, the longer you wait to get paid.
                Learn more in our guide on <Link href="/blog/best-practices-for-getting-paid-faster" className="text-primary-600 hover:underline">getting paid faster</Link>.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">2. Be Clear About Payment Terms</h3>
              <p className="text-gray-600">
                Specify when payment is due (Net 15, Net 30) and include your preferred payment methods in the notes section.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">3. Itemize Your Work</h3>
              <p className="text-gray-600">
                Break down your services into line items so clients understand exactly what they&apos;re paying for.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Invoice Maker FAQ</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How do I make an invoice online?</h3>
              <p className="text-gray-600">
                Click &ldquo;Make an Invoice&rdquo; above, fill in your business details and client information,
                add your line items with prices, and click download. It takes about 2 minutes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is this invoice maker free?</h3>
              <p className="text-gray-600">
                Yes! Our <Link href="/free-invoice-generator" className="text-primary-600 hover:underline">free invoice generator</Link> lets
                you create unlimited invoices at no cost. Premium features like custom branding are optional.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I save my invoices?</h3>
              <p className="text-gray-600">
                Yes, invoices are saved locally in your browser. You can view and re-download them anytime from the &ldquo;My Invoices&rdquo; page.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-primary-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Start Making Professional Invoices</h2>
          <p className="text-gray-600 mb-6">No signup required. Create your first invoice in under 2 minutes.</p>
          <Link
            href="/create"
            className="inline-flex items-center px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700"
          >
            Make Your Invoice Now
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} InvoiceGen. Free invoice maker for freelancers and small businesses.</p>
          <div className="mt-4 space-x-4">
            <Link href="/free-invoice-generator" className="hover:text-white">Free Invoice Generator</Link>
            <Link href="/invoice-template" className="hover:text-white">Invoice Templates</Link>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <Link href="/pricing" className="hover:text-white">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
