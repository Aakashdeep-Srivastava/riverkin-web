'use client';

import Link from 'next/link';
import { Droplets, BarChart3, Leaf, Users, Globe } from 'lucide-react';
import { RiverMark } from '@/components/ui/logo';
import { AuthPanel } from '@/components/auth-panel';
import type { Role } from '@/lib/auth-api';

export type { Role };

const CHIPS = [
  { Icon: Droplets, title: 'Real data', sub: 'Live river insights', color: '#6fb6ff' },
  { Icon: BarChart3, title: 'Clear priorities', sub: 'See what matters', color: '#6fb6ff' },
  { Icon: Leaf, title: 'Take action', sub: 'On-ground impact', color: '#45d483' },
  { Icon: Users, title: 'For everyone', sub: 'Citizens · NGOs · Cities', color: '#ffffff' },
];

/**
 * Opening screen — an immersive globe hero (Europe's rivers) fading into a
 * sunlit stream at the foot, with a white sign-in sheet. The one dark,
 * photographic surface in the app; everything after it is the paper-white console.
 */
export function Entry({ onEnter }: { onEnter: (role: string) => void }) {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-[#071326] text-white">
      {/* Background: globe hero, sunlit river at the foot, legibility scrim.
       * No negative z-index — main isn't a stacking context, so DOM order wins:
       * images paint first, scrim over them, content sits at z-10. */}
      <div
        aria-hidden="true"
        className="rk-bg-in absolute inset-0 bg-cover bg-top"
        style={{ backgroundImage: 'url(/hero-globe.jpg)' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[40vh] bg-cover bg-bottom"
        style={{ backgroundImage: 'url(/hero-river.jpg)' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(5,16,33,0) 0%, rgba(5,16,33,0) 26%, rgba(5,16,33,0.5) 50%, rgba(5,16,33,0.74) 64%, rgba(5,16,33,0.15) 76%, rgba(5,16,33,0) 82%)',
        }}
      />

      {/* Top bar: brand + language. */}
      <header className="relative z-10 flex items-start justify-between px-5 pt-[calc(env(safe-area-inset-top)+1rem)]">
        <div className="rk-reveal flex items-center gap-2.5">
          <RiverMark className="h-10 w-10 drop-shadow" />
          <span className="leading-none">
            <span className="block text-[18px] font-bold tracking-[0.14em]">RIVERKIN</span>
            <span className="mt-0.5 block text-[9px] font-medium uppercase tracking-[0.3em] text-white/70">
              Rivers connect us
            </span>
          </span>
        </div>
        <span className="rk-reveal rk-glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-white">
          <Globe className="h-4 w-4" aria-hidden="true" /> EN
        </span>
      </header>

      {/* Hero copy + value chips, pushed to the lower third. */}
      <div className="relative z-10 mt-auto px-5">
        <h1
          className="rk-reveal text-[clamp(2.3rem,12vw,3.2rem)] font-extrabold leading-[1.02] tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
          style={{ animationDelay: '80ms' }}
        >
          Find where
          <br />
          <span className="text-[#4ea6ff]">the river</span>
          <br />
          needs you.
        </h1>

        <svg aria-hidden="true" viewBox="0 0 200 20" className="mt-2 h-4 w-44 overflow-visible" fill="none">
          <path
            className="rk-draw"
            pathLength={1}
            d="M2 11 C 36 2, 56 18, 92 10 S 158 2, 198 10"
            stroke="#4ea6ff"
            strokeWidth={4}
            strokeLinecap="round"
          />
        </svg>

        <p
          className="rk-reveal mt-4 max-w-xs text-[15px] leading-relaxed text-white/85"
          style={{ animationDelay: '200ms' }}
        >
          106 urban streams across five European cities, ranked by what needs a look today.
        </p>

        <div className="rk-reveal mt-5 grid grid-cols-4 gap-2" style={{ animationDelay: '300ms' }}>
          {CHIPS.map(({ Icon, title, sub, color }) => (
            <div key={title} className="rk-glass rounded-2xl border border-white/15 p-2.5">
              <Icon className="h-5 w-5" aria-hidden="true" style={{ color }} />
              <p className="mt-1.5 text-[11px] font-semibold leading-tight text-white">{title}</p>
              <p className="mt-0.5 text-[9px] leading-tight text-white/65">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lower part — the sheet + terms rise up together from the foot on load. */}
      <div className="rk-rise relative z-10 mt-5">
        <div className="rounded-t-[1.75rem] bg-surface px-5 pt-3.5 text-ink shadow-[0_-10px_34px_rgba(0,0,0,0.3)]">
        <div className="mx-auto mb-3.5 h-1 w-10 rounded-full bg-black/15" />
        <AuthPanel
          onGuest={() => {
            void import('@/lib/analytics').then((m) => m.track('guest_entered'));
            onEnter('guest');
          }}
        />
      </div>

        {/* Terms, over the sunlit river at the foot. */}
        <div className="px-5 pb-[calc(env(safe-area-inset-bottom)+0.9rem)] pt-2.5 text-center">
          <p className="text-[11px] leading-relaxed text-white/85 drop-shadow">
            By continuing you agree to our{' '}
            <Link href="/terms" className="font-medium underline underline-offset-2">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="font-medium underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
