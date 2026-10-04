'use client';

import Link from 'next/link';
import { Globe, ChevronDown } from 'lucide-react';
import { RiverMark } from '@/components/ui/logo';
import { AuthPanel } from '@/components/auth-panel';
import type { Role } from '@/lib/auth-api';

export type { Role };

/**
 * Opening screen — a single immersive scene (sky → globe of Europe's rivers →
 * sunlit stream), with the brand, headline and sign-in floating directly on it.
 * The one photographic surface; the rest of the app is the paper-white console.
 */
export function Entry({ onEnter }: { onEnter: (role: string) => void }) {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-[#0a1a30] text-white">
      {/* Single full-bleed background. */}
      <div
        aria-hidden="true"
        className="rk-bg-in absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/hero-bg.jpg)' }}
      />
      {/* Legibility scrim — darkens the lower area behind the copy + buttons. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(5,16,33,0) 42%, rgba(5,16,33,0.3) 66%, rgba(5,16,33,0.6) 100%)',
        }}
      />

      {/* Top bar: brand + language. */}
      <header className="relative z-10 flex items-start justify-between px-5 pt-[calc(env(safe-area-inset-top)+1rem)]">
        <div className="rk-reveal flex items-center gap-2.5">
          <RiverMark className="h-9 w-9 drop-shadow" />
          <span className="leading-none">
            <span className="block text-[15px] font-bold tracking-[0.16em] text-[#0e1b38]">RIVERKIN</span>
            <span className="mt-0.5 block text-[8px] font-semibold uppercase tracking-[0.3em] text-[#1E7BFF]">
              Rivers connect us
            </span>
          </span>
        </div>
        <button
          type="button"
          className="rk-reveal flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-sm font-semibold text-ink shadow-sm backdrop-blur"
        >
          <Globe className="h-4 w-4" aria-hidden="true" /> EN
          <ChevronDown className="h-3.5 w-3.5 text-ink-muted" aria-hidden="true" />
        </button>
      </header>

      {/* Headline + sign-in, anchored to the foot. */}
      <div className="relative z-10 mt-auto px-5 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
        <h1
          className="rk-reveal text-[clamp(1.6rem,7.5vw,2.1rem)] font-extrabold leading-[1.1] tracking-tight drop-shadow-[0_2px_14px_rgba(0,0,0,0.5)]"
          style={{ animationDelay: '80ms' }}
        >
          Find where
          <br />
          <span className="text-[#4ea6ff]">the river</span>
          <br />
          needs you.
        </h1>

        <svg aria-hidden="true" viewBox="0 0 200 20" className="mt-1.5 h-3 w-32 overflow-visible" fill="none">
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
          className="rk-reveal mt-3 max-w-xs text-[13px] leading-relaxed text-white/90 drop-shadow"
          style={{ animationDelay: '200ms' }}
        >
          106 urban streams across five European cities, ranked by what needs a look today.
        </p>

        {/* Sign-in — floats on the scene, rising in on load. */}
        <div className="rk-rise mt-7">
          <AuthPanel
            onGuest={() => {
              void import('@/lib/analytics').then((m) => m.track('guest_entered'));
              onEnter('guest');
            }}
          />
        </div>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-white/80 drop-shadow">
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
    </main>
  );
}
