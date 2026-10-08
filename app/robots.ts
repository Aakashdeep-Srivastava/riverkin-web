import type { MetadataRoute } from 'next';

/**
 * robots.txt — let search engines index the public/marketing + education
 * surface, but keep the private citizen app (field check, verify, receipts,
 * account, crew/join invite links, researcher console, auth callbacks) out of
 * the index. Those are per-user, data-driven or sensitive and carry no SEO
 * value. Points crawlers at the sitemap.
 */
const BASE = 'https://riverkin.online';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/check',
          '/verify',
          '/me',
          '/receipt/',
          '/status/',
          '/crew',
          '/join/',
          '/researcher',
          '/auth/',
          '/login',
          '/register',
          '/timeline/',
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
