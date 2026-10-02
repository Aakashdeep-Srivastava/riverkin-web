import Link from 'next/link';
import { X, Check, CalendarCheck, Database, Sprout, ShieldCheck } from 'lucide-react';
import { buttonClasses } from '@/components/ui/button';
import { SimulatedBadge } from '@/components/simulated-badge';
import { getMockReceipt, type Receipt } from '@/lib/mock-data';
import { fetchSiteView, type SiteView } from '@/lib/sites-api';

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

/**
 * C6 — Status + impact receipt. The payoff: a concrete statement of what the
 * visit changed, a collectible receipt card with a self-drawing river line, and
 * one Sentinel flavour line. No points or scores (hard rule).
 */
export default async function ReceiptPage({ params }: { params: { id: string } }) {
  const view = await fetchSiteView(params.id);
  const r = view ? buildReceipt(view) : getMockReceipt(params.id);

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
        <h1 className="mt-4 text-2xl font-bold text-ink">Check submitted!</h1>
        <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-ink-muted">
          <ShieldCheck className="h-4 w-4 text-[var(--action)]" aria-hidden="true" />
          {r.state} · 3 guardians are reviewing it
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
        <Link href="/impact" className={buttonClasses('secondary', 'cta')}>
          View your contributions
        </Link>
      </div>
    </main>
  );
}
