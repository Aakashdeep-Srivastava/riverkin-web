'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Radar, Check, X, HelpCircle } from 'lucide-react';
import { PhotoFrame } from '@/components/ui/photo-frame';
import { buttonClasses } from '@/components/ui/button';
import { verifyQueue } from '@/lib/mock-data';

type Answer = 'yes' | 'no' | 'cant_tell';
const ROUND_SECONDS = 20;

/** Circular 20-second countdown ring. */
function TimerRing({ remaining }: { remaining: number }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - remaining / ROUND_SECONDS);
  const low = remaining <= 5;
  return (
    <span className="relative inline-flex h-11 w-11 items-center justify-center">
      <svg viewBox="0 0 44 44" className="absolute inset-0 -rotate-90">
        <circle cx="22" cy="22" r={r} fill="none" stroke="var(--unseen)" strokeWidth="3" />
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke={low ? 'var(--urgent)' : 'var(--action)'}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <span className={`text-sm font-bold tabular-nums ${low ? 'text-[var(--urgent)]' : 'text-ink'}`}>
        {remaining}
      </span>
    </span>
  );
}

export default function VerifyPage() {
  const cards = verifyQueue;
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [remaining, setRemaining] = useState(ROUND_SECONDS);

  const done = index >= cards.length;
  const card = cards[index];

  const cities = useMemo(
    () => new Set(cards.map((c) => c.siteName.replace('A stream in ', ''))).size,
    [cards],
  );

  // Per-card 20 s countdown; timing out advances without recording a vote.
  useEffect(() => {
    if (done) return;
    setRemaining(ROUND_SECONDS);
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(id);
          setIndex((n) => n + 1);
          return ROUND_SECONDS;
        }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [index, done]);

  function answer(_a: Answer) {
    setAnswered((n) => n + 1);
    setIndex((n) => n + 1);
  }

  if (done) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center gap-6 px-6 text-center">
        <span className="rk-bloom flex h-20 w-20 items-center justify-center rounded-full bg-[var(--success)] text-white">
          <Check className="h-10 w-10" aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-ink">Round complete</h1>
          <p className="mt-2 text-ink-muted">
            You helped verify <span className="font-semibold text-ink">{answered}</span>{' '}
            {answered === 1 ? 'check' : 'checks'} in{' '}
            <span className="font-semibold text-ink">{cities}</span> places.
          </p>
        </div>
        <div className="flex w-full max-w-xs flex-col gap-3">
          <Link href="/" className={buttonClasses('primary', 'cta')}>
            Back to map
          </Link>
          <Link href="/missions" className={buttonClasses('secondary', 'cta')}>
            More to verify
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col px-4">
      <header className="flex items-center justify-between gap-3 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
        <div className="flex items-center gap-3">
          <Link
            href="/missions"
            aria-label="Leave verify round"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-unseen text-ink"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
          <p className="text-sm font-semibold text-ink">
            Peer verification{' '}
            <span className="tabular-nums text-ink-muted">
              {index + 1}/{cards.length}
            </span>
          </p>
        </div>
        <TimerRing remaining={remaining} />
      </header>

      <div key={index} className="rk-reveal flex flex-1 flex-col pt-5">
        <PhotoFrame aspect="video" simulated label={card.siteName} />

        {/* AI highlight — a question + weak prior, never a verdict. */}
        <div className="mt-4 flex items-start gap-2.5 rounded-card border border-unseen bg-[var(--action-tint)] p-3.5">
          <Radar className="mt-0.5 h-4 w-4 shrink-0 text-[var(--action)]" aria-hidden="true" />
          <p className="text-sm text-ink">
            <span className="font-semibold">RiverKin AI</span> · {card.aiBox}
          </p>
        </div>

        <h1 className="mt-5 text-[clamp(1.4rem,5.5vw,1.9rem)] font-bold leading-tight text-ink">
          {card.prompt}
        </h1>

        <div className="mt-auto grid grid-cols-3 gap-2.5 py-5">
          <button onClick={() => answer('yes')} className={buttonClasses('secondary', 'cta')}>
            <Check className="h-5 w-5 text-[var(--success)]" aria-hidden="true" />
            Yes
          </button>
          <button onClick={() => answer('no')} className={buttonClasses('secondary', 'cta')}>
            <X className="h-5 w-5 text-[var(--urgent)]" aria-hidden="true" />
            No
          </button>
          <button onClick={() => answer('cant_tell')} className={buttonClasses('secondary', 'cta')}>
            <HelpCircle className="h-5 w-5 text-ink-muted" aria-hidden="true" />
            <span className="text-xs">Can&apos;t tell</span>
          </button>
        </div>
      </div>
    </main>
  );
}
