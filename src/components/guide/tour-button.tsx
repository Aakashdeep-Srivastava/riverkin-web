'use client';

import { useRouter } from 'next/navigation';
import { Compass } from 'lucide-react';
import { useGuide } from './guide-context';

/**
 * Launches the guided tour from anywhere (app bar). Routes to the map first so
 * the walkthrough always starts at step one.
 */
export function TourButton({ transparent = false }: { transparent?: boolean }) {
  const { start } = useGuide();
  const router = useRouter();
  return (
    <button
      type="button"
      aria-label="Take the guided tour"
      onClick={() => {
        router.push('/');
        start();
      }}
      className={`flex h-10 w-10 items-center justify-center rounded-full border border-unseen text-ink-muted hover:text-ink ${
        transparent ? 'rk-glass' : 'bg-surface'
      }`}
    >
      <Compass className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}

/** A full-width "replay the tour" row for the Me screen. */
export function TourMenuItem() {
  const { start } = useGuide();
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        router.push('/');
        start();
      }}
      className="flex w-full items-center gap-3 rounded-card border border-unseen bg-surface p-4 text-left transition-transform active:scale-[0.99]"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--action-tint)] text-[var(--action)]">
        <Compass className="h-5 w-5" aria-hidden="true" />
      </span>
      <span>
        <span className="block font-semibold text-ink">Take the guided tour</span>
        <span className="block text-sm text-ink-muted">A 60-second walkthrough of the whole loop</span>
      </span>
    </button>
  );
}
