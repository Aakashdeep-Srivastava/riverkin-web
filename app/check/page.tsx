'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, ShieldAlert } from 'lucide-react';
import { SimulatedBadge } from '@/components/simulated-badge';

/**
 * C4 — Field check.
 * One question per screen. This is a minimal placeholder for the real flow
 * (camera steps + offline queue persisted via `idb`).
 *
 * TODO(PRD): exact question set, per-question camera/photo steps, input types,
 * and the offline queue (write answers to IndexedDB, sync when back online).
 */
const QUESTIONS = [
  'Is there visible foam or an oily sheen on the water?',
  'Is the water colour unusual (very brown, green, or grey)?',
  'Is there a strong or unusual smell from the water?',
] as const;

export default function FieldCheckPage() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const total = QUESTIONS.length;
  const isLast = step === total - 1;

  function answer() {
    if (isLast) {
      setDone(true);
    } else {
      setStep((s) => s + 1);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col">
      <div className="px-4 pt-6">
        <Link
          href="/missions"
          className="inline-flex min-h-tap items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Leave check
        </Link>
      </div>

      <div className="flex items-center justify-between px-4 pt-4">
        <p className="text-[13px] font-semibold uppercase tracking-wide text-ink-muted">
          Field check
        </p>
        <SimulatedBadge />
      </div>

      {/* Progress */}
      <div className="px-4 pt-4" aria-hidden="true">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-unseen">
          <div
            className="h-full rounded-full bg-water transition-[width]"
            style={{ width: `${((done ? total : step) / total) * 100}%` }}
          />
        </div>
      </div>

      {done ? (
        <section className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success text-white">
            <Check className="h-7 w-7" aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-bold text-ink">Check sent</h1>
          <p className="max-w-sm text-sm text-ink-muted">
            Saved to your device and queued to sync. Others will verify what you found.
          </p>
          <Link
            href="/verify"
            className="mt-2 flex h-cta w-full max-w-xs items-center justify-center rounded-button bg-water font-semibold text-white hover:opacity-90"
          >
            Verify a round
          </Link>
        </section>
      ) : (
        <section
          aria-live="polite"
          className="flex flex-1 flex-col justify-between px-4 pb-8 pt-8"
        >
          <div>
            <p className="text-sm text-ink-muted">
              Question {step + 1} of {total}
            </p>
            <h1 className="mt-2 text-2xl font-bold leading-snug text-ink">
              {QUESTIONS[step]}
            </h1>

            <p className="mt-4 flex items-center gap-2 rounded-card border border-attention bg-[color-mix(in_srgb,var(--attention)_12%,var(--surface))] p-3 text-sm font-medium text-ink">
              <ShieldAlert className="h-5 w-5 shrink-0 text-attention" aria-hidden="true" />
              Photo from the bank only. Never enter the water.
            </p>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={answer}
              className="flex h-cta w-full items-center justify-center gap-2 rounded-button bg-water font-semibold text-white hover:opacity-90"
            >
              Yes
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={answer}
              className="flex h-cta w-full items-center justify-center rounded-button border border-unseen bg-surface font-semibold text-ink hover:border-water"
            >
              No
            </button>
            <button
              type="button"
              onClick={answer}
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
