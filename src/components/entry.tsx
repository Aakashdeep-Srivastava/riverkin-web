'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Globe, ChevronDown, Eye, Camera, ShieldCheck, ArrowRight, type LucideIcon } from 'lucide-react';
import { RiverMark } from '@/components/ui/logo';
import { AuthPanel } from '@/components/auth-panel';
import { hasOnboarded, markOnboarded } from '@/lib/entry-state';
import type { Role } from '@/lib/auth-api';

export type { Role };

type Stage = 'onboarding' | 'auth';

interface Slide {
  Icon: LucideIcon;
  eyebrow: string;
  title: string;
  body: string;
}

// Learning screens — written to hook a curious 13-year-old AND a biodiversity
// researcher: purpose (notice), competence (act), credibility + belonging (count).
const SLIDES: Slide[] = [
  {
    Icon: Eye,
    eyebrow: 'Notice',
    title: 'Every river is telling a story.',
    body: '106 urban streams across five European cities need someone to notice what’s changing — the foam, the flow, the life returning. Today, that someone is you.',
  },
  {
    Icon: Camera,
    eyebrow: 'Act',
    title: 'No lab. Just five minutes.',
    body: 'Walk to a stream, answer a few simple questions, take a photo. The AI asks — you decide what you see. Simple enough at 13, real enough for science.',
  },
  {
    Icon: ShieldCheck,
    eyebrow: 'It counts',
    title: 'People verify it. Researchers use it.',
    body: 'Your check is confirmed by the community and turned into standardized health data — the same data cities, scientists and biodiversity teams act on.',
  },
];

export function Entry({ onEnter }: { onEnter: (role: string) => void }) {
  // Resolve the stage AFTER mount so SSR and the first client render match
  // (reading localStorage during render causes a hydration mismatch).
  const [stage, setStage] = useState<Stage | null>(null);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    setStage(hasOnboarded() ? 'auth' : 'onboarding');
  }, []);

  function finishOnboarding() {
    markOnboarded();
    setStage('auth');
  }
  function nextSlide() {
    if (slide >= SLIDES.length - 1) finishOnboarding();
    else setSlide((s) => s + 1);
  }

  const s = SLIDES[slide];
  const Icon = s.Icon;

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-[#0a1a30] text-white">
      {/* Single full-bleed background (kept constant across learning + sign-in). */}
      <div
        aria-hidden="true"
        className="rk-bg-in absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/hero-bg.jpg)' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(5,16,33,0) 38%, rgba(5,16,33,0.35) 62%, rgba(5,16,33,0.66) 100%)',
        }}
      />

      {/* Top bar: brand + language. */}
      <header className="relative z-10 flex items-start justify-between px-5 pt-[calc(env(safe-area-inset-top)+1rem)]">
        <div className="rk-reveal flex items-center gap-2.5">
          <RiverMark className="h-10 w-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]" />
          <span className="leading-none [text-shadow:0_2px_10px_rgba(0,0,0,0.55)]">
            <span className="block text-[16px] font-bold tracking-[0.16em] text-white">RIVERKIN</span>
            <span className="mt-0.5 block text-[8px] font-semibold uppercase tracking-[0.3em] text-white/85">
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

      {/* ---- Learning screens ---- */}
      {stage === 'onboarding' ? (
        <div className="relative z-10 mt-auto flex flex-col px-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
          <button
            onClick={finishOnboarding}
            className="self-end text-[13px] font-medium text-white/80 drop-shadow hover:text-white"
          >
            Skip
          </button>

          <div key={slide} className="rk-reveal mt-2">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md">
              <Icon className="h-7 w-7 text-white" aria-hidden="true" />
            </span>
            <p className="mt-5 text-[12px] font-bold uppercase tracking-[0.2em] text-[#6fb6ff] drop-shadow">
              {s.eyebrow}
            </p>
            <h1 className="mt-1.5 text-[clamp(1.6rem,7vw,2rem)] font-extrabold leading-[1.12] tracking-tight drop-shadow-[0_2px_14px_rgba(0,0,0,0.5)]">
              {s.title}
            </h1>
            <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-white/90 drop-shadow">{s.body}</p>
          </div>

          <div className="mt-7 flex items-center justify-between">
            <div className="flex gap-2" role="tablist" aria-label="Progress">
              {SLIDES.map((_, i) => (
                <span
                  key={i}
                  aria-current={i === slide}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === slide ? 'w-6 bg-white' : 'w-2 bg-white/40'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold text-white shadow-[0_6px_18px_rgba(10,110,255,0.4)] transition-transform active:scale-95"
              style={{ background: 'linear-gradient(90deg, #1E7BFF 0%, #0052FF 100%)' }}
            >
              {slide >= SLIDES.length - 1 ? 'Get started' : 'Next'}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : stage === 'auth' ? (
        /* ---- Sign-in ---- */
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
      ) : null}
    </main>
  );
}
