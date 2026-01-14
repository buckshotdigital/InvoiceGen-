import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import { guides, getGuideBySlug } from '@/data/guides';
import { ArticleSchema } from '@/components/schema/ArticleSchema';
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema';

interface PageProps {
  params: Promise<{ industry: string }>;
}

export async function generateStaticParams() {
  return guides.map((guide) => ({
    industry: guide.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { industry } = await params;
  const guide = getGuideBySlug(industry);

  if (!guide) {
    return { title: 'Not Found' };
  }

  return {
    title: `${guide.title} | InvoiceGen`,
    description: guide.description,
    keywords: guide.keywords,
    alternates: {
      canonical: `https://invoice-gen-two-rho.vercel.app/guides/${industry}`,
    },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { industry } = await params;
  const guide = getGuideBySlug(industry);

  if (!guide) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Guide Not Found</h1>
          <p className="text-gray-600 mb-8">
            The guide you're looking for doesn't exist.
          </p>
          <Link href="/guides" className="text-primary-600 hover:text-primary-700">
            Back to Guides
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ArticleSchema
        title={guide.title}
        description={guide.description}
        publishedDate={guide.publishedDate}
        modifiedDate={guide.publishedDate}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://invoice-gen-two-rho.vercel.app' },
          { name: 'Guides', url: 'https://invoice-gen-two-rho.vercel.app/guides' },
          { name: guide.title, url: `https://invoice-gen-two-rho.vercel.app/guides/${guide.slug}` },
        ]}
      />
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-16">
        <article>
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/guides" className="hover:text-primary-600">
              Guides
            </Link>
            <span className="mx-2">/</span>
            <span>{guide.title}</span>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
              {guide.industry}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              {guide.title}
            </h1>
            <p className="text-xl text-gray-600">
              {guide.description}
            </p>
            <div className="flex items-center text-sm text-gray-500 mt-6">
              <span>Published: {new Date(guide.publishedDate).toLocaleDateString()}</span>
              <span className="mx-2">·</span>
              <span>Updated: {new Date(guide.publishedDate).toLocaleDateString()}</span>
            </div>
          </header>

          {/* Table of Contents */}
          <div className="bg-gray-100 rounded-lg p-6 mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Table of Contents</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#key-invoicing-requirements" className="text-primary-600 hover:text-primary-700">
                  1. Key Invoicing Requirements
                </Link>
              </li>
              <li>
                <Link href="#best-practices" className="text-primary-600 hover:text-primary-700">
                  2. Best Practices for Your Industry
                </Link>
              </li>
              <li>
                <Link href="#common-mistakes" className="text-primary-600 hover:text-primary-700">
                  3. Common Mistakes to Avoid
                </Link>
              </li>
              <li>
                <Link href="#sample-template" className="text-primary-600 hover:text-primary-700">
                  4. Sample Invoice Template
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-primary-600 hover:text-primary-700">
                  5. FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <h2 id="key-invoicing-requirements" className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              Key Invoicing Requirements
            </h2>
            <p className="text-gray-600 mb-4">
              All invoices should include essential information regardless of your industry. However, certain fields are particularly important for {guide.industry.toLowerCase()}:
            </p>
            <div className="bg-white rounded-lg border border-gray-200 p-6 my-6">
              <h3 className="font-semibold text-gray-900 mb-3">Required Information</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Your business information and tax ID</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Client name and contact details</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Unique invoice number</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Invoice date and due date</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Detailed description of services/products</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Amount due and payment terms</span>
                </li>
              </ul>
            </div>

            <h2 id="best-practices" className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              Best Practices for {guide.industry}
            </h2>
            <p className="text-gray-600 mb-4">
              The following practices are especially important for professionals in {guide.industry.toLowerCase()}:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
              <li>Create consistent, professional invoices with your branding</li>
              <li>Use clear, industry-specific terminology</li>
              <li>Include relevant reference numbers or project codes</li>
              <li>Specify payment terms clearly to avoid misunderstandings</li>
              <li>Send invoices promptly after work completion</li>
              <li>Keep organized records for tax purposes</li>
            </ul>

            <h2 id="common-mistakes" className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              Common Mistakes to Avoid
            </h2>
            <p className="text-gray-600 mb-4">
              Here are common invoicing mistakes that {guide.industry.toLowerCase()} professionals should avoid:
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span className="text-gray-700">
                    <strong>Vague descriptions:</strong> Always provide specific details about work performed
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span className="text-gray-700">
                    <strong>Missing payment terms:</strong> Clearly state when payment is due
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span className="text-gray-700">
                    <strong>Incorrect tax calculations:</strong> Verify all taxes and fees
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span className="text-gray-700">
                    <strong>Missing invoice numbers:</strong> Use sequential numbering for tracking
                  </span>
                </li>
              </ul>
            </div>

            <h2 id="sample-template" className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              Sample Invoice Template
            </h2>
            <p className="text-gray-600 mb-4">
              Use InvoiceGen to create professional invoices for {guide.industry.toLowerCase()}. Our templates include all required fields and can be customized for your specific needs.
            </p>
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-8 my-6 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Create Your First Invoice
              </h3>
              <p className="text-gray-600 mb-6">
                Get started with a professional invoice template tailored for {guide.industry.toLowerCase()}
              </p>
              <Link
                href="/create"
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                Create Invoice
              </Link>
            </div>

            <h2 id="faq" className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              Frequently Asked Questions
            </h2>
            <dl className="space-y-6">
              <div>
                <dt className="font-semibold text-gray-900 mb-2">
                  How often should I send invoices?
                </dt>
                <dd className="text-gray-600">
                  Send invoices promptly after completing work or on the agreed schedule. For ongoing projects, send invoices at regular intervals (weekly, bi-weekly, or monthly) as specified in your contract.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-900 mb-2">
                  What payment terms should I use?
                </dt>
                <dd className="text-gray-600">
                  Common payment terms include NET 30 (payment due within 30 days), NET 60 (60 days), or Due on Receipt (immediate payment). Choose based on your industry standards and client agreements.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-900 mb-2">
                  How do I handle late payments?
                </dt>
                <dd className="text-gray-600">
                  Include late payment terms in your invoices (e.g., 1.5% monthly interest on overdue amounts). Follow up politely after the due date and consider offering early payment discounts.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-900 mb-2">
                  Should I include my tax ID?
                </dt>
                <dd className="text-gray-600">
                  Yes, include your business tax ID (EIN, VAT number, or similar) on all invoices. This is required for accounting and may be needed for client tax deductions.
                </dd>
              </div>
            </dl>
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg border border-primary-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Create Professional Invoices?
            </h3>
            <p className="text-gray-700 mb-6">
              Use InvoiceGen to create, manage, and track invoices for your {guide.industry.toLowerCase()} business. Start for free today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/create"
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg text-center transition"
              >
                Create Your First Invoice
              </Link>
              <Link
                href="/pricing"
                className="inline-block bg-white hover:bg-gray-50 text-primary-600 font-bold py-3 px-6 rounded-lg border border-primary-200 text-center transition"
              >
                View Premium Features
              </Link>
            </div>
          </div>

          {/* Related Articles */}
          <div className="mt-12 pt-12 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link
                href="/blog/how-to-create-a-professional-invoice"
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition"
              >
                <h4 className="font-semibold text-gray-900 mb-2">
                  How to Create a Professional Invoice
                </h4>
                <p className="text-sm text-gray-600">
                  Learn the essentials of creating invoices that get paid on time
                </p>
              </Link>
              <Link
                href="/blog/best-practices-for-getting-paid-faster"
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition"
              >
                <h4 className="font-semibold text-gray-900 mb-2">
                  Best Practices for Getting Paid Faster
                </h4>
                <p className="text-sm text-gray-600">
                  Practical strategies to reduce payment delays and improve cash flow
                </p>
              </Link>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
