'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowRight, Compass, X } from 'lucide-react';
import { useGuide, hasCompletedTour, TOUR_LENGTH } from './guide-context';
import { hasEntered } from '@/lib/entry-state';

interface Step {
  title: string;
  body: string;
  /** Label for the advance button; null means the step waits for a user action. */
  cta: string | null;
}

const STEPS: Step[] = [
  {
    title: 'The attention map',
    body: 'Every marker is a real stream, pulsing by how urgently it needs a look today. Let’s open the most urgent one.',
    cta: 'Open the top site',
  },
  {
    title: 'Why this site needs you',
    body: 'Days unseen, recent rainfall and the trend explain the attention. Ready to help? Open its mission brief.',
    cta: 'See the brief',
  },
  {
    title: 'A safety-first brief',
    body: 'Every mission leads with how to stay safe — photos from the bank only. Then it’s three quick steps.',
    cta: 'Start the check',
  },
  {
    title: 'Run the 5-minute check',
    body: 'One question per screen, two bank-side photos, then submit. Finish the check below to see your receipt.',
    cta: null,
  },
  {
    title: 'Your impact receipt',
    body: 'Proof of exactly what your visit changed — with a real FHIR Observation id. Now see your cumulative impact.',
    cta: 'See your impact',
  },
  {
    title: 'Your contribution',
    body: 'Everything you’ve changed, in one place. The other half of the loop is verifying others’ checks.',
    cta: 'Help verify',
  },
  {
    title: 'Verify others — the full loop',
    body: '20-second rounds: confirm what others saw. AI asks, people decide. That’s RiverKin end to end!',
    cta: 'Finish tour',
  },
];

/**
 * Guided learning overlay. A step-driven walkthrough that narrates each screen
 * and navigates the canonical loop for the viewer. Auto-offers once for new
 * visitors; re-triggerable from the app bar and the Me screen.
 */
export function GuideBanner() {
  const { active, step, siteId, start, end, setStep } = useGuide();
  const router = useRouter();
  const pathname = usePathname();

  // Auto-offer the tour once, the first time a viewer reaches the map. Skipped
  // for automated browsers so it never interferes with end-to-end tests.
  useEffect(() => {
    const automated = typeof navigator !== 'undefined' && navigator.webdriver;
    if (!automated && !active && pathname === '/' && hasEntered() && !hasCompletedTour()) {
      start();
    }
  }, [active, pathname, start]);

  // Hand-off from the check step: when the receipt appears, advance automatically.
  useEffect(() => {
    if (active && step === 3 && pathname.startsWith('/receipt/')) {
      setStep(4);
    }
  }, [active, step, pathname, setStep]);

  if (!active) return null;

  const current = STEPS[step] ?? STEPS[0];
  const site = siteId ?? '';

  function advance() {
    switch (step) {
      case 0:
        setStep(1);
        router.push(`/sites/${encodeURIComponent(site)}`);
        break;
      case 1:
        setStep(2);
        router.push(`/missions/${encodeURIComponent(site)}`);
        break;
      case 2:
        setStep(3);
        router.push(`/check?site=${encodeURIComponent(site)}`);
        break;
      case 4:
        setStep(5);
        router.push('/impact');
        break;
      case 5:
        setStep(6);
        router.push('/verify');
        break;
      case 6:
      default:
        end();
        break;
    }
  }

  // The "waiting" step (the check) needs the viewer to use the page's own
  // controls, so the banner sits at the top and never intercepts pointer events.
  const waiting = current.cta === null;

  if (waiting) {
    return (
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] px-4 pt-[calc(env(safe-area-inset-top)+4.25rem)]"
        role="dialog"
        aria-label="Guided tour"
      >
        <div className="mx-auto max-w-md rounded-card border border-[var(--action)] bg-surface/95 px-4 py-2.5 shadow-[var(--rk-shadow-lift)] backdrop-blur">
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-[var(--action)]">
            <Compass className="h-4 w-4" aria-hidden="true" />
            Guided tour · {Math.min(step + 1, TOUR_LENGTH)}/{TOUR_LENGTH}
          </span>
          <p className="mt-0.5 text-sm font-semibold text-ink">{current.title}</p>
          <p className="text-sm text-ink-muted">{current.body}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] px-4 pb-[calc(env(safe-area-inset-bottom)+5.25rem)]"
      role="dialog"
      aria-label="Guided tour"
    >
      <div className="pointer-events-auto mx-auto max-w-md rounded-card border border-[var(--action)] bg-surface p-4 shadow-[var(--rk-shadow-lift)]">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-[var(--action)]">
            <Compass className="h-4 w-4" aria-hidden="true" />
            Guided tour · {Math.min(step + 1, TOUR_LENGTH)}/{TOUR_LENGTH}
          </span>
          <button
            onClick={end}
            aria-label="End tour"
            className="-m-1 flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:text-ink"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <p className="mt-2 font-display text-lg font-semibold text-ink">{current.title}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">{current.body}</p>

        {/* Progress dots. */}
        <div className="mt-3 flex gap-1.5" aria-hidden="true">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'w-5 bg-[var(--action)]' : 'w-1.5 bg-unseen'
              }`}
            />
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <button onClick={end} className="text-sm font-medium text-ink-muted hover:text-ink">
            Skip tour
          </button>
          {current.cta ? (
            <button
              onClick={advance}
              className="inline-flex min-h-tap items-center gap-2 rounded-button bg-[var(--action)] px-5 font-semibold text-white transition-transform active:scale-[0.98]"
            >
              {current.cta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <span className="text-sm font-medium text-ink-muted">Complete the check to continue →</span>
          )}
        </div>
      </div>
    </div>
  );
}
