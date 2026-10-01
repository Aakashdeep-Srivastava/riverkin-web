'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, ImageIcon } from 'lucide-react';
import { SimulatedBadge } from '@/components/simulated-badge';
import { mockVerifyCards } from '@/lib/mock-data';
import type { VerifyAnswer } from '@/lib/api-types';

/**
 * C5 — Verify round.
 * Quick cards; answer Yes / No / Can't tell. Placeholder photo area (no network
 * image) so it builds without external assets.
 *
 * TODO(PRD): 20-second timer per card, real photos from submitted checks,
 * exact prompts, and how verdicts aggregate into a verified observation.
 */
export default function VerifyPage() {
  const [index, setIndex] = useState(0);
  const cards = mockVerifyCards;
  const card = cards[index];
  const finished = index >= cards.length;

  function record(_answer: VerifyAnswer) {
    setIndex((i) => i + 1);
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col">
      <div className="px-4 pt-6">
        <Link
          href="/"
          className="inline-flex min-h-tap items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Done for now
        </Link>
      </div>

      <div className="flex items-center justify-between px-4 pt-4">
        <p className="text-[13px] font-semibold uppercase tracking-wide text-ink-muted">
          Verify round
        </p>
        <SimulatedBadge />
      </div>

      {finished ? (
        <section className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success text-white">
            <Check className="h-7 w-7" aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-bold text-ink">Round complete</h1>
          <p className="max-w-sm text-sm text-ink-muted">
            Thanks for the second pair of eyes. Your answers help confirm what field keepers found.
          </p>
          <Link
            href="/"
            className="mt-2 flex h-cta w-full max-w-xs items-center justify-center rounded-button bg-water font-semibold text-white hover:opacity-90"
          >
            Back to map
          </Link>
        </section>
      ) : (
        <section aria-live="polite" className="flex flex-1 flex-col justify-between px-4 pb-8 pt-6">
          <div>
            <p className="text-sm text-ink-muted">
              Card {index + 1} of {cards.length}
            </p>

            {/* Photo placeholder */}
            <div
              role="img"
              aria-label={card.photoAlt}
              className="mt-3 flex h-56 w-full items-center justify-center rounded-card border border-unseen bg-[color-mix(in_srgb,var(--water)_8%,var(--surface))]"
            >
              <ImageIcon className="h-10 w-10 text-ink-muted" aria-hidden="true" />
            </div>

            <h1 className="mt-5 text-2xl font-bold leading-snug text-ink">{card.prompt}</h1>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => record('yes')}
              className="flex h-cta w-full items-center justify-center rounded-button bg-water font-semibold text-white hover:opacity-90"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => record('no')}
              className="flex h-cta w-full items-center justify-center rounded-button border border-unseen bg-surface font-semibold text-ink hover:border-water"
            >
              No
            </button>
            <button
              type="button"
              onClick={() => record('unsure')}
              className="flex min-h-tap w-full items-center justify-center rounded-button font-medium text-ink-muted hover:text-ink"
            >
              Can&apos;t tell
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
