import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Invoice Tips & Guides - InvoiceGen Blog',
  description:
    'Learn how to create professional invoices, get paid faster, and manage your freelance business. Free guides and templates for freelancers and small businesses.',
  alternates: {
    canonical: 'https://invoice-generator-kappa-red.vercel.app/blog',
  },
  openGraph: {
    title: 'Invoice Tips & Guides - InvoiceGen Blog',
    description: 'Free guides and templates for freelancers and small businesses. Learn invoicing best practices.',
    type: 'website',
    url: 'https://invoice-generator-kappa-red.vercel.app/blog',
    images: [
      {
        url: 'https://invoice-generator-kappa-red.vercel.app/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'InvoiceGen Blog',
      },
    ],
  },
};

const posts = [
  {
    slug: 'how-to-create-a-professional-invoice',
    title: 'How to Create a Professional Invoice (Complete Guide)',
    excerpt:
      'Learn what to include on your invoices, common mistakes to avoid, and how to create invoices that get paid on time.',
    date: 'January 13, 2026',
    readTime: '8 min read',
  },
  {
    slug: 'invoice-templates-for-freelancers',
    title: 'Invoice Templates for Freelancers: Hourly, Project & Retainer',
    excerpt:
      'Choose the right invoice format for your work. Includes examples for hourly billing, fixed projects, retainers, and milestone payments.',
    date: 'January 12, 2026',
    readTime: '6 min read',
  },
  {
    slug: 'best-practices-for-getting-paid-faster',
    title: 'Best Practices for Getting Paid Faster',
    excerpt:
      'Practical tips to reduce payment delays. Learn about payment terms, follow-up strategies, and invoice best practices.',
    date: 'January 11, 2026',
    readTime: '5 min read',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Invoice Tips & Guides</h1>
          <p className="text-xl text-gray-600">
            Free resources to help you invoice professionally and get paid faster.
          </p>
        </div>

        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary-600">
                  {post.title}
                </h2>
              </Link>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex items-center text-sm text-gray-500">
                <span>{post.date}</span>
                <span className="mx-2">·</span>
                <span>{post.readTime}</span>
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center mt-4 text-primary-600 font-medium hover:text-primary-700"
              >
                Read more
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </article>
          ))}
        </div>

        {/* CTA Section */}
        <section className="mt-16 text-center bg-primary-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Create Your Invoice?</h2>
          <p className="text-gray-600 mb-6">
            Put these tips into practice with our free invoice generator.
          </p>
          <Link
            href="/free-invoice-generator"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700"
          >
            Try Free Invoice Generator
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} InvoiceGen. Free invoicing for freelancers.</p>
          <div className="mt-4 space-x-4">
            <Link href="/free-invoice-generator" className="hover:text-white">
              Free Invoice Generator
            </Link>
            <Link href="/invoice-maker" className="hover:text-white">
              Invoice Maker
            </Link>
            <Link href="/invoice-template" className="hover:text-white">
              Templates
            </Link>
            <Link href="/pricing" className="hover:text-white">
              Pricing
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
