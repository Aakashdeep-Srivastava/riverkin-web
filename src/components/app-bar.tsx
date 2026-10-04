import Link from 'next/link';
import { Search } from 'lucide-react';
import { RiverKinLogo } from '@/components/ui/logo';
import { TourButton } from '@/components/guide/tour-button';
import { NotificationCenter } from '@/components/notifications/notification-center';

/**
 * Top app bar for the citizen surface: wave mark + wordmark, search, and the
 * account avatar. Frosted so the map can sit behind it on C1.
 */
export function AppBar({ transparent = false }: { transparent?: boolean }) {
  return (
    <header
      className={
        transparent
          ? 'flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-2'
          : 'sticky top-0 z-20 flex items-center justify-between border-b border-unseen bg-surface px-4 py-3'
      }
    >
      <Link href="/" aria-label="RiverKin home" className={transparent ? 'rk-glass rounded-full px-3 py-1.5' : ''}>
        <RiverKinLogo />
      </Link>
      <div className="flex items-center gap-2">
        <TourButton transparent={transparent} />
        <NotificationCenter transparent={transparent} />
        <button
          type="button"
          aria-label="Search sites"
          className={`flex h-10 w-10 items-center justify-center rounded-full border border-unseen text-ink-muted hover:text-ink ${
            transparent ? 'rk-glass' : 'bg-surface'
          }`}
        >
          <Search className="h-5 w-5" aria-hidden="true" />
        </button>
        <Link
          href="/me"
          aria-label="Your account"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--action)] text-sm font-bold text-white"
        >
          K
        </Link>
      </div>
    </header>
  );
}
