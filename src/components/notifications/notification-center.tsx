'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Bell,
  X,
  BadgeCheck,
  CloudRain,
  EyeOff,
  TrendingUp,
  Compass,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import {
  fetchNotifications,
  isUnread,
  markRead,
  type AppNotification,
} from '@/lib/notifications-api';

const ICONS: Record<string, LucideIcon> = {
  'badge-check': BadgeCheck,
  'cloud-rain': CloudRain,
  'eye-off': EyeOff,
  'trending-up': TrendingUp,
  compass: Compass,
  default: Sparkles,
};

/**
 * In-app notification center — a bell with an unread dot, a bottom sheet of warm
 * nudges, and a one-time celebratory toast for the freshest unread item. Built
 * to bring people (and kids) back without nagging: every item is a real event.
 */
export function NotificationCenter({ transparent = false }: { transparent?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [toast, setToast] = useState<AppNotification | null>(null);

  useEffect(() => {
    let active = true;
    void fetchNotifications().then((n) => {
      if (!active) return;
      setItems(n);
      const freshUnread = n.filter((x) => isUnread(x.id));
      setUnread(freshUnread.length);
      // Celebrate a verified win or welcome once per load (not on every tick).
      const hero = freshUnread.find((x) => x.kind === 'verified') ?? freshUnread[0];
      if (hero) {
        setToast(hero);
        window.setTimeout(() => setActiveToast(setToast, null), 6500);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  function openPanel() {
    setOpen(true);
    markRead(items.map((i) => i.id));
    setUnread(0);
    setToast(null);
  }

  function go(n: AppNotification) {
    markRead([n.id]);
    void import('@/lib/analytics').then((m) => m.track('notification_opened', { kind: n.kind }));
    setOpen(false);
    setToast(null);
    router.push(n.href);
  }

  function Icon({ name }: { name: string }) {
    const C = ICONS[name] ?? ICONS.default;
    return <C className="h-5 w-5" aria-hidden="true" />;
  }

  return (
    <>
      <button
        type="button"
        onClick={openPanel}
        aria-label={unread > 0 ? `Notifications, ${unread} new` : 'Notifications'}
        className={`relative flex h-10 w-10 items-center justify-center rounded-full border border-unseen text-ink-muted hover:text-ink ${
          transparent ? 'rk-glass' : 'bg-surface'
        }`}
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unread > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[var(--cta)] px-1 text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        ) : null}
      </button>

      {/* Celebratory toast — only on the home route so it never covers page content. */}
      {toast && !open && pathname === '/' ? (
        <button
          type="button"
          onClick={() => go(toast)}
          className="rk-reveal fixed inset-x-3 top-[calc(env(safe-area-inset-top)+4.25rem)] z-40 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-unseen bg-surface p-3 text-left shadow-[var(--rk-shadow-lift)]"
        >
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
            style={{ background: toast.accent }}
          >
            <Icon name={toast.icon} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-ink">{toast.title}</span>
            <span className="block truncate text-xs text-ink-muted">{toast.body}</span>
          </span>
        </button>
      ) : null}

      {/* Bottom-sheet panel */}
      {open ? (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="rk-reveal absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-3xl border-t border-unseen bg-surface pb-[calc(env(safe-area-inset-bottom)+1rem)]">
            <div className="sticky top-0 flex items-center justify-between border-b border-unseen bg-surface px-5 py-4">
              <h2 className="font-display text-lg font-semibold text-ink">Notifications</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close notifications"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-unseen text-ink"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {items.length > 0 ? (
              <ul className="divide-y divide-unseen px-2">
                {items.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => go(n)}
                      className="flex w-full items-center gap-3 px-3 py-4 text-left transition-colors hover:bg-[var(--bg)]"
                    >
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                        style={{
                          background: `color-mix(in srgb, ${n.accent} 16%, transparent)`,
                          color: n.accent,
                        }}
                      >
                        <Icon name={n.icon} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-ink">{n.title}</span>
                        <span className="block text-sm leading-snug text-ink-muted">{n.body}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-10 text-center text-sm text-ink-muted">
                You’re all caught up. 🌱
              </p>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

/** Guard against setting state after unmount in the toast timeout. */
function setActiveToast(
  setter: (n: AppNotification | null) => void,
  value: AppNotification | null,
) {
  try {
    setter(value);
  } catch {
    /* unmounted */
  }
}
