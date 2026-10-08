import type { MetadataRoute } from 'next';
import { LEARN_ARTICLES } from '@/lib/learn-content';

/**
 * XML sitemap for the public, indexable surface only — marketing/entry,
 * education cluster and support. The private app (check/verify/receipt/account
 * /crew/researcher) is excluded here and disallowed in robots.ts.
 */
const BASE = 'https://riverkin.online';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/welcome`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/learn`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/support`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const articles: MetadataRoute.Sitemap = LEARN_ARTICLES.map((a) => ({
    url: `${BASE}/learn/${a.slug}`,
    lastModified: new Date(a.dateModified),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...articles];
}
