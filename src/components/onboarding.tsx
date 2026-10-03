'use client';

import { useState } from 'react';
import { Waves, ClipboardCheck, ShieldCheck, ArrowRight, type LucideIcon } from 'lucide-react';

interface Slide {
  Icon: LucideIcon;
  title: string;
  body: string;
}

const SLIDES: Slide[] = [
  {
    Icon: Waves,
    title: 'Find where the river needs you',
    body: 'A living map of 106 urban streams across five European cities, ranked by how much each needs a fresh look.',
  },
  {
    Icon: ClipboardCheck,
    title: 'Run a 5-minute check',
    body: 'One question per screen, two photos from the bank. It works offline and syncs when you are back online.',
  },
  {
    Icon: ShieldCheck,
    title: 'Peers verify it',
    body: 'AI asks the questions, people decide. You get an impact receipt showing exactly what your visit changed.',
  },
];

/**
 * First-run onboarding — three slides explaining the loop. Shown once, then
 * never again (entry-state remembers). Skippable.
 */
export function Onboarding({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const last = i === SLIDES.length - 1;
  const slide = SLIDES[i];
  const Icon = slide.Icon;

  function next() {
    if (last) onDone();
    else setI((n) => n + 1);
  }

  return (
    <div className="relative z-10 flex min-h-dvh flex-col px-6 pb-[calc(env(safe-area-inset-bottom)+1.75rem)] pt-[calc(env(safe-area-inset-top)+1.5rem)]">
      <div className="flex justify-end">
        <button onClick={onDone} className="text-sm font-medium text-white/60 hover:text-white">
          Skip
        </button>
      </div>

      <div key={i} className="rk-reveal mt-auto">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-md">
          <Icon className="h-8 w-8" aria-hidden="true" />
        </span>
        <h1 className="font-display mt-6 text-[clamp(1.6rem,6vw,2rem)] font-semibold leading-[1.1] text-white">
          {slide.title}
        </h1>
        <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-white/70">{slide.body}</p>
      </div>

      {/* Dots + CTA */}
      <div className="mt-8 flex items-center justify-between">
        <div className="flex gap-2" role="tablist" aria-label="Onboarding progress">
          {SLIDES.map((_, idx) => (
            <span
              key={idx}
              aria-current={idx === i}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === i ? 'w-6 bg-white' : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="inline-flex h-12 items-center gap-2 rounded-button bg-[var(--cta)] px-6 font-semibold text-white transition-transform active:scale-95"
        >
          {last ? 'Get started' : 'Next'}
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
