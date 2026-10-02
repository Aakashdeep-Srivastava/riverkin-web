import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Eye, Camera, ShieldCheck, ShieldAlert, ArrowRight } from 'lucide-react';
import { StepIndicator } from '@/components/ui/step-indicator';
import { PhotoFrame } from '@/components/ui/photo-frame';
import { buttonClasses } from '@/components/ui/button';
import {
  getMockSite,
  getMockSiteDetail,
  getMockMissionBrief,
  type MissionBrief,
  type SiteDetail,
} from '@/lib/mock-data';
import { fetchSiteView } from '@/lib/sites-api';
import type { Site } from '@/lib/api-types';

/** Generate a mission brief for any site when there is no bundled one. */
function buildBrief(site: Site, detail: SiteDetail): MissionBrief {
  const name =
    detail.rain48h >= 20
      ? 'After-the-Rain Check'
      : site.daysUnseen >= 30
        ? 'Orphan-Site Check'
        : site.daysUnseen >= 8
          ? 'Fortnightly Check'
          : 'Monitoring Check';
  return {
    id: `mission-${site.id}`,
    siteId: site.id,
    name,
    windowLabel: site.daysUnseen >= 30 ? `Unseen ${site.daysUnseen} days` : 'Open for a few days',
    estMinutes: '3–5 min',
    distanceKm: 1.5,
    safetyLine: 'Photo from the bank only. Never wade or touch water near pipes.',
    steps: ['Observe', 'Photograph', 'Verify'],
  };
}

const STEP_ICONS = [Eye, Camera, ShieldCheck];
const STEP_HINTS = [
  'Answer a few quick questions about the water.',
  'Two photos: upstream and downstream.',
  'Peers verify what you found.',
];

/**
 * C3 — Mission brief. Frames the task: name, window, three steps, and the
 * mandatory safety line (hard rule) before the check begins.
 */
export default async function MissionBriefPage({ params }: { params: { id: string } }) {
  const view = await fetchSiteView(params.id);
  const site = view?.site ?? getMockSite(params.id);
  const detail = view?.detail ?? getMockSiteDetail(params.id);
  if (!site || !detail) notFound();
  const brief = getMockMissionBrief(params.id) ?? buildBrief(site, detail);

  return (
    <main className="mx-auto min-h-dvh max-w-2xl pb-28">
      <header className="flex items-center gap-3 px-4 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
        <Link
          href={`/sites/${site.id}`}
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-unseen text-ink"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </Link>
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-wide text-ink-muted">Mission</p>
          <p className="inline-flex items-center gap-1 text-sm text-ink-muted">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {brief.estMinutes}
          </p>
        </div>
      </header>

      <div className="px-4 pt-5">
        <StepIndicator steps={brief.steps} current={0} />
      </div>

      <div className="space-y-5 px-4 pt-6">
        <div>
          <h1 className="text-[clamp(1.6rem,6vw,2rem)] font-bold leading-tight text-ink">{brief.name}</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {site.name} · {site.waterbody} · {site.daysUnseen} days unseen
          </p>
        </div>

        <PhotoFrame aspect="wide" label={`${site.name}, ${detail.city}`} />

        <div className="flex items-center gap-2 rounded-card border border-unseen bg-surface px-4 py-3 text-sm">
          <Clock className="h-4 w-4 text-[var(--action)]" aria-hidden="true" />
          <span className="font-semibold text-ink">{brief.windowLabel}</span>
          <span className="text-ink-muted">· est. {brief.estMinutes}</span>
        </div>

        {/* Steps */}
        <ol className="space-y-2.5">
          {brief.steps.map((step, i) => {
            const Icon = STEP_ICONS[i] ?? Eye;
            return (
              <li key={step} className="flex items-center gap-3 rounded-card border border-unseen bg-surface p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--action-tint)] text-[var(--action)]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-ink">
                    {i + 1}. {step}
                  </p>
                  <p className="text-sm text-ink-muted">{STEP_HINTS[i]}</p>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Mandatory safety line */}
        <div className="flex gap-3 rounded-card border border-[color-mix(in_srgb,var(--attention)_45%,var(--unseen))] bg-[color-mix(in_srgb,var(--attention)_10%,var(--surface))] p-4">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[var(--attention)]" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-ink">Stay safe</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">{brief.safetyLine}</p>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-unseen bg-surface px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3">
        <Link href={`/check?site=${site.id}`} className={`mx-auto block max-w-2xl ${buttonClasses('primary', 'cta')}`}>
          Start mission
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}
