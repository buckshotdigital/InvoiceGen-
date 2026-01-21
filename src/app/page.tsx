import Link from 'next/link';
import Header from '@/components/Header';
import { SoftwareAppSchema } from '@/components/schema/SoftwareAppSchema';
import { FAQSchema } from '@/components/schema/FAQSchema';

const homeFAQs = [
  {
    question: 'Is InvoiceGen really free?',
    answer: 'Yes! InvoiceGen offers a free plan that lets you create unlimited invoices, track up to 3 payments, and send 3 email reminders per month. Premium features like custom branding and unlimited tracking are available for $4.99/month.',
  },
  {
    question: 'Do I need to create an account?',
    answer: 'A free account with email or Google Sign-In gives you cloud storage, payment tracking, and email reminders. Your invoices are saved securely and accessible from any device.',
  },
  {
    question: 'Can I add my logo to invoices?',
    answer: 'Yes, premium users can upload their company logo and customize accent colors for fully branded invoices.',
  },
  {
    question: 'How does payment tracking work?',
    answer: 'Mark invoices as paid, pending, or overdue. View your dashboard to see collection rates, overdue amounts, and send payment reminders with one click.',
  },
];

export default function Home() {
  return (
    <>
      <SoftwareAppSchema />
      <FAQSchema faqs={homeFAQs} />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl md:text-7xl">
            Professional Invoices
            <span className="block text-primary-600">in Seconds</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
            Create invoices, track payments, and send reminders. Free cloud storage with your account.
            Perfect for freelancers, consultants, and small businesses.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create"
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all"
            >
              Create Free Invoice
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-lg font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>

        {/* Preview Image */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto border border-gray-100">
            <div className="h-2 bg-primary-600 rounded-t-lg -mt-8 -mx-8 mb-8" />
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="text-4xl font-bold text-primary-600">INVOICE</div>
              </div>
              <div className="text-right text-sm text-gray-600">
                <p className="font-medium"># INV-2024-0001</p>
                <p>Date: January 12, 2026</p>
                <p>Due: February 11, 2026</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
              <div>
                <p className="text-xs text-gray-500 uppercase mb-2">From</p>
                <p className="font-semibold">Your Business Name</p>
                <p className="text-gray-600">you@email.com</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-2">To</p>
                <p className="font-semibold">Client Company</p>
                <p className="text-gray-600">client@email.com</p>
              </div>
            </div>
            <div className="bg-primary-600 text-white text-xs uppercase font-medium py-2 px-4 rounded grid grid-cols-4">
              <span>Description</span>
              <span className="text-center">Qty</span>
              <span className="text-right">Price</span>
              <span className="text-right">Amount</span>
            </div>
            <div className="py-3 px-4 border-b border-gray-100 grid grid-cols-4 text-sm">
              <span>Web Development Services</span>
              <span className="text-center text-gray-600">1</span>
              <span className="text-right text-gray-600">$2,500.00</span>
              <span className="text-right font-medium">$2,500.00</span>
            </div>
            <div className="py-3 px-4 border-b border-gray-100 grid grid-cols-4 text-sm">
              <span>UI/UX Design</span>
              <span className="text-center text-gray-600">1</span>
              <span className="text-right text-gray-600">$1,200.00</span>
              <span className="text-right font-medium">$1,200.00</span>
            </div>
            <div className="flex justify-end mt-4">
              <div className="w-48">
                <div className="flex justify-between py-1 text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>$3,700.00</span>
                </div>
                <div className="flex justify-between py-1 text-sm">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span>$370.00</span>
                </div>
                <div className="flex justify-between py-2 text-lg font-bold border-t border-primary-600 mt-2">
                  <span>Total</span>
                  <span className="text-primary-600">$4,070.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need to Get Paid
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cloud Storage</h3>
              <p className="text-gray-600">
                Free account with cloud storage. Access your invoices from any device, anytime.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">PDF Download</h3>
              <p className="text-gray-600">
                Download your invoices as professional PDFs, ready to send to clients.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Multiple Currencies</h3>
              <p className="text-gray-600">
                Support for USD, EUR, GBP, and more. Invoice clients worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Tracking Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Track & Collect Faster
          </h2>
          <p className="text-center text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Our new payment tracking dashboard and email reminders help you get paid faster
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Dashboard</h3>
              <p className="text-gray-600 mb-4">
                See your invoices at a glance with payment status, due dates, and days overdue. Track collection rates and identify which clients are late. Free plan tracks up to 3 invoices.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                  Track 3 invoices free (unlimited with Premium)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                  Filter by status (paid, pending, overdue)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                  Collection rate metrics
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Reminders</h3>
              <p className="text-gray-600 mb-4">
                Send professional payment reminders with a single click. Automated templates for due soon, overdue, and final notices—Free plan includes 3/month.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                  4 reminder templates
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                  Customizable subject lines
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                  Unlimited reminders with Premium
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 shadow-lg"
            >
              Open Payment Dashboard
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </Link>
            <p className="mt-3 text-sm text-gray-500">Free account required for tracking features</p>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            See It in Action
          </h2>
          <p className="text-center text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            A powerful dashboard to manage all your invoices and payments
          </p>

          {/* Dashboard Mockup */}
          <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden max-w-5xl mx-auto">
            {/* Browser Chrome */}
            <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-gray-700 rounded-lg px-4 py-1.5 text-sm text-gray-400 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  invoicegen.app/dashboard
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="bg-gray-50 p-6">
              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-xs text-gray-500 uppercase">Total Invoiced</p>
                  <p className="text-2xl font-bold text-gray-900">$12,450</p>
                  <p className="text-xs text-green-600">+12% this month</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-xs text-gray-500 uppercase">Collected</p>
                  <p className="text-2xl font-bold text-green-600">$9,200</p>
                  <p className="text-xs text-gray-500">74% collection rate</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-xs text-gray-500 uppercase">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">$2,100</p>
                  <p className="text-xs text-gray-500">3 invoices</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-xs text-gray-500 uppercase">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">$1,150</p>
                  <p className="text-xs text-gray-500">2 invoices</p>
                </div>
              </div>

              {/* Invoice Table */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">Recent Invoices</h3>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">All</span>
                    <span className="px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded">Pending</span>
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">Paid</span>
                  </div>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                    <tr>
                      <th className="px-4 py-2 text-left">Invoice</th>
                      <th className="px-4 py-2 text-left">Client</th>
                      <th className="px-4 py-2 text-left">Amount</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-3 font-medium">INV-2024-0012</td>
                      <td className="px-4 py-3 text-gray-600">Acme Corp</td>
                      <td className="px-4 py-3">$3,500.00</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Paid</span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-primary-600 text-xs">View</button>
                      </td>
                    </tr>
                    <tr className="bg-yellow-50">
                      <td className="px-4 py-3 font-medium">INV-2024-0011</td>
                      <td className="px-4 py-3 text-gray-600">Tech Solutions</td>
                      <td className="px-4 py-3">$2,100.00</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">Due in 5 days</span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-blue-600 text-xs font-medium">Send Reminder</button>
                      </td>
                    </tr>
                    <tr className="bg-red-50">
                      <td className="px-4 py-3 font-medium">INV-2024-0010</td>
                      <td className="px-4 py-3 text-gray-600">Design Studio</td>
                      <td className="px-4 py-3">$1,150.00</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">12 days overdue</span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-red-600 text-xs font-medium">Send Final Notice</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900">One-Click Reminders</h4>
              <p className="text-sm text-gray-600 mt-1">Send payment reminders instantly</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900">Real-Time Stats</h4>
              <p className="text-sm text-gray-600 mt-1">Track collection rates at a glance</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900">Overdue Alerts</h4>
              <p className="text-sm text-gray-600 mt-1">Never miss a late payment</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Create Your First Invoice?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of freelancers and small businesses who trust InvoiceGen.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 shadow-lg"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <svg
                className="w-8 h-8 text-primary-400"
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
              <span className="text-xl font-bold">InvoiceGen</span>
            </div>
            <div className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} InvoiceGen. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}
