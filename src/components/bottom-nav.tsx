'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, Target, Users, User, type LucideIcon } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  Icon: LucideIcon;
  /** Match this route and anything under it as "active". */
  match: (pathname: string) => boolean;
}

const ITEMS: NavItem[] = [
  { href: '/', label: 'Map', Icon: Map, match: (p) => p === '/' },
  { href: '/missions', label: 'Missions', Icon: Target, match: (p) => p.startsWith('/missions') },
  { href: '/crew', label: 'Crew', Icon: Users, match: (p) => p.startsWith('/crew') },
  { href: '/me', label: 'Me', Icon: User, match: (p) => p.startsWith('/me') },
];

/**
 * Mobile bottom navigation. Tap targets are >= 48px and the active state is
 * shown by icon + label weight, not colour alone.
 */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-unseen bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {ITEMS.map(({ href, label, Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className="flex min-h-[56px] flex-col items-center justify-center gap-0.5 px-2 py-2 text-ink-muted aria-[current=page]:text-ink"
              >
                <Icon
                  className="h-6 w-6"
                  aria-hidden="true"
                  strokeWidth={active ? 2.5 : 1.75}
                />
                <span className={`text-[11px] ${active ? 'font-semibold text-ink' : 'font-medium'}`}>
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
