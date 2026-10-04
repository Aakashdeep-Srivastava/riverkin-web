import Link from 'next/link';
import { X, Check, CalendarCheck, Database, Sprout, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { buttonClasses } from '@/components/ui/button';
import { ShareImpact } from '@/components/share-impact';
import { SimulatedBadge } from '@/components/simulated-badge';
import { getMockReceipt, type Receipt } from '@/lib/mock-data';
import { fetchSiteView, type SiteView } from '@/lib/sites-api';
import {
  fetchObservationStatus,
  photoUrl,
  type ApiReceipt,
  type ApiReceiptPhoto,
} from '@/lib/observations-api';

/** Human labels for the cross-checked field keys. */
const FIELD_LABELS: Record<string, string> = {
  'q-water': 'Water appearance',
  'q-foam': 'Surface foam',
  'q-litter': 'Litter / debris',
  'q-flow': 'Flow',
  'q-pipe': 'Pipe / outfall',
};

function buildReceipt(view: SiteView): Receipt {
  const { site, detail } = view;
  return {
    siteName: site.name,
    waterbody: site.waterbody,
    city: detail.city,
    gapBefore: site.daysUnseen,
    gapAfter: 0,
    rainContext: `First verified check after ${detail.rain48h} mm of rain`,
    verifierCount: 3,
    fhirId: 'a91f',
    sentinelLine: 'Sombra: "Plant cover was high on the left bank, so I\'m content."',
    state: 'In peer verification',
    dateLabel: '3 Oct 2026 · 14:23',
  };
}

/** Map the live API receipt (snake_case) to the front-end Receipt shape. */
function apiToReceipt(a: ApiReceipt): Receipt {
  return {
    siteName: a.site_name,
    waterbody: a.waterbody,
    city: a.city,
    gapBefore: a.gap_before,
    gapAfter: a.gap_after,
    rainContext: a.rain_context,
    verifierCount: a.verifier_count,
    fhirId: a.fhir_id ?? '—',
    sentinelLine: a.sentinel_line,
    state: a.state,
    dateLabel: a.date_label,
    points: a.points,
  };
}

/**
 * C6 — Status + impact receipt. The payoff: a concrete statement of what the
 * visit changed, a collectible receipt card with a self-drawing river line, and
 * one Sentinel flavour line. No points or scores (hard rule).
 *
 * A numeric ``id`` is a live observation → fetch its status/receipt. A site code
 * (offline fallback from C4) builds a receipt from the site view / mock data.
 */
export default async function ReceiptPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { site?: string };
}) {
  const isObservationId = /^\d+$/.test(params.id);
  let r: Receipt;
  let photo: ApiReceiptPhoto | null = null;
  if (isObservationId) {
    const status = await fetchObservationStatus(params.id);
    if (status) {
      r = apiToReceipt(status.receipt);
      photo = status.receipt.photo;
    } else {
      const view = searchParams.site ? await fetchSiteView(searchParams.site) : null;
      r = view ? buildReceipt(view) : getMockReceipt(searchParams.site ?? params.id);
    }
  } else {
    const view = await fetchSiteView(params.id);
    r = view ? buildReceipt(view) : getMockReceipt(params.id);
  }

  const verified = r.state.toLowerCase().includes('verified');

  const impact = [
    { Icon: CalendarCheck, title: 'Site updated', body: `${r.gapBefore} → ${r.gapAfter} days unseen` },
    { Icon: Database, title: 'Helps the scientific dataset', body: 'OneAquaHealth FHIR R4 Observation' },
    { Icon: Sprout, title: 'Supports local action', body: 'Cleaner rivers for everyone' },
  ];

  return (
    <main className="mx-auto min-h-dvh max-w-2xl px-4 pb-28">
      <div className="flex justify-end pt-[calc(env(safe-area-inset-top)+0.75rem)]">
        <Link
          href="/"
          aria-label="Close"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-unseen text-ink"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </Link>
      </div>

      {/* Confirmation */}
      <div className="flex flex-col items-center pt-2 text-center">
        <span className="rk-bloom flex h-20 w-20 items-center justify-center rounded-full bg-[var(--success)] text-white">
          <Check className="h-10 w-10" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-2xl font-bold text-ink">
          {verified ? 'Community verified!' : 'Check submitted!'}
        </h1>
        <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-ink-muted">
          <ShieldCheck className="h-4 w-4 text-[var(--action)]" aria-hidden="true" />
          {r.state}
          {r.verifierCount > 0
            ? ` · ${r.verifierCount} ${r.verifierCount === 1 ? 'guardian' : 'guardians'} reviewed it`
            : ' · peer review is open'}
        </p>
      </div>

      {/* Collectible receipt card */}
      <div className="relative mt-7 overflow-hidden rounded-card border border-unseen bg-surface shadow-[var(--rk-shadow)]">
        <div className="flex items-center justify-between border-b border-dashed border-unseen px-5 py-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-muted">River Receipt</p>
          <SimulatedBadge />
        </div>

        <div className="px-5 py-5 text-center">
          <p className="text-sm font-semibold text-ink">{r.siteName}</p>
          <p className="text-xs text-ink-muted">
            {r.waterbody} · {r.city} · {r.dateLabel}
          </p>

          <p className="mt-4 flex items-baseline justify-center gap-2 leading-none">
            <span className="text-[clamp(2.5rem,14vw,3.5rem)] font-bold tabular-nums text-ink">
              {r.gapBefore}
            </span>
            <span className="text-xl font-semibold text-ink-muted">→</span>
            <span className="text-[clamp(2.5rem,14vw,3.5rem)] font-bold tabular-nums text-[var(--success)]">
              {r.gapAfter}
            </span>
          </p>
          <p className="mt-1 text-sm font-semibold text-ink">Monitoring gap closed</p>
          <p className="mt-1 text-xs text-ink-muted">{r.rainContext}</p>

          {r.points ? (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--gold)]/20 px-3 py-1 text-sm font-bold text-ink">
              +{r.points} River points
            </p>
          ) : null}

          {/* Self-drawing river line */}
          <svg viewBox="0 0 280 28" className="mx-auto mt-4 h-7 w-full max-w-[16rem]" aria-hidden="true">
            <path
              d="M2 14 C40 2 60 26 100 14 S160 2 200 14 S260 26 278 14"
              fill="none"
              stroke="var(--water)"
              strokeWidth="2.5"
              strokeLinecap="round"
              pathLength={1}
              className="rk-draw"
            />
          </svg>

          <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--action-tint)] px-3 py-1 text-xs font-semibold text-[var(--action)]">
            <Database className="h-3.5 w-3.5" aria-hidden="true" />
            Verified by {r.verifierCount} guardians · FHIR Observation {r.fhirId}
          </p>
        </div>

        <div className="border-t border-dashed border-unseen px-5 py-3">
          <p className="text-xs italic leading-relaxed text-ink-muted">{r.sentinelLine}</p>
        </div>
      </div>

      {/* Captured photo — geotag, vision analysis, capture authenticity */}
      {photo ? (
        <section className="mt-7">
          <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-ink-muted">
            Your photo
          </h2>
          <div className="overflow-hidden rounded-card border border-unseen bg-surface">
            <div className="relative aspect-video w-full bg-[#0b1626]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl(photo.url)}
                alt="Your processed river photo (faces blurred, location stripped)"
                className="h-full w-full object-cover"
              />
              {photo.geotag_label ? (
                <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {photo.geotag_label}
                </span>
              ) : null}
            </div>

            <div className="space-y-3 px-4 py-4">
              {/* Vision analysis */}
              <div className="flex gap-2.5">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--action)]" aria-hidden="true" />
                <div>
                  <p className="text-sm text-ink">{photo.summary}</p>
                  {photo.tags.length ? (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {photo.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-[var(--action-tint)] px-2 py-0.5 text-[11px] font-medium text-[var(--action)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <p className="mt-1 text-[11px] text-ink-muted">
                    {photo.used_model ? `Analysed by ${photo.model}` : 'Heuristic analysis (model offline)'}
                    {' · AI asks, humans decide'}
                  </p>
                </div>
              </div>

              {/* Capture authenticity meter */}
              <div className="rounded-xl border border-unseen bg-[var(--bg)] p-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
                    <ShieldCheck className="h-4 w-4 text-[var(--action)]" aria-hidden="true" />
                    Capture authenticity
                  </span>
                  <span className="text-sm font-bold tabular-nums text-ink">{photo.authenticity}%</span>
                </div>
                <div
                  className="mt-2 h-2 w-full overflow-hidden rounded-full bg-unseen"
                  role="meter"
                  aria-valuenow={photo.authenticity}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Capture authenticity"
                >
                  <div
                    className="h-full rounded-full bg-[var(--success)]"
                    style={{ width: `${photo.authenticity}%` }}
                  />
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-ink-muted">
                  {photo.captured_live ? 'Captured live in-app' : 'Uploaded photo'} ·{' '}
                  {Math.round(photo.ai_generated_likelihood * 100)}% AI-generated estimate · {photo.authenticity_reason}
                </p>
              </div>

              {/* Photo cross-check — your answers vs what the model reads in the photo */}
              {photo.correlation && photo.correlation.length > 0 ? (
                <div className="rounded-xl border border-unseen bg-[var(--bg)] p-3">
                  <p className="text-sm font-semibold text-ink">Photo cross-check</p>
                  <p className="mt-0.5 text-[11px] text-ink-muted">
                    AI compares your answers with the photo. It only asks — people decide.
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {photo.correlation.map((c) => (
                      <li key={c.field} className="flex items-center gap-2 text-sm">
                        <span aria-hidden="true">
                          {c.agrees === null ? '•' : c.agrees ? '✓' : '⚠️'}
                        </span>
                        <span className="flex-1 text-ink">{FIELD_LABELS[c.field] ?? c.field}</span>
                        <span className="text-ink-muted">
                          {c.agrees === null
                            ? 'not assessable'
                            : c.agrees
                              ? 'matches your photo'
                              : 'worth a look'}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {photo.escalated ? (
                    <p className="mt-2 rounded-lg bg-[var(--attention)]/15 px-2.5 py-1.5 text-[12px] font-medium text-ink">
                      Sent to an expert for a closer look — thank you for flagging it.
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* Your impact */}
      <section className="mt-7">
        <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-ink-muted">Your impact</h2>
        <ul className="space-y-2.5">
          {impact.map(({ Icon, title, body }) => (
            <li key={title} className="flex items-center gap-3 rounded-card border border-unseen bg-surface p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--action-tint)] text-[var(--action)]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-semibold text-ink">{title}</p>
                <p className="text-sm text-ink-muted">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-7 flex flex-col gap-3">
        <Link href="/" className={buttonClasses('primary', 'cta')}>
          Back to map
        </Link>
        <ShareImpact siteName={r.siteName} waterbody={r.waterbody} gapBefore={r.gapBefore} />
        <Link href="/impact" className={buttonClasses('secondary', 'cta')}>
          View your contributions
        </Link>
      </div>
    </main>
  );
}
