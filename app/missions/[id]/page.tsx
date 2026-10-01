import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Camera, ShieldAlert } from 'lucide-react';
import { ScreenHeader } from '@/components/screen-header';
import { AttentionStatus } from '@/components/attention-status';
import { SimulatedBadge } from '@/components/simulated-badge';
import { SiteFooter } from '@/components/site-footer';
import { getMockMission } from '@/lib/mock-data';

/**
 * C2 Site attention card + C3 Mission brief.
 * Every brief carries the mandatory safety line.
 */
export default function MissionBriefPage({ params }: { params: { id: string } }) {
  const mission = getMockMission(params.id);
  if (!mission) notFound();

  return (
    <main className="mx-auto max-w-2xl">
      <div className="px-4 pt-6">
        <Link
          href="/missions"
          className="inline-flex min-h-tap items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          All missions
        </Link>
      </div>

      <ScreenHeader title={mission.title} subtitle={mission.siteName} aiStatus="Mission brief">
        <SimulatedBadge />
      </ScreenHeader>

      {/* C2 — site attention card */}
      <section className="px-4 pt-4">
        <div className="rounded-card border border-unseen bg-surface p-5">
          <AttentionStatus level={mission.attention} />
          <p className="mt-3 text-ink">{mission.summary}</p>
          <p className="mt-2 text-sm text-ink-muted">{mission.distanceKm} km away</p>
          {/* TODO(PRD): add the exact site attention card layout — hero "days unseen"
              number, recent-observation sparkline, and Open-Meteo weather context. */}
        </div>
      </section>

      {/* C3 — mission brief steps */}
      <section aria-labelledby="brief-heading" className="px-4 pt-6">
        <h2 id="brief-heading" className="text-[13px] font-semibold uppercase tracking-wide text-ink-muted">
          What to do
        </h2>
        <ol className="mt-2 space-y-2">
          {[
            'Find a safe spot on the bank with a clear view of the water.',
            'Take one photo of the water and bank.',
            'Answer a few quick questions about what you see.',
          ].map((step, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-card border border-unseen bg-surface p-4"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-water text-sm font-semibold text-white">
                {i + 1}
              </span>
              <span className="text-ink">{step}</span>
            </li>
          ))}
        </ol>
        {/* TODO(PRD): exact mission brief copy, camera step order, and offline queue behaviour. */}
      </section>

      {/* Mandatory safety copy — appears on every mission brief. */}
      <section className="px-4 pt-6">
        <p className="flex items-center gap-2 rounded-card border border-attention bg-[color-mix(in_srgb,var(--attention)_12%,var(--surface))] p-4 text-sm font-medium text-ink">
          <ShieldAlert className="h-5 w-5 shrink-0 text-attention" aria-hidden="true" />
          Photo from the bank only. Never enter the water.
        </p>
      </section>

      <div className="px-4 pb-8 pt-6">
        <Link
          href="/check"
          className="flex h-cta w-full items-center justify-center gap-2 rounded-button bg-water text-base font-semibold text-white hover:opacity-90"
        >
          <Camera className="h-5 w-5" aria-hidden="true" />
          Start field check
        </Link>
      </div>

      <SiteFooter />
    </main>
  );
}
