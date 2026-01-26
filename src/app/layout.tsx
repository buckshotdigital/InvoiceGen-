import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { OrganizationSchema } from '@/components/schema/OrganizationSchema';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ToastManager } from '@/components/ToastManager';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const siteUrl = 'https://invoice-generator-kappa-red.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'InvoiceGen - Free Professional Invoice Generator with Payment Tracking',
    template: '%s | InvoiceGen',
  },
  description:
    'Create professional invoices in seconds, track payments, and send automated email reminders. Free cloud storage, payment dashboard, and PDF export. Premium features at $4.99/month.',
  keywords: [
    // Core keywords
    'invoice generator',
    'free invoice generator',
    'invoice maker',
    'invoice template',
    'professional invoice',
    'online invoice',
    'invoice PDF',
    'create invoice online',
    'invoice software',
    'billing software',
    'free billing',
    'payment tracking',
    'invoice reminders',
    'email invoice',
    'cloud invoice software',
    // Freelancer & Professional keywords
    'freelance invoice',
    'freelancer invoice template',
    'self employed invoice',
    'contractor invoice',
    'consultant invoice',
    'independent contractor billing',
    // Construction & Trades
    'construction invoice',
    'construction invoice template',
    'contractor billing software',
    'builder invoice',
    'plumber invoice',
    'electrician invoice',
    'handyman invoice template',
    'subcontractor invoice',
    'home improvement invoice',
    // Digital Creators & Creative
    'digital creator invoice',
    'content creator invoice',
    'influencer invoice template',
    'YouTuber invoice',
    'social media invoice',
    'graphic designer invoice',
    'web designer invoice',
    'photographer invoice',
    'videographer invoice',
    'artist invoice template',
    // Tech & Development
    'developer invoice',
    'software developer invoice',
    'web developer billing',
    'IT consultant invoice',
    'tech freelancer invoice',
    // Other Industries
    'cleaning service invoice',
    'landscaping invoice',
    'tutoring invoice',
    'personal trainer invoice',
    'catering invoice',
    'event planner invoice',
    'real estate invoice',
    'marketing consultant invoice',
    'virtual assistant invoice',
    'coaching invoice template',
    // Small Business
    'small business invoice',
    'startup invoice',
    'sole proprietor invoice',
    'LLC invoice template',
  ],
  authors: [{ name: 'InvoiceGen' }],
  creator: 'InvoiceGen',
  publisher: 'InvoiceGen',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'InvoiceGen - Free Invoice Generator with Payment Tracking & Email Reminders',
    description: 'Create professional invoices, track payments, send email reminders. Free cloud storage with Google Sign-In. Premium features for custom branding at $4.99/month.',
    type: 'website',
    url: siteUrl,
    siteName: 'InvoiceGen',
    locale: 'en_US',
    images: [
      {
        url: `${siteUrl}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: 'InvoiceGen - Professional Invoice Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InvoiceGen - Free Professional Invoice Generator',
    description: 'Create invoices, track payments, send reminders. Free cloud storage with premium features.',
    images: [`${siteUrl}/og-image.svg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: 'XUC0kAyql3EE_w-JCYc1p3kikwYcfPCasNlsmD8jH4w',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <OrganizationSchema />
        {/* llms.txt for AI crawlers */}
        <link rel="author" href="/llms.txt" />
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-R7V1TRP8ZY"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-R7V1TRP8ZY');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
          <ToastManager />
        </ToastProvider>
      </body>
    </html>
  );
}
