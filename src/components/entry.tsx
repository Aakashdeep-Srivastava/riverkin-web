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

const RIVER_NIGHT =
  'radial-gradient(130% 80% at 50% -10%, #0e2d4a 0%, #071a2b 55%, #04101c 100%)';

/**
 * Opening flow: brand splash → first-run onboarding (once) → sign-in (demo or
 * real account). The one dark surface in the app; the rest stays white.
 */
export function Entry({ onEnter }: { onEnter: (role: string) => void }) {
  const [stage, setStage] = useState<Stage>('splash');

  // Auto-advance the splash (shorter when reduced motion is requested).
  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const next = () => setStage(hasOnboarded() ? 'auth' : 'onboarding');
    const t = window.setTimeout(next, reduce ? 400 : 1700);
    return () => window.clearTimeout(t);
  }, []);

  function finishOnboarding() {
    markOnboarded();
    setStage('auth');
  }

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden" style={{ background: RIVER_NIGHT }}>
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
          className="relative z-10 flex flex-1 flex-col items-center justify-center gap-5"
        >
          <span className="rk-bloom">
            <RiverMark className="h-24 w-24" />
          </span>
          <span className="rk-reveal text-2xl font-bold tracking-tight text-white" style={{ animationDelay: '150ms' }}>
            RiverKin
          </span>
          <span
            className="rk-reveal text-[13px] uppercase tracking-[0.2em] text-white/50"
            style={{ animationDelay: '300ms' }}
          >
            Observe · Verify · Protect
          </span>
        </button>
      ) : null}

      {stage === 'onboarding' ? <Onboarding onDone={finishOnboarding} /> : null}

      {stage === 'auth' ? (
        <>
          <div className="relative z-10 px-6 pt-[calc(env(safe-area-inset-top)+2.25rem)]">
            <div className="rk-reveal flex items-center gap-2">
              <RiverMark className="h-8 w-8" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/70">RiverKin</span>
            </div>
          </div>

          <div className="relative z-10 mt-auto px-6 pb-[calc(env(safe-area-inset-bottom)+1.75rem)]">
            <div className="rk-reveal" style={{ animationDelay: '120ms' }}>
              <h1 className="font-display text-[clamp(1.7rem,6.5vw,2.1rem)] font-semibold leading-[1.1] text-white">
                Find where the river needs you.
              </h1>
              <p className="mt-2.5 max-w-xs text-[14px] leading-relaxed text-white/65">
                106 urban streams across five European cities, ranked by what needs a look today.
              </p>
            </div>

            <div className="mt-6">
              <AuthPanel onGuest={() => onEnter('guest')} />
            </div>
          </div>
        </>
      ) : null}
    </main>
  );
}
