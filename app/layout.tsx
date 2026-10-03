import type { Metadata, Viewport } from 'next';
import { Inter, Newsreader } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/lib/query-provider';
import { BottomNav } from '@/components/bottom-nav';

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
  themeColor: '#0052ff',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`}>
      <body className="font-sans antialiased">
        <QueryProvider>
          {/* Screens own their own bottom clearance (pb-24) so the full-screen
           * map home can use the whole viewport. */}
          <div className="min-h-dvh">{children}</div>
          <BottomNav />
        </QueryProvider>
      </body>
    </html>
  );
}
