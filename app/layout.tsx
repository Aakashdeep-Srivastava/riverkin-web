import type { Metadata, Viewport } from 'next';
import { Inter, Newsreader } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/lib/query-provider';
import { BottomNav } from '@/components/bottom-nav';
import { GuideProvider } from '@/components/guide/guide-context';
import { GuideBanner } from '@/components/guide/guide-banner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Elegant serif for hero display headings (brand showcase).
const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['500', '600', '700'],
  style: ['normal'],
});

export const metadata: Metadata = {
  title: 'RiverKin — find where the river needs you',
  description:
    'Find where the river needs you. Observe. Verify. Protect. RiverKin spots the sites that need a look, runs a 5-minute field check, and has peers verify it.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Paint under the notch/home-indicator; let the keyboard shrink the layout
  // viewport so bottom-pinned CTAs track it (mobile-native §7, baseline).
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
  // Match the top-of-page surface, per scheme (mobile-native §10).
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f5f0' },
    { media: '(prefers-color-scheme: dark)', color: '#0e1b38' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`}>
      <body className="font-sans antialiased">
        <QueryProvider>
          <GuideProvider>
            {/* Screens own their own bottom clearance (pb-24) so the full-screen
             * map home can use the whole viewport. */}
            <div className="min-h-dvh">{children}</div>
            <BottomNav />
            <GuideBanner />
          </GuideProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
