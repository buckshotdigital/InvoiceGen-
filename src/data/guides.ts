export interface GuideSection {
  title: string;
  content: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Guide {
  slug: string;
  title: string;
  industry: string;
  description: string;
  keywords: string[];
  publishedDate: string;
  excerpt: string;
}

export const guides: Guide[] = [
  {
    slug: 'freelance-developer',
    title: 'Complete Invoice Guide for Freelance Developers',
    industry: 'Software Development',
    description:
      'A comprehensive guide to invoicing as a freelance developer, including project-based billing, hourly rates, retainer models, and best practices for tech industry invoicing.',
    excerpt:
      'Learn how to create professional invoices as a freelance developer with best practices for hourly, project-based, and retainer billing models.',
    keywords: [
      'freelance developer invoice template',
      'how to invoice as a developer',
      'freelance web developer invoice',
      'developer invoice format',
      'tech freelancer billing',
    ],
    publishedDate: '2026-01-14',
  },
  {
    slug: 'contractor',
    title: 'Contractor Invoice Guide: Best Practices & Requirements',
    industry: 'Construction & Services',
    description:
      'Essential invoicing guide for contractors covering progress billing, retention amounts, lien waivers, and state-specific requirements for construction invoices.',
    excerpt:
      'Master contractor invoicing with guides on progress billing, retention, lien waivers, and state-specific legal requirements.',
    keywords: [
      'contractor invoice requirements',
      'construction invoice template',
      'contractor billing best practices',
      'lien waiver invoice',
      'progress billing invoice',
    ],
    publishedDate: '2026-01-14',
  },
  {
    slug: 'consultant',
    title: 'Consulting Invoice Guide: Retainers, Fees & Best Practices',
    industry: 'Consulting & Advisory',
    description:
      'Complete guide to invoicing consulting services including retainer billing, value-based pricing, statement of work integration, and professional invoice standards.',
    excerpt:
      'Professional invoicing guide for consultants covering retainer models, value-based pricing, SOW references, and client management best practices.',
    keywords: [
      'consulting invoice template',
      'how to invoice consulting services',
      'consultant retainer invoice',
      'consulting fee invoice',
      'professional services invoice',
    ],
    publishedDate: '2026-01-14',
  },
  {
    slug: 'creative',
    title: 'Creative Professional Invoice Guide: Designers, Photographers & More',
    industry: 'Creative Services',
    description:
      'Invoicing guide for creative professionals including usage rights, revision tracking, kill fees, copyright language, and industry-specific best practices.',
    excerpt:
      'Invoice guide for designers, photographers, and creative professionals with templates, usage rights, copyright language, and revision tracking.',
    keywords: [
      'designer invoice template',
      'photographer invoice guide',
      'freelance designer invoice',
      'creative professional invoice',
      'usage rights invoice',
    ],
    publishedDate: '2026-01-14',
  },
  {
    slug: 'agency',
    title: 'Agency Invoice Guide: Blended Rates, Pass-Through Costs & Billing',
    industry: 'Marketing & Agencies',
    description:
      'Comprehensive invoicing guide for digital agencies and creative agencies covering blended rates, media buying, pass-through costs, and WIP tracking.',
    excerpt:
      'Invoicing best practices for agencies including blended rates, media buying, pass-through costs, client reporting, and WIP tracking.',
    keywords: [
      'marketing agency invoice',
      'agency billing best practices',
      'media agency invoice template',
      'blended rate invoice',
      'agency retainer invoice',
    ],
    publishedDate: '2026-01-14',
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

export function getAllGuides(): Guide[] {
  return guides;
}
