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
    'invoice generator',
    'free invoice generator',
    'invoice maker',
    'invoice template',
    'professional invoice',
    'freelance invoice',
    'small business invoice',
    'payment tracking',
    'invoice reminders',
    'email invoice',
    'cloud invoice software',
    'online invoice',
    'invoice PDF',
    'create invoice online',
    'invoice software',
    'billing software',
    'free billing',
    'contractor invoice',
    'consultant invoice',
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
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-CJFMC8G66Q"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-CJFMC8G66Q');
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
