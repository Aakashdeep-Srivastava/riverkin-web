'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronDown,
  Map as MapIcon,
  Target,
  GraduationCap,
  Users,
  Footprints,
  Star,
  BarChart3,
  Settings,
  LogOut,
  type LucideIcon,
} from 'lucide-react';
import { RiverMark } from '@/components/ui/logo';
import { signOut } from '@/lib/auth-api';

interface Item {
  href: string;
  label: string;
  Icon: LucideIcon;
}

const NAV: Item[] = [
  { href: '/', label: 'Map', Icon: MapIcon },
  { href: '/missions', label: 'Missions', Icon: Target },
  { href: '/learn', label: 'Learn', Icon: GraduationCap },
  { href: '/community', label: 'Community', Icon: Users },
  { href: '/challenges', label: 'Challenges', Icon: Footprints },
  { href: '/rewards', label: 'Rewards', Icon: Star },
  { href: '/impact', label: 'Impact', Icon: BarChart3 },
];

/**
 * Brand dropdown — the RiverKin wordmark doubles as the primary navigation menu
 * (Map · Missions · Learn · Community · Rewards · Impact) plus account actions.
 * Closes on outside-click, Escape, or route choice.
 */
export function BrandMenu({ transparent = false, active = '/' }: { transparent?: boolean; active?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function handleSignOut() {
    setOpen(false);
    signOut();
    router.replace('/welcome');
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={
          transparent
            ? 'rk-glass flex items-center gap-2 rounded-full px-3 py-1.5'
            : 'flex items-center gap-2 rounded-full px-1 py-1'
        }
      >
        <span className="inline-flex items-center justify-center rounded-lg bg-white p-1 shadow-sm">
          <RiverMark className="h-6 w-6" />
        </span>
        <span className="text-lg font-bold tracking-tight text-ink">RiverKin</span>
        <ChevronDown
          className={`h-4 w-4 text-ink-muted transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-64 overflow-hidden rounded-2xl border border-unseen bg-surface shadow-[var(--rk-shadow-lift)]"
        >
          <div className="flex items-center gap-3 border-b border-unseen px-4 py-3">
            <RiverMark className="h-9 w-9" />
            <div>
              <p className="text-[15px] font-bold leading-tight text-ink">RiverKin</p>
              <p className="text-[12px] text-ink-muted">People. Rivers. Change.</p>
            </div>
          </div>

          <nav className="py-1.5">
            {NAV.map(({ href, label, Icon }) => {
              const isActive = href === active;
              return (
                <Link
                  key={href}
                  href={href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 text-[15px] font-medium ${
                    isActive ? 'bg-[var(--action)]/10 text-[var(--action)]' : 'text-ink hover:bg-bg'
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {label}
                  {isActive ? <span className="ml-auto text-[var(--action)]">✓</span> : null}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-unseen py-1.5">
            <Link
              href="/me"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-[15px] font-medium text-ink hover:bg-bg"
            >
              <Settings className="h-5 w-5" aria-hidden="true" />
              Settings
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[15px] font-medium text-ink hover:bg-bg"
            >
              <LogOut className="h-5 w-5" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
