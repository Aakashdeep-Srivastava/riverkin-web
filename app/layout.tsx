import type { Metadata, Viewport } from 'next';
import { Inter, Newsreader } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import './globals.css';
import { QueryProvider } from '@/lib/query-provider';
import { BottomNav } from '@/components/bottom-nav';
import { GuideProvider } from '@/components/guide/guide-context';
import { GuideBanner } from '@/components/guide/guide-banner';
import { ServiceWorkerRegister, InstallBanner } from '@/components/pwa';
import {
  JsonLd,
  organizationJsonLd,
  websiteJsonLd,
  webApplicationJsonLd,
} from '@/components/structured-data';

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
  metadataBase: new URL('https://riverkin.online'),
  applicationName: 'RiverKin',
  title: 'RiverKin — find where the river needs you',
  description:
    'Find where the river needs you. Observe. Verify. Protect. RiverKin spots the sites that need a look, runs a 5-minute field check, and has peers verify it.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  appleWebApp: {
    capable: true,
    title: 'RiverKin',
    statusBarStyle: 'default',
  },
  openGraph: {
    title: 'RiverKin — find where the river needs you',
    description: 'Citizen science that keeps Europe’s urban rivers healthy.',
    images: ['/icon-512.png'],
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Locale + messages from the NEXT_LOCALE cookie (src/i18n/request.ts).
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale} className={`${inter.variable} ${newsreader.variable}`}>
      <body className="font-sans antialiased">
        <JsonLd data={[organizationJsonLd, websiteJsonLd, webApplicationJsonLd]} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <QueryProvider>
            <GuideProvider>
              {/* Screens own their own bottom clearance (pb-24) so the full-screen
               * map home can use the whole viewport. */}
              <div className="min-h-dvh">{children}</div>
              <BottomNav />
              <GuideBanner />
              <ServiceWorkerRegister />
              <InstallBanner />
            </GuideProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
