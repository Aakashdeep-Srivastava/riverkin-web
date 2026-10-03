'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, Target, Sprout, Users, Plus, type LucideIcon } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  Icon: LucideIcon;
  match: (pathname: string) => boolean;
}

/** Four tabs flanking a center "+" action (start a check). */
const LEFT: NavItem[] = [
  { href: '/', label: 'Explore', Icon: Map, match: (p) => p === '/' },
  { href: '/missions', label: 'Missions', Icon: Target, match: (p) => p.startsWith('/missions') },
];
const RIGHT: NavItem[] = [
  { href: '/crew', label: 'Community', Icon: Users, match: (p) => p.startsWith('/crew') },
  { href: '/impact', label: 'Impact', Icon: Sprout, match: (p) => p.startsWith('/impact') || p.startsWith('/receipt') },
];

function Tab({ item, active }: { item: NavItem; active: boolean }) {
  const { href, label, Icon } = item;
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className="flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 text-ink-muted transition-colors aria-[current=page]:text-[var(--cta)]"
    >
      <Icon className="h-6 w-6" aria-hidden="true" strokeWidth={active ? 2.5 : 1.75} />
      <span className={`text-[11px] ${active ? 'font-semibold text-[var(--cta)]' : 'font-medium'}`}>
        {label}
      </span>
    </Link>
  );
}

/**
 * Mobile bottom navigation: Home · Missions · (+) · Impact · Crew. The center
 * FAB starts a field check. Hidden on desktop (left rail used there later).
 */
export function BottomNav() {
  const pathname = usePathname();

  // Show the nav only on the tab roots (Home / Missions list / Impact / Crew /
  // Me). Pushed detail + flow screens have their own back button and CTA.
  const hideNav =
    pathname === '/welcome' ||
    pathname.startsWith('/check') ||
    pathname.startsWith('/verify') ||
    pathname.startsWith('/sites/') ||
    pathname.startsWith('/receipt/') ||
    /^\/missions\/.+/.test(pathname);
  if (hideNav) {
    return null;
  }

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-unseen bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch">
        {LEFT.map((item) => (
          <li key={item.href} className="flex-1">
            <Tab item={item} active={item.match(pathname)} />
          </li>
        ))}
        <li className="flex items-center justify-center px-1">
          <Link
            href="/missions"
            aria-label="Start a check"
            className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--action)] text-white shadow-[var(--rk-shadow-lift)] ring-4 ring-surface transition-transform active:scale-95"
          >
            <Plus className="h-7 w-7" aria-hidden="true" />
          </Link>
        </li>
        {RIGHT.map((item) => (
          <li key={item.href} className="flex-1">
            <Tab item={item} active={item.match(pathname)} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
