import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/auth/callback',
          '/auth/forgot-password',
          '/success',
          '/invoices/*',  // Individual invoice pages are private
        ],
      },
    ],
    sitemap: 'https://invoice-generator-kappa-red.vercel.app/sitemap.xml',
  };
}
