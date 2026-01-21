import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Free Invoice Generator - Create, Track & Send Invoices | InvoiceGen',
  description:
    'Create professional invoices in minutes with free cloud storage, payment tracking dashboard, and email reminders. PDF export, tax calculations, multiple currencies. Free signup, premium at $4.99/month.',
  keywords: [
    'free invoice generator',
    'invoice generator',
    'create invoice free',
    'online invoice maker',
    'invoice creator',
    'payment tracking',
    'invoice reminders',
    'cloud invoice',
  ],
  alternates: {
    canonical: 'https://invoice-generator-kappa-red.vercel.app/free-invoice-generator',
  },
  openGraph: {
    title: 'Free Invoice Generator - Create, Track & Send Payment Reminders',
    description: 'Create invoices, track payments, send reminders. Free cloud storage with premium features at $4.99/month.',
    type: 'website',
    url: 'https://invoice-generator-kappa-red.vercel.app/free-invoice-generator',
  },
};

export default function FreeInvoiceGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Free Invoice Generator
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create professional invoices in under 2 minutes. Download as PDF instantly.
            No signup required, no credit card needed.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all"
          >
            Create Your Free Invoice
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <p className="mt-4 text-sm text-gray-500">100% free. No hidden fees.</p>
        </section>

        {/* What is Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What is an Invoice Generator?</h2>
          <p className="text-gray-600 mb-4">
            An invoice generator is a tool that helps freelancers, small business owners, and contractors
            create professional invoices quickly. Instead of manually formatting documents in Word or Excel,
            you simply fill in your details and download a polished PDF ready to send to clients.
          </p>
          <p className="text-gray-600">
            Our free invoice generator includes everything you need: automatic calculations, tax support,
            multiple currencies, and professional formatting that makes you look credible to clients.
          </p>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 font-bold text-xl">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Enter Your Details</h3>
              <p className="text-gray-600 text-sm">
                Add your business info, client details, and line items with prices.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 font-bold text-xl">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Preview Your Invoice</h3>
              <p className="text-gray-600 text-sm">
                See your professional invoice in real-time as you type.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 font-bold text-xl">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Download PDF</h3>
              <p className="text-gray-600 text-sm">
                Click download and get your invoice as a professional PDF file.
              </p>
            </div>
          </div>
        </section>

        {/* Who It's For */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Who Uses Our Free Invoice Generator?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">Freelancers</h3>
              <p className="text-gray-600 text-sm">
                Web developers, designers, writers, and consultants who need to bill clients professionally.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">Small Business Owners</h3>
              <p className="text-gray-600 text-sm">
                Shops, agencies, and service providers who want simple invoicing without expensive software.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">Contractors</h3>
              <p className="text-gray-600 text-sm">
                Construction, plumbing, electrical, and home service professionals.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">Consultants</h3>
              <p className="text-gray-600 text-sm">
                Business, marketing, and IT consultants billing for hourly or project work.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Features Included Free</h2>
          <ul className="grid md:grid-cols-2 gap-4">
            {[
              'Unlimited invoices',
              'PDF download',
              'Multiple currencies (USD, EUR, GBP, etc.)',
              'Automatic tax calculations',
              'Professional templates',
              'Cloud storage (with free account)',
              'Track up to 3 invoices (unlimited with Premium)',
              '3 email reminders per month',
              'Mobile-friendly',
            ].map((feature) => (
              <li key={feature} className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is this invoice generator really free?</h3>
              <p className="text-gray-600">
                Yes! You can create unlimited invoices, track up to 3 invoices in your dashboard, and send up to 3 email reminders per month completely free.
                We offer optional premium features like custom branding, unlimited invoice tracking, and unlimited reminders for $4.99/month, but the core
                invoice generator is free forever.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do I need to create an account?</h3>
              <p className="text-gray-600">
                Creating a free account unlocks cloud storage, payment tracking, and email reminders.
                Your invoices sync across devices and are never lost. Sign up takes 30 seconds.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I add my logo to invoices?</h3>
              <p className="text-gray-600">
                Logo upload is available with our <Link href="/pricing" className="text-primary-600 hover:underline">Premium plan</Link>.
                Free users get professional invoices without custom branding.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What currencies are supported?</h3>
              <p className="text-gray-600">
                We support USD, EUR, GBP, CAD, AUD, INR, and JPY. More currencies coming soon.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-primary-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Create Your Invoice?</h2>
          <p className="text-gray-600 mb-6">Join thousands of freelancers and businesses using InvoiceGen.</p>
          <Link
            href="/create"
            className="inline-flex items-center px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700"
          >
            Create Free Invoice Now
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} InvoiceGen. Free invoice generator for freelancers and small businesses.</p>
          <div className="mt-4 space-x-4">
            <Link href="/invoice-maker" className="hover:text-white">Invoice Maker</Link>
            <Link href="/invoice-template" className="hover:text-white">Invoice Templates</Link>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <Link href="/pricing" className="hover:text-white">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
