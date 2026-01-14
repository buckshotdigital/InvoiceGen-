import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Best Practices for Getting Paid Faster | InvoiceGen',
  description:
    'Practical tips to reduce payment delays. Learn about payment terms, follow-up strategies, and invoice best practices that help you get paid on time.',
  keywords: [
    'get paid faster',
    'invoice payment tips',
    'payment terms',
    'invoice follow up',
    'reduce late payments',
  ],
  alternates: {
    canonical: 'https://invoice-gen-two-rho.vercel.app/blog/best-practices-for-getting-paid-faster',
  },
};

export default function GetPaidFasterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-16">
        <article>
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/blog" className="hover:text-primary-600">Blog</Link>
            <span className="mx-2">/</span>
            <span>Best Practices for Getting Paid Faster</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Best Practices for Getting Paid Faster
            </h1>
            <div className="flex items-center text-sm text-gray-500">
              <span>January 11, 2026</span>
              <span className="mx-2">·</span>
              <span>5 min read</span>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8">
              Late payments are one of the biggest challenges for freelancers and small businesses.
              These practical strategies will help you get paid faster and reduce the stress of
              chasing invoices.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              1. Invoice Immediately
            </h2>
            <p className="text-gray-600 mb-4">
              The single most important factor in getting paid quickly is timing. Send your invoice
              as soon as the work is complete - ideally the same day.
            </p>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 my-6">
              <p className="text-blue-800 text-sm">
                <strong>Research shows:</strong> Invoices sent within 24 hours of project completion
                are paid 1.5x faster than those sent a week later. The work is still fresh in
                your client&apos;s mind, making them more likely to pay promptly.
              </p>
            </div>
            <p className="text-gray-600 mb-4">
              Use our <Link href="/invoice-maker" className="text-primary-600 hover:underline">invoice maker</Link> to
              create and send invoices in under 2 minutes.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              2. Set Clear Payment Terms Upfront
            </h2>
            <p className="text-gray-600 mb-4">
              Don&apos;t leave payment terms vague. Specify exactly when payment is due and what methods
              you accept. Include this in your contract AND on every invoice.
            </p>

            <div className="bg-white rounded-lg border border-gray-200 p-6 my-6">
              <h3 className="font-semibold text-gray-900 mb-3">Common Payment Terms</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-2">Term</th>
                    <th className="text-left p-2">Meaning</th>
                    <th className="text-left p-2">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Due on Receipt</td>
                    <td className="p-2">Pay immediately</td>
                    <td className="p-2">Small amounts, one-time clients</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Net 7</td>
                    <td className="p-2">Due in 7 days</td>
                    <td className="p-2">Trusted clients, small projects</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Net 15</td>
                    <td className="p-2">Due in 15 days</td>
                    <td className="p-2">Regular clients, mid-size projects</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Net 30</td>
                    <td className="p-2">Due in 30 days</td>
                    <td className="p-2">Enterprise clients, large invoices</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-gray-600 mb-4">
              <strong>Pro tip:</strong> Start with Net 15 instead of Net 30. Many clients will pay
              at the deadline regardless, so a shorter term means faster payment.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              3. Make Payment Easy
            </h2>
            <p className="text-gray-600 mb-4">
              The easier it is to pay, the faster clients will do it. Offer multiple payment options:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>
                <strong>Credit/debit cards</strong> - Fastest option, use Stripe or Square
              </li>
              <li>
                <strong>Bank transfer (ACH)</strong> - Lower fees, good for large amounts
              </li>
              <li>
                <strong>PayPal/Venmo</strong> - Convenient for smaller invoices
              </li>
              <li>
                <strong>Wire transfer</strong> - For international clients
              </li>
            </ul>
            <p className="text-gray-600 mb-4">
              Include your payment details directly on the invoice so clients don&apos;t have to ask.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              4. Request Deposits for Large Projects
            </h2>
            <p className="text-gray-600 mb-4">
              For projects over $1,000, request 25-50% upfront. This:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Confirms the client is serious and has budget</li>
              <li>Reduces your risk if the project is cancelled</li>
              <li>Improves your cash flow during the project</li>
              <li>Makes the final invoice smaller and easier to pay</li>
            </ul>

            <div className="bg-green-50 border border-green-100 rounded-lg p-4 my-6">
              <p className="text-green-800 text-sm">
                <strong>Script to use:</strong> &ldquo;For projects of this size, I require a 50% deposit
                to reserve your spot in my schedule. The remaining 50% is due upon completion.&rdquo;
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              5. Follow Up Strategically
            </h2>
            <p className="text-gray-600 mb-4">
              Most late payments aren&apos;t intentional - they&apos;re forgotten. A polite follow-up schedule
              keeps your invoice top of mind:
            </p>

            <div className="bg-white rounded-lg border border-gray-200 p-6 my-6">
              <h3 className="font-semibold text-gray-900 mb-3">Follow-Up Schedule</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs mr-3 mt-0.5">
                    Day 1
                  </span>
                  <span>Send invoice with thank you note</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded text-xs mr-3 mt-0.5">
                    Day 7
                  </span>
                  <span>&ldquo;Just checking in - let me know if you have any questions about the invoice&rdquo;</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-orange-200 text-orange-800 px-2 py-0.5 rounded text-xs mr-3 mt-0.5">
                    Due Date
                  </span>
                  <span>&ldquo;Friendly reminder: Invoice #X is due today&rdquo;</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-red-200 text-red-800 px-2 py-0.5 rounded text-xs mr-3 mt-0.5">
                    Day 7 Late
                  </span>
                  <span>&ldquo;Your invoice is now 7 days overdue. Please arrange payment at your earliest convenience&rdquo;</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-red-300 text-red-900 px-2 py-0.5 rounded text-xs mr-3 mt-0.5">
                    Day 14+ Late
                  </span>
                  <span>Phone call + written notice of late fee</span>
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              6. Add a Late Fee Policy
            </h2>
            <p className="text-gray-600 mb-4">
              A late fee policy encourages on-time payment and compensates you for the hassle of
              chasing payments. Include it on every invoice:
            </p>

            <div className="bg-gray-100 rounded-lg p-4 my-6 font-mono text-sm">
              <p>&ldquo;Payment is due within 15 days. Invoices not paid within 30 days will incur a
              1.5% monthly interest charge on the outstanding balance.&rdquo;</p>
            </div>

            <p className="text-gray-600 mb-4">
              <strong>Important:</strong> Actually enforce it. If clients learn there&apos;s no
              consequence for paying late, they&apos;ll continue doing so.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              7. Build Relationships, Not Just Transactions
            </h2>
            <p className="text-gray-600 mb-4">
              Clients pay people they like and trust faster than anonymous vendors. Build rapport by:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Communicating proactively during projects</li>
              <li>Delivering quality work on time</li>
              <li>Being pleasant and professional in all interactions</li>
              <li>Sending a thank you note with your invoice</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              Quick Wins: Things You Can Do Today
            </h2>

            <div className="bg-primary-50 border border-primary-100 rounded-lg p-6 my-6">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span>
                    <strong>Send any outstanding invoices</strong> - If you have completed work you
                    haven&apos;t invoiced yet, do it now using our{' '}
                    <Link href="/free-invoice-generator" className="text-primary-600 hover:underline">
                      free invoice generator
                    </Link>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span>
                    <strong>Follow up on overdue invoices</strong> - Send a polite reminder today
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span>
                    <strong>Update your payment terms</strong> - Consider switching from Net 30 to Net 15
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span>
                    <strong>Add payment options</strong> - Set up Stripe or PayPal if you haven&apos;t
                  </span>
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              Related Resources
            </h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li>
                <Link href="/blog/how-to-create-a-professional-invoice" className="text-primary-600 hover:underline">
                  How to Create a Professional Invoice
                </Link>{' '}
                - Complete guide with examples
              </li>
              <li>
                <Link href="/blog/invoice-templates-for-freelancers" className="text-primary-600 hover:underline">
                  Invoice Templates for Freelancers
                </Link>{' '}
                - Hourly, project, and retainer formats
              </li>
              <li>
                <Link href="/invoice-template" className="text-primary-600 hover:underline">
                  Free Invoice Templates
                </Link>{' '}
                - Download and use immediately
              </li>
            </ul>
          </div>

          {/* CTA Box */}
          <div className="bg-primary-50 rounded-xl p-8 mt-12 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Send Professional Invoices That Get Paid
            </h3>
            <p className="text-gray-600 mb-6">
              Create and download invoices in under 2 minutes with our free tool.
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
          <p>&copy; {new Date().getFullYear()} InvoiceGen. Get paid faster.</p>
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
