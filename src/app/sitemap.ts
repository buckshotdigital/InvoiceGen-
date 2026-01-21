import type { MetadataRoute } from 'next';

const baseUrl = 'https://invoice-generator-kappa-red.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Main pages with high priority
  const mainPages = [
    { route: '', priority: 1.0, changeFreq: 'weekly' as const },
    { route: '/create', priority: 0.95, changeFreq: 'weekly' as const },
    { route: '/pricing', priority: 0.9, changeFreq: 'monthly' as const },
    { route: '/dashboard', priority: 0.85, changeFreq: 'weekly' as const },
    { route: '/invoices', priority: 0.85, changeFreq: 'daily' as const },
  ];

  // SEO landing pages
  const seoPages = [
    { route: '/free-invoice-generator', priority: 0.9, changeFreq: 'monthly' as const },
    { route: '/invoice-maker', priority: 0.9, changeFreq: 'monthly' as const },
    { route: '/invoice-template', priority: 0.9, changeFreq: 'monthly' as const },
  ];

  // Auth pages (lower priority, but still indexed)
  const authPages = [
    { route: '/auth/login', priority: 0.5, changeFreq: 'monthly' as const },
    { route: '/auth/signup', priority: 0.6, changeFreq: 'monthly' as const },
  ];

  // Blog pages
  const blogPages = [
    { route: '/blog', priority: 0.8, changeFreq: 'weekly' as const },
    { route: '/blog/how-to-create-a-professional-invoice', priority: 0.75, changeFreq: 'monthly' as const },
    { route: '/blog/invoice-templates-for-freelancers', priority: 0.75, changeFreq: 'monthly' as const },
    { route: '/blog/best-practices-for-getting-paid-faster', priority: 0.75, changeFreq: 'monthly' as const },
  ];

  // Industry guide pages
  const guidePages = [
    { route: '/guides/freelance-developer', priority: 0.8, changeFreq: 'monthly' as const },
    { route: '/guides/contractor', priority: 0.8, changeFreq: 'monthly' as const },
    { route: '/guides/consultant', priority: 0.8, changeFreq: 'monthly' as const },
    { route: '/guides/graphic-designer', priority: 0.8, changeFreq: 'monthly' as const },
    { route: '/guides/photographer', priority: 0.8, changeFreq: 'monthly' as const },
  ];

  // User settings (low priority)
  const userPages = [
    { route: '/settings', priority: 0.4, changeFreq: 'monthly' as const },
  ];

  const allPages = [...mainPages, ...seoPages, ...authPages, ...blogPages, ...guidePages, ...userPages];

  return allPages.map(({ route, priority, changeFreq }) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: changeFreq,
    priority,
  }));
}
