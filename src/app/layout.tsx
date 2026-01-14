import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InvoiceGen - Free Professional Invoice Generator',
  description:
    'Create beautiful, professional invoices in seconds. Free to use with premium features available. Perfect for freelancers and small businesses.',
  keywords: [
    'invoice generator',
    'free invoice',
    'invoice maker',
    'invoice template',
    'professional invoice',
    'freelance invoice',
    'small business invoice',
  ],
  openGraph: {
    title: 'InvoiceGen - Free Professional Invoice Generator',
    description: 'Create beautiful, professional invoices in seconds.',
    type: 'website',
  },
  verification: {
    google: 'XUC0kAyql3EE_w-JCYc1p3kikwYcfPCasNlsmD8jH4w',
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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
