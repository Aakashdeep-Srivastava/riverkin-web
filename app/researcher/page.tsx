import { Radar, ListChecks, TriangleAlert, Droplets, ShieldCheck, Gauge } from 'lucide-react';
import { SimulatedBadge } from '@/components/simulated-badge';
import { SiteFooter } from '@/components/site-footer';
import { mockSites } from '@/lib/mock-data';
import {
  fetchMetrics,
  fetchExpertQueue,
  type ApiExpertItem,
} from '@/lib/researcher-api';
import { FhirViewer } from './fhir-viewer';

/**
 * R1 — Researcher view. KPI row, expert review queue and a live FHIR Bundle
 * viewer/download. On desktop this uses a left rail (the mobile bottom nav is
 * hidden at md+). KPIs and the queue come from the live API with a mock
 * fallback so the page always renders.
 */
export default async function ResearcherPage() {
  const [metrics, queue] = await Promise.all([fetchMetrics(), fetchExpertQueue()]);

  const kpis = [
    {
      Icon: TriangleAlert,
      label: 'Sites needing attention',
      value: metrics?.sites_needing_attention ?? mockSites.filter((s) => s.attention !== 'ok').length,
      accent: 'var(--attention)',
    },
    {
      Icon: ShieldCheck,
      label: 'Verified this month',
      value: metrics?.verified_this_month ?? 0,
      accent: 'var(--success)',
    },
    {
      Icon: ListChecks,
      label: 'Open expert reviews',
      value: metrics?.open_expert_reviews ?? 0,
      accent: 'var(--urgent)',
    },
    {
      Icon: Gauge,
      label: 'Coverage fresh',
      value: metrics ? `${metrics.coverage_fresh_pct}%` : '—',
      accent: 'var(--water)',
    },
  ];

  const liveQueue: ApiExpertItem[] = queue ?? [];
  const firstObsId = liveQueue[0]?.observation_id ?? null;

  return (
    <div className="mx-auto flex min-h-dvh max-w-5xl flex-col md:flex-row">
      {/* Left rail (desktop) / header (mobile) */}
      <aside className="shrink-0 border-unseen px-4 py-6 md:w-56 md:border-r">
        <p className="inline-flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-wide text-ink-muted">
          <Radar className="h-4 w-4 text-water" aria-hidden="true" />
          Researcher
        </p>
        <h1 className="mt-2 text-xl font-bold text-ink">Trustworthy output</h1>
        <nav aria-label="Researcher sections" className="mt-4 space-y-1 text-sm">
          <span className="flex items-center gap-2 rounded-button bg-[color-mix(in_srgb,var(--water)_10%,var(--surface))] px-3 py-2 font-semibold text-ink">
            <ListChecks className="h-4 w-4" aria-hidden="true" />
            Review queue
          </span>
        </nav>
      </aside>

      <main className="flex-1 px-4 py-6">
        {/* KPI row */}
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-ink-muted">Overview</h2>
          <SimulatedBadge />
        </div>
        <div className="mt-2 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpis.map(({ Icon, label, value, accent }) => (
            <div key={label} className="rounded-card border border-unseen bg-surface p-4">
              <Icon className="h-5 w-5" style={{ color: accent }} aria-hidden="true" />
              <p className="mt-2 text-[clamp(1.6rem,6vw,2rem)] font-bold tabular-nums text-ink">{value}</p>
              <p className="text-xs text-ink-muted">{label}</p>
            </div>
          ))}
        </div>

        {/* AI & verification metrics — honest, each with its sample size. */}
        <h2 className="mt-8 text-[13px] font-semibold uppercase tracking-wide text-ink-muted">
          AI &amp; verification
        </h2>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-card border border-unseen bg-surface p-4">
            <p className="text-[clamp(1.4rem,5vw,1.8rem)] font-bold tabular-nums text-ink">
              {metrics?.ai_human_agreement_pct != null ? `${metrics.ai_human_agreement_pct}%` : '—'}
            </p>
            <p className="text-xs font-medium text-ink">AI–human agreement</p>
            <p className="text-[11px] text-ink-muted">
              {metrics?.ai_human_agreement_n
                ? `over ${metrics.ai_human_agreement_n} verified item${metrics.ai_human_agreement_n === 1 ? '' : 's'}`
                : 'needs verified votes'}
            </p>
          </div>
          <div className="rounded-card border border-unseen bg-surface p-4">
            <p className="text-[clamp(1.4rem,5vw,1.8rem)] font-bold tabular-nums text-ink">
              {metrics?.median_verify_seconds != null ? `${metrics.median_verify_seconds}s` : '—'}
            </p>
            <p className="text-xs font-medium text-ink">Median verify time</p>
            <p className="text-[11px] text-ink-muted">
              {metrics?.verify_votes_n ? `${metrics.verify_votes_n} votes` : 'needs votes'} · lift (vs
              human-only) is roadmap
            </p>
          </div>
          <div className="rounded-card border border-unseen bg-surface p-4">
            <p className="text-[clamp(1.4rem,5vw,1.8rem)] font-bold tabular-nums text-ink">
              {metrics?.revisit_rate_pct != null ? `${metrics.revisit_rate_pct}%` : '—'}
            </p>
            <p className="text-xs font-medium text-ink">Revisit rate (30d)</p>
            <p className="text-[11px] text-ink-muted">
              {metrics?.revisit_eligible_n
                ? `of ${metrics.revisit_eligible_n} checked site${metrics.revisit_eligible_n === 1 ? '' : 's'}`
                : 'needs checks'}
            </p>
          </div>
        </div>

        {/* Expert queue */}
        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-ink-muted">
            Expert queue ({liveQueue.length})
          </h2>
        </div>
        {liveQueue.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {liveQueue.map((item) => (
              <li key={item.observation_id} className="rounded-card border border-unseen bg-surface p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-ink">{item.site_name}</p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_srgb,var(--urgent)_12%,var(--surface))] px-2.5 py-0.5 text-xs font-semibold text-[var(--urgent)]">
                    {item.pipe_flag ? <Droplets className="h-3.5 w-3.5" aria-hidden="true" /> : null}
                    {item.reason}
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink-muted">
                  Observation #{item.observation_id} · {item.verifier_count} verifier
                  {item.verifier_count === 1 ? '' : 's'}
                  {item.trust != null ? ` · trust ${(item.trust * 100).toFixed(0)}%` : ''}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 rounded-card border border-dashed border-unseen bg-surface p-4 text-sm text-ink-muted">
            No observations awaiting expert review. Pipe/sewage flags and split votes appear here.
          </p>
        )}

        <FhirViewer observationId={firstObsId} />

        <SiteFooter />
      </main>
    </div>
  );
}
