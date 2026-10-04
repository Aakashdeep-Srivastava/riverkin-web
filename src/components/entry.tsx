'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { RiverMark } from '@/components/ui/logo';
import { Onboarding } from '@/components/onboarding';
import { AuthPanel } from '@/components/auth-panel';
import { hasOnboarded, markOnboarded } from '@/lib/entry-state';
import type { Role } from '@/lib/auth-api';

export type { Role };

const Globe = dynamic(() => import('@/components/ui/globe'), { ssr: false, loading: () => null });

type Stage = 'splash' | 'onboarding' | 'auth';

const RIVER_DAY =
  'radial-gradient(130% 80% at 50% -10%, #ffffff 0%, #f1f6fb 55%, #e7eff6 100%)';

// Clean white backdrop for the opening brand splash.
const SPLASH_WHITE = '#ffffff';

/**
 * Opening flow: brand splash → first-run onboarding (once) → sign-in. Light
 * theme throughout, matching the rest of the app (paper-white console).
 */
export function Entry({ onEnter }: { onEnter: (role: string) => void }) {
  const [stage, setStage] = useState<Stage>('splash');

  // Auto-advance the splash (shorter when reduced motion is requested).
  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const next = () => setStage(hasOnboarded() ? 'auth' : 'onboarding');
    const t = window.setTimeout(next, reduce ? 400 : 2100);
    return () => window.clearTimeout(t);
  }, []);

  function finishOnboarding() {
    markOnboarded();
    setStage('auth');
  }

  return (
    <main
      className="relative flex min-h-dvh flex-col overflow-hidden"
      style={{ background: stage === 'splash' ? SPLASH_WHITE : RIVER_DAY }}
    >
      {/* Globe backdrop on the sign-in stage. */}
      {stage === 'auth' ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[2%] h-[72vh] w-[150vw] max-w-[900px] -translate-x-1/2"
        >
          <Globe className="h-full w-full" />
        </div>
      ) : null}

      {stage === 'splash' ? (
        <button
          onClick={() => setStage(hasOnboarded() ? 'auth' : 'onboarding')}
          aria-label="Continue"
          className="relative z-10 flex flex-1 flex-col items-center justify-center"
        >
          {/* Dawn light on paper — a whisper of river-blue at the top, warmth at
           * the foot. Decorative; keeps the splash white-dominant. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(120% 70% at 50% 8%, color-mix(in srgb, var(--water) 9%, transparent) 0%, transparent 58%),' +
                'radial-gradient(90% 50% at 50% 104%, color-mix(in srgb, var(--gold) 6%, transparent) 0%, transparent 60%)',
            }}
          />

          <span className="rk-bloom">
            <RiverMark className="h-[5.5rem] w-[5.5rem]" />
          </span>

          <span
            className="rk-reveal mt-6 font-display text-[2.75rem] font-semibold leading-none text-ink"
            style={{ animationDelay: '120ms' }}
          >
            RiverKin
          </span>

          {/* The signature: a river line that draws itself under the wordmark
           * (rk-draw = "the river line drawing itself"). */}
          <svg
            aria-hidden="true"
            viewBox="0 0 240 24"
            className="mt-3 h-6 w-[240px] overflow-visible"
            fill="none"
          >
            <defs>
              <linearGradient id="rk-splash-river" x1="0" y1="0" x2="240" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="var(--action)" stopOpacity="0" />
                <stop offset="0.18" stopColor="var(--action)" />
                <stop offset="0.82" stopColor="var(--water)" />
                <stop offset="1" stopColor="var(--water)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              className="rk-draw"
              pathLength={1}
              d="M2 12 C 40 2, 64 22, 102 12 S 176 2, 202 12 S 232 16, 238 12"
              stroke="url(#rk-splash-river)"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          </svg>

          <span
            className="rk-reveal mt-5 flex items-center gap-2.5 text-[12px] font-medium uppercase tracking-[0.3em] text-ink-muted"
            style={{ animationDelay: '320ms' }}
          >
            <span>Observe</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[var(--water)]/70" />
            <span>Verify</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[var(--water)]/70" />
            <span>Protect</span>
          </span>
        </button>
      ) : null}

      {stage === 'onboarding' ? <Onboarding onDone={finishOnboarding} /> : null}

      {stage === 'auth' ? (
        <>
          <div className="relative z-10 px-6 pt-[calc(env(safe-area-inset-top)+2.25rem)]">
            <div className="rk-reveal flex items-center gap-2">
              <RiverMark className="h-8 w-8" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-muted">RiverKin</span>
            </div>
          </div>

          <div className="relative z-10 mt-auto px-6 pb-[calc(env(safe-area-inset-bottom)+1.75rem)]">
            <div className="rk-reveal" style={{ animationDelay: '120ms' }}>
              <h1 className="font-display text-[clamp(1.7rem,6.5vw,2.1rem)] font-semibold leading-[1.1] text-ink">
                Find where the river needs you.
              </h1>
              <p className="mt-2.5 max-w-xs text-[14px] leading-relaxed text-ink-muted">
                106 urban streams across five European cities, ranked by what needs a look today.
              </p>
            </div>

            <div className="mt-6">
              <AuthPanel
                onGuest={() => {
                  void import('@/lib/analytics').then((m) => m.track('guest_entered'));
                  onEnter('guest');
                }}
              />
            </div>
          </div>
        </>
      ) : null}
    </main>
  );
}
