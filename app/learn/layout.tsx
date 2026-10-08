import type { Metadata } from 'next';

/**
 * Metadata wrapper for /learn. The index page itself is a client component (it
 * uses the app bar + interactive bits), so its SEO title/description live here
 * in a server layout. Article pages under /learn/[slug] set their own.
 */
export const metadata: Metadata = {
  title: 'Learn — How RiverKin Works & River Health Guides',
  description:
    'How RiverKin turns a five-minute riverside visit into research-grade data, plus plain-language guides on reading river health and citizen-science water monitoring.',
  alternates: { canonical: 'https://riverkin.online/learn' },
  openGraph: {
    title: 'Learn — RiverKin',
    description: 'How RiverKin works, and guides to reading river health for yourself.',
    url: 'https://riverkin.online/learn',
    images: ['/icon-512.png'],
  },
};

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return children;
}
