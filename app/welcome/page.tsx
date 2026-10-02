import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { RiverMark } from '@/components/ui/logo';
import { buttonClasses } from '@/components/ui/button';

/**
 * Onboarding. Rivers don't need another app — they need someone to notice.
 * A single calm screen that states the purpose and opens the map.
 */
export default function WelcomePage() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden">
      {/* Atmosphere */}
      <div aria-hidden="true" className="rk-atmosphere" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[55%]"
        style={{
          background:
            'linear-gradient(180deg, color-mix(in srgb, var(--water) 22%, transparent), transparent)',
        }}
      />

      <div className="flex flex-1 flex-col justify-end px-6 pb-10 pt-[calc(env(safe-area-inset-top)+2rem)]">
        <div className="rk-reveal">
          <RiverMark className="h-10 w-14" />
          <p className="mt-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
            RiverKin
          </p>
          <h1 className="mt-2 text-[clamp(2.25rem,10vw,3.25rem)] font-bold leading-[1.05] tracking-tight text-ink">
            Rivers don&rsquo;t need another app.
            <br />
            <span className="text-[var(--action)]">They need someone to notice.</span>
          </h1>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-ink-muted">
            Find where the river needs you. Observe. Verify. Protect — a five-minute check that
            scientists can trust.
          </p>

          {/* River line */}
          <svg viewBox="0 0 320 24" className="mt-7 h-6 w-full max-w-sm" aria-hidden="true">
            <path
              d="M2 12 C50 2 70 22 120 12 S200 2 240 12 S300 22 318 12"
              fill="none"
              stroke="var(--water)"
              strokeWidth="2.5"
              strokeLinecap="round"
              pathLength={1}
              className="rk-draw"
            />
          </svg>
        </div>

        <div className="rk-reveal mt-9" style={{ animationDelay: '150ms' }}>
          <Link href="/" className={buttonClasses('primary', 'cta')}>
            Begin
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
          <p className="mt-4 text-center text-xs text-ink-muted">
            Sites from OneAquaHealth · weather from Open-Meteo
          </p>
        </div>
      </div>
    </main>
  );
}
