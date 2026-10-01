import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/lib/query-provider';
import { BottomNav } from '@/components/bottom-nav';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RiverKin',
  description:
    'Mission control for river keepers — spot sites that need a look, run a quick field check, and verify what others found.',
};

export const viewport: Viewport = {
  themeColor: '#12a4d9',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <QueryProvider>
          {/* Extra bottom padding on mobile so content clears the fixed nav. */}
          <div className="min-h-dvh pb-20 md:pb-0">{children}</div>
          <BottomNav />
        </QueryProvider>
      </body>
    </html>
  );
}
