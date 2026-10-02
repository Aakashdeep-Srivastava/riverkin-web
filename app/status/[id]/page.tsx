import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ScreenHeader } from '@/components/screen-header';
import { AttentionStatus } from '@/components/attention-status';
import { SimulatedBadge } from '@/components/simulated-badge';
import { SiteFooter } from '@/components/site-footer';
import { getMockSite } from '@/lib/mock-data';

/**
 * C6 — Status + impact receipt.
 * Shows the site's current status and a concrete, respectful impact line.
 *
 * TODO(PRD): exact impact-receipt wording and the data behind it (before/after
 * days-unseen, who contributed, what was verified), plus the C7 timeline link.
 */
export default function StatusPage({ params }: { params: { id: string } }) {
  const site = getMockSite(params.id);
  if (!site) notFound();

  // Illustrative "after a check" receipt.
  const before = site.daysUnseen;
  const after = 0;

  return (
    <main className="mx-auto max-w-2xl pb-28">
      <div className="px-4 pt-6">
        <Link
          href="/"
          className="inline-flex min-h-tap items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Map
        </Link>
      </div>

      <ScreenHeader title={site.name} subtitle={site.waterbody} aiStatus="Site status">
        <SimulatedBadge />
      </ScreenHeader>

      {/* Current status */}
      <section className="px-4 pt-4">
        <div className="rounded-card border border-unseen bg-surface p-5">
          <AttentionStatus level={site.attention} />
          <p className="mt-4 text-6xl font-bold tabular-nums text-ink">
            {before}
            <span className="ml-2 align-middle text-base font-medium text-ink-muted">
              {before === 1 ? 'day unseen' : 'days unseen'}
            </span>
          </p>
        </div>
      </section>

      {/* Impact receipt */}
      <section aria-labelledby="impact-heading" className="px-4 pt-6">
        <h2 id="impact-heading" className="text-[13px] font-semibold uppercase tracking-wide text-ink-muted">
          Impact receipt
        </h2>
        <div className="mt-2 rounded-card border border-success bg-[color-mix(in_srgb,var(--success)_10%,var(--surface))] p-5">
          <p className="flex items-center gap-2 text-2xl font-bold tabular-nums text-ink">
            {before} days
            <ArrowRight className="h-5 w-5 text-success" aria-hidden="true" />
            {after}
          </p>
          <p className="mt-1 font-medium text-ink">Monitoring gap closed</p>
          <p className="mt-2 text-sm text-ink-muted">
            A keeper checked this reach and two people verified it.
          </p>
        </div>
      </section>

      <div className="px-4 pb-8 pt-6">
        <Link
          href="/missions"
          className="flex h-cta w-full items-center justify-center rounded-button border border-unseen bg-surface font-semibold text-ink hover:border-water"
        >
          Find another mission
        </Link>
      </div>

      <SiteFooter />
    </main>
  );
}
