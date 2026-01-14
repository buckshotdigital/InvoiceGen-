import type { MetadataRoute } from 'next';

const baseUrl = 'https://invoice-gen-two-rho.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/free-invoice-generator',
    '/invoice-maker',
    '/invoice-template',
    '/create',
    '/pricing',
    '/invoices',
    '/blog',
    '/blog/how-to-create-a-professional-invoice',
    '/blog/invoice-templates-for-freelancers',
    '/blog/best-practices-for-getting-paid-faster',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route.startsWith('/blog') ? 0.7 : 0.8,
  }));
}
