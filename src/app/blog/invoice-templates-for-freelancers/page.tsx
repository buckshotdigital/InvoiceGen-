import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import { ArticleSchema } from '@/components/schema/ArticleSchema';
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema';
import { FAQSchema } from '@/components/schema/FAQSchema';

export const metadata: Metadata = {
  title: 'Invoice Templates for Freelancers: Hourly, Project & Retainer | InvoiceGen',
  description:
    'Free invoice templates for freelancers. Learn which invoice format to use for hourly work, fixed projects, retainers, and milestone billing.',
  keywords: [
    'invoice template freelancer',
    'freelance invoice template',
    'hourly invoice template',
    'project invoice template',
    'retainer invoice',
  ],
  alternates: {
    canonical: 'https://invoice-generator-kappa-red.vercel.app/blog/invoice-templates-for-freelancers',
  },
};

export default function InvoiceTemplatesFreelancersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ArticleSchema
        title="Invoice Templates for Freelancers: Hourly, Project & Retainer"
        description="Free invoice templates for freelancers. Learn which invoice format to use for hourly work, fixed projects, retainers, and milestone billing."
        publishedDate="2026-01-12"
        modifiedDate="2026-01-12"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://invoice-generator-kappa-red.vercel.app" },
          { name: "Blog", url: "https://invoice-generator-kappa-red.vercel.app/blog" },
          { name: "Invoice Templates for Freelancers", url: "https://invoice-generator-kappa-red.vercel.app/blog/invoice-templates-for-freelancers" },
        ]}
      />
      <FAQSchema
        faqs={[
          {
            question: "What is the best invoice format for hourly work?",
            answer: "For hourly work, use an invoice with columns for Description, Hours, Rate, and Amount. Track hours daily and break down work into specific tasks (e.g., 'Website Development - 20 hours @ $100/hr'). Invoice weekly or bi-weekly with Net 15 or Net 30 terms."
          },
          {
            question: "How should I invoice for fixed-price projects?",
            answer: "For fixed-price projects, list the project name with a brief description of deliverables and a single total amount. Common terms are 50% upfront and 50% on completion. Always include a detailed scope of what's delivered to avoid confusion."
          },
          {
            question: "What is a retainer invoice and when should I use it?",
            answer: "A retainer invoice is for recurring monthly payments for ongoing work. Invoice on the 1st of each month, paid in advance. Include the service period and description of services covered. Retainers are ideal for long-term clients needing consistent support."
          },
          {
            question: "What is milestone billing and how does it work?",
            answer: "Milestone billing breaks large projects into phases with payment due at each milestone. For example: 25% at project start, 25% at design completion, 25% at development, 25% at launch. This reduces risk for both parties on big projects."
          },
          {
            question: "What late fee should I include on freelance invoices?",
            answer: "Common late fee options include: 1.5% monthly interest on overdue amounts, a flat $25 late fee after 30 days, or stating that accounts over 60 days may have work paused. Choose what works for your business and actually enforce it."
          }
        ]}
      />
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-16">
        <article>
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/blog" className="hover:text-primary-600">Blog</Link>
            <span className="mx-2">/</span>
            <span>Invoice Templates for Freelancers</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Invoice Templates for Freelancers: Hourly, Project & Retainer
            </h1>
            <div className="flex items-center text-sm text-gray-500">
              <span>January 12, 2026</span>
              <span className="mx-2">·</span>
              <span>6 min read</span>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8">
              Different types of work require different invoice formats. This guide shows you which
              invoice template to use for hourly billing, fixed-price projects, retainers, and
              milestone payments - with examples for each.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              1. Hourly Billing Invoice Template
            </h2>
            <p className="text-gray-600 mb-4">
              Use hourly invoices when you charge clients based on time spent. This is common for
              consultants, developers, designers, and lawyers.
            </p>

            <div className="bg-white rounded-lg border border-gray-200 p-6 my-6">
              <h3 className="font-semibold text-gray-900 mb-3">Example: Hourly Invoice</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-2">Description</th>
                    <th className="text-center p-2">Hours</th>
                    <th className="text-right p-2">Rate</th>
                    <th className="text-right p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">Website Development</td>
                    <td className="text-center p-2">20</td>
                    <td className="text-right p-2">$100/hr</td>
                    <td className="text-right p-2">$2,000</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Bug Fixes & Testing</td>
                    <td className="text-center p-2">5</td>
                    <td className="text-right p-2">$100/hr</td>
                    <td className="text-right p-2">$500</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Client Meetings</td>
                    <td className="text-center p-2">3</td>
                    <td className="text-right p-2">$100/hr</td>
                    <td className="text-right p-2">$300</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="text-right p-2 font-bold">Total:</td>
                    <td className="text-right p-2 font-bold text-primary-600">$2,800</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 my-6">
              <p className="text-blue-800 text-sm">
                <strong>Pro tip:</strong> Track your hours daily using a time tracking tool. This
                makes invoicing faster and gives you documentation if clients question your hours.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              2. Fixed Project Invoice Template
            </h2>
            <p className="text-gray-600 mb-4">
              Use fixed-price invoices when you&apos;ve agreed on a total project cost upfront. This is
              common for defined deliverables like logo design, website builds, or marketing
              campaigns.
            </p>

            <div className="bg-white rounded-lg border border-gray-200 p-6 my-6">
              <h3 className="font-semibold text-gray-900 mb-3">Example: Fixed Project Invoice</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-2">Description</th>
                    <th className="text-right p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">
                      <strong>Brand Identity Package</strong>
                      <br />
                      <span className="text-gray-500 text-xs">
                        Includes: Logo design, color palette, typography, brand guidelines PDF
                      </span>
                    </td>
                    <td className="text-right p-2 align-top">$3,500</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td className="text-right p-2 font-bold">Total:</td>
                    <td className="text-right p-2 font-bold text-primary-600">$3,500</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <p className="text-gray-600 mb-4">
              <strong>When to use:</strong> Best when the scope is clearly defined before starting.
              Include a brief description of what&apos;s delivered so there&apos;s no confusion.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              3. Retainer Invoice Template
            </h2>
            <p className="text-gray-600 mb-4">
              Retainers are recurring monthly payments for ongoing work. Common for marketing
              agencies, PR firms, and consultants with long-term clients.
            </p>

            <div className="bg-white rounded-lg border border-gray-200 p-6 my-6">
              <h3 className="font-semibold text-gray-900 mb-3">Example: Monthly Retainer Invoice</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-2">Description</th>
                    <th className="text-center p-2">Period</th>
                    <th className="text-right p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">
                      <strong>Monthly Marketing Retainer</strong>
                      <br />
                      <span className="text-gray-500 text-xs">
                        Social media management, content creation, analytics reporting
                      </span>
                    </td>
                    <td className="text-center p-2">January 2026</td>
                    <td className="text-right p-2">$2,000</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2} className="text-right p-2 font-bold">Total:</td>
                    <td className="text-right p-2 font-bold text-primary-600">$2,000</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="bg-green-50 border border-green-100 rounded-lg p-4 my-6">
              <p className="text-green-800 text-sm">
                <strong>Retainer benefits:</strong> Predictable income for you, priority service for
                clients. Consider offering a small discount vs. hourly rates to incentivize
                retainers.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              4. Milestone Billing Invoice Template
            </h2>
            <p className="text-gray-600 mb-4">
              Milestone invoices break large projects into phases, with payment due at each
              milestone. This reduces risk for both you and the client on big projects.
            </p>

            <div className="bg-white rounded-lg border border-gray-200 p-6 my-6">
              <h3 className="font-semibold text-gray-900 mb-3">Example: Milestone Invoice (Phase 2 of 4)</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-2">Milestone</th>
                    <th className="text-center p-2">Status</th>
                    <th className="text-right p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b text-gray-400">
                    <td className="p-2">Phase 1: Discovery & Planning</td>
                    <td className="text-center p-2">Paid</td>
                    <td className="text-right p-2">$2,500</td>
                  </tr>
                  <tr className="border-b bg-yellow-50">
                    <td className="p-2 font-medium">Phase 2: Design Mockups (Due Now)</td>
                    <td className="text-center p-2">
                      <span className="bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded text-xs">
                        Current
                      </span>
                    </td>
                    <td className="text-right p-2 font-medium">$2,500</td>
                  </tr>
                  <tr className="border-b text-gray-400">
                    <td className="p-2">Phase 3: Development</td>
                    <td className="text-center p-2">Upcoming</td>
                    <td className="text-right p-2">$3,500</td>
                  </tr>
                  <tr className="border-b text-gray-400">
                    <td className="p-2">Phase 4: Launch & Training</td>
                    <td className="text-center p-2">Upcoming</td>
                    <td className="text-right p-2">$1,500</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2} className="text-right p-2 font-bold">
                      Amount Due (Phase 2):
                    </td>
                    <td className="text-right p-2 font-bold text-primary-600">$2,500</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              Payment Terms by Invoice Type
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm my-6">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-3">Invoice Type</th>
                    <th className="text-left p-3">Recommended Terms</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3">Hourly</td>
                    <td className="p-3">Net 15 or Net 30, invoice weekly or bi-weekly</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Fixed Project</td>
                    <td className="p-3">50% upfront, 50% on completion (or 100% on completion)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Retainer</td>
                    <td className="p-3">Due on 1st of each month, paid in advance</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Milestone</td>
                    <td className="p-3">Due on milestone completion, Net 7 or Net 15</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              Late Fee Clause Examples
            </h2>
            <p className="text-gray-600 mb-4">
              Add one of these to your invoice notes to encourage timely payment:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li>&ldquo;A 1.5% monthly interest charge will be applied to overdue invoices.&rdquo;</li>
              <li>&ldquo;Invoices unpaid after 30 days are subject to a $25 late fee.&rdquo;</li>
              <li>&ldquo;Payment terms: Net 30. Accounts over 60 days may be paused.&rdquo;</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              Create Your Invoice Now
            </h2>
            <p className="text-gray-600 mb-4">
              Our <Link href="/free-invoice-generator" className="text-primary-600 hover:underline">free invoice generator</Link> supports
              all these invoice types. Just fill in your details and download a professional PDF.
            </p>
            <p className="text-gray-600 mb-4">
              For more tips on getting paid, check out our guide on{' '}
              <Link href="/blog/best-practices-for-getting-paid-faster" className="text-primary-600 hover:underline">
                best practices for getting paid faster
              </Link>.
            </p>
          </div>

          {/* CTA Box */}
          <div className="bg-primary-50 rounded-xl p-8 mt-12 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Use These Templates Free</h3>
            <p className="text-gray-600 mb-6">
              Create professional invoices in any format with our free invoice maker.
            </p>
            <Link
              href="/invoice-template"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700"
            >
              Get Free Template
            </Link>
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} InvoiceGen. Free invoice templates.</p>
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
