import { BrandMenu } from '@/components/brand-menu';
import { TourButton } from '@/components/guide/tour-button';
import { NotificationCenter } from '@/components/notifications/notification-center';
import { SiteSearch } from '@/components/site-search';
import { AccountAvatar } from '@/components/account-avatar';

/**
 * Top app bar for the citizen surface: wave mark + wordmark, search, and the
 * account avatar. Frosted so the map can sit behind it on C1.
 */
export function AppBar({ transparent = false, active = '/' }: { transparent?: boolean; active?: string }) {
  return (
    <header
      className={
        transparent
          ? 'flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-2'
          : 'sticky top-0 z-30 flex items-center justify-between border-b border-unseen bg-surface px-4 py-3'
      }
    >
      <BrandMenu transparent={transparent} active={active} />
      <div className="flex items-center gap-2">
        <TourButton transparent={transparent} />
        <NotificationCenter transparent={transparent} />
        <SiteSearch transparent={transparent} />
        <AccountAvatar />
      </div>
    </header>
  );
}
