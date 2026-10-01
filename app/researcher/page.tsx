import { Download, Radar, ListChecks } from 'lucide-react';
import { SimulatedBadge } from '@/components/simulated-badge';
import { SiteFooter } from '@/components/site-footer';
import { mockSites } from '@/lib/mock-data';

/**
 * R1 — Researcher view.
 * Expert queue + FHIR Bundle viewer/download. On desktop this uses a left rail
 * (the mobile bottom nav is hidden at md+). This is a minimal placeholder.
 *
 * TODO(PRD): real expert queue (verified observations awaiting sign-off), the
 * exact FHIR Bundle structure/profiles, filtering, and a working download.
 */

// Illustrative FHIR-shaped payload only (not a validated resource).
const SAMPLE_FHIR_BUNDLE = {
  resourceType: 'Bundle',
  type: 'collection',
  entry: [
    {
      resource: {
        resourceType: 'Observation',
        status: 'preliminary',
        code: { text: 'River bank visual check' },
        valueString: 'No foam; water slightly turbid',
      },
    },
  ],
};

export default function ResearcherPage() {
  const queue = mockSites.filter((s) => s.attention !== 'ok');

  return (
    <div className="mx-auto flex min-h-dvh max-w-5xl flex-col md:flex-row">
      {/* Left rail (desktop) / header (mobile) */}
      <aside className="shrink-0 border-unseen px-4 py-6 md:w-56 md:border-r">
        <p className="inline-flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-wide text-ink-muted">
          <Radar className="h-4 w-4 text-water" aria-hidden="true" />
          Researcher
        </p>
        <h1 className="mt-2 text-xl font-bold text-ink">Expert queue</h1>
        <nav aria-label="Researcher sections" className="mt-4 space-y-1 text-sm">
          <span className="flex items-center gap-2 rounded-button bg-[color-mix(in_srgb,var(--water)_10%,var(--surface))] px-3 py-2 font-semibold text-ink">
            <ListChecks className="h-4 w-4" aria-hidden="true" />
            Review queue
          </span>
        </nav>
      </aside>

      <main className="flex-1 px-4 py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-ink-muted">
            Awaiting review ({queue.length})
          </h2>
          <SimulatedBadge />
        </div>

        <ul className="mt-2 space-y-2">
          {queue.map((site) => (
            <li
              key={site.id}
              className="rounded-card border border-unseen bg-surface p-4"
            >
              <p className="font-semibold text-ink">{site.name}</p>
              <p className="text-sm text-ink-muted">
                {site.waterbody} · {site.daysUnseen} days unseen
              </p>
            </li>
          ))}
        </ul>

        {/* FHIR Bundle viewer */}
        <section aria-labelledby="fhir-heading" className="mt-8">
          <div className="flex items-center justify-between">
            <h2 id="fhir-heading" className="text-[13px] font-semibold uppercase tracking-wide text-ink-muted">
              FHIR Bundle
            </h2>
            <button
              type="button"
              className="inline-flex min-h-tap items-center gap-1.5 rounded-button border border-unseen bg-surface px-3 text-sm font-semibold text-ink hover:border-water"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download
            </button>
          </div>
          <pre className="mt-2 overflow-x-auto rounded-card border border-unseen bg-surface p-4 text-xs text-ink">
            {JSON.stringify(SAMPLE_FHIR_BUNDLE, null, 2)}
          </pre>
          {/* TODO(PRD): real Bundle contents and a working download endpoint. */}
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}
