import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing - Free & Premium Plans | InvoiceGen',
  description:
    'Simple, transparent pricing. Free plan with essential features, Premium at $4.99/month for unlimited reminders, custom branding, and logo uploads. No hidden fees.',
  keywords: [
    'invoice generator pricing',
    'free invoice software',
    'premium invoice features',
    'invoice app cost',
  ],
  alternates: {
    canonical: 'https://invoice-generator-kappa-red.vercel.app/pricing',
  },
  openGraph: {
    title: 'InvoiceGen Pricing - Free & Premium Plans',
    description:
      'Free invoice generator with optional premium features. Custom branding, unlimited reminders, and logo uploads for just $4.99/month.',
    type: 'website',
    url: 'https://invoice-generator-kappa-red.vercel.app/pricing',
    images: [
      {
        url: 'https://invoice-generator-kappa-red.vercel.app/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'InvoiceGen Pricing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InvoiceGen Pricing - Free & Premium Plans',
    description: 'Free plan forever. Premium features at $4.99/month.',
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
