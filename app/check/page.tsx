'use client';

import { Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Camera, Check, ShieldAlert, Send } from 'lucide-react';
import { StepIndicator } from '@/components/ui/step-indicator';
import { OptionButton } from '@/components/ui/option-button';
import { PhotoFrame } from '@/components/ui/photo-frame';
import { Button, buttonClasses } from '@/components/ui/button';
import {
  fieldQuestions,
  cameraSteps,
  feelings,
  type FieldQuestion,
  type CameraStep,
} from '@/lib/mock-data';
import { enqueueCheck } from '@/lib/offline-queue';
import { submitObservation } from '@/lib/observations-api';

type Step =
  | { kind: 'question'; q: FieldQuestion }
  | { kind: 'camera'; c: CameraStep }
  | { kind: 'feeling' };

const STEP_LABELS = ['Observe', 'Photograph', 'Verify'];

function phaseOf(step: Step): number {
  if (step.kind === 'question') return 0;
  if (step.kind === 'camera') return 1;
  return 2;
}

function CheckFlow() {
  const router = useRouter();
  const params = useSearchParams();
  const siteId = params.get('site') ?? 'cb-coselhas';

  const flow = useMemo<Step[]>(
    () => [
      ...fieldQuestions.map((q) => ({ kind: 'question' as const, q })),
      ...cameraSteps.map((c) => ({ kind: 'camera' as const, c })),
      { kind: 'feeling' as const },
    ],
    [],
  );

  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [photos, setPhotos] = useState<Record<string, boolean>>({});
  const [feeling, setFeeling] = useState<string>('');
  const [flashing, setFlashing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const step = flow[i];
  const isLast = i === flow.length - 1;
  const questionCount = fieldQuestions.length;

  const canAdvance =
    step.kind === 'question'
      ? Boolean(answers[step.q.id])
      : step.kind === 'camera'
        ? step.c.optional || Boolean(photos[step.c.id])
        : Boolean(feeling);

  const pipeAlert =
    step.kind === 'question' && step.q.fieldCode === 'pipe_outfall' && answers[step.q.id] === 'yes';

  const progressLabel =
    step.kind === 'question'
      ? `Question ${i + 1} of ${questionCount}`
      : step.kind === 'camera'
        ? `Photo · ${step.c.label}${step.c.optional ? ' (optional)' : ''}`
        : 'One last thing';

  function capture(id: string) {
    setFlashing(true);
    setPhotos((p) => ({ ...p, [id]: true }));
    window.setTimeout(() => setFlashing(false), 450);
  }

  async function submit() {
    setSubmitting(true);
    const photoIds = Object.keys(photos).filter((k) => photos[k]);

    // Try the live API first (PRD F1 step 6: submit the check).
    const created = await submitObservation({
      siteCode: siteId,
      answers,
      feeling,
      photoCount: photoIds.length,
    });

    if (created) {
      router.push(`/receipt/${created.id}?site=${encodeURIComponent(siteId)}`);
      return;
    }

    // Offline / API down — queue in IndexedDB so the check is never lost and
    // show the receipt from the site's mock data (PRD: works by a stream
    // with no signal).
    await enqueueCheck({
      siteId,
      answers,
      photos: photoIds,
      feeling,
      createdAt: Date.now(),
    });
    router.push(`/receipt/${siteId}`);
  }

  function next() {
    if (isLast) {
      void submit();
      return;
    }
    setI((n) => Math.min(n + 1, flow.length - 1));
  }

  function back() {
    if (i === 0) {
      router.push(`/missions/${siteId}`);
      return;
    }
    setI((n) => Math.max(n - 1, 0));
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col px-4">
      {flashing ? (
        <div aria-hidden="true" className="rk-flash pointer-events-none fixed inset-0 z-50 bg-white" />
      ) : null}

      {/* Header */}
      <header className="flex items-center gap-3 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
        <button
          onClick={back}
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-unseen text-ink"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <p className="text-sm font-medium text-ink-muted">{progressLabel}</p>
      </header>

      <div className="pt-5">
        <StepIndicator steps={STEP_LABELS} current={phaseOf(step)} />
      </div>

      {/* Body — re-keyed so each step animates in. */}
      <div key={i} className="rk-reveal flex flex-1 flex-col pt-7">
        {step.kind === 'question' ? (
          <div className="space-y-4">
            <h1 className="font-display text-[clamp(1.6rem,6.5vw,2.1rem)] font-semibold text-ink">
              {step.q.question}
            </h1>
            <div className="space-y-2.5">
              {step.q.options.map((opt) => (
                <OptionButton
                  key={opt.value}
                  label={opt.label}
                  tone={opt.tone}
                  selected={answers[step.q.id] === opt.value}
                  onClick={() => setAnswers((a) => ({ ...a, [step.q.id]: opt.value }))}
                />
              ))}
            </div>
            {pipeAlert ? (
              <div className="flex gap-3 rounded-card border border-[color-mix(in_srgb,var(--urgent)_45%,var(--unseen))] bg-[color-mix(in_srgb,var(--urgent)_10%,var(--surface))] p-4">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[var(--urgent)]" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-ink">
                  <span className="font-semibold">Don&apos;t touch the water.</span> Keep well back
                  from the pipe and photograph only from the bank.
                </p>
              </div>
            ) : null}
          </div>
        ) : step.kind === 'camera' ? (
          <div className="space-y-4">
            <h1 className="font-display text-[clamp(1.6rem,6.5vw,2.1rem)] font-semibold text-ink">
              Photo — {step.c.label}
            </h1>
            <p className="text-sm text-ink-muted">{step.c.hint}</p>
            <PhotoFrame aspect="video" simulated={photos[step.c.id]}>
              {photos[step.c.id] ? (
                <span className="rk-bloom flex flex-col items-center gap-1 text-white">
                  <Check className="h-8 w-8" aria-hidden="true" />
                  <span className="text-sm font-semibold">Captured</span>
                </span>
              ) : (
                <Camera className="h-8 w-8 text-white/80" aria-hidden="true" />
              )}
            </PhotoFrame>
            <Button variant={photos[step.c.id] ? 'secondary' : 'primary'} size="md" onClick={() => capture(step.c.id)}>
              <Camera className="h-4 w-4" aria-hidden="true" />
              {photos[step.c.id] ? 'Retake photo' : 'Capture photo'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h1 className="font-display text-[clamp(1.6rem,6.5vw,2.1rem)] font-semibold text-ink">
              How did the river feel today?
            </h1>
            <p className="text-sm text-ink-muted">Stored with your crew, never tied to a field value.</p>
            <div className="grid grid-cols-2 gap-2.5">
              {feelings.map((f) => (
                <OptionButton
                  key={f.value}
                  label={f.label}
                  selected={feeling === f.value}
                  onClick={() => setFeeling(f.value)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="sticky bottom-0 flex items-center gap-3 bg-[var(--bg)] py-4">
        {step.kind === 'camera' && step.c.optional && !photos[step.c.id] ? (
          <button onClick={next} className={buttonClasses('secondary', 'cta')}>
            Skip
          </button>
        ) : null}
        <Button onClick={next} disabled={!canAdvance || submitting}>
          {isLast ? (
            <>
              <Send className="h-5 w-5" aria-hidden="true" />
              {submitting ? 'Submitting…' : 'Submit for verification'}
            </>
          ) : (
            <>
              Next
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </>
          )}
        </Button>
      </div>
    </main>
  );
}

export default function CheckPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center">
          <Link href="/" className="text-sm text-ink-muted">
            Loading check…
          </Link>
        </div>
      }
    >
      <CheckFlow />
    </Suspense>
  );
}
