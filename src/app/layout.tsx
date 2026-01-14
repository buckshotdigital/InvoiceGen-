import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
