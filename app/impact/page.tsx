import Link from 'next/link';
import { ChevronRight, Droplets, CalendarCheck, Database } from 'lucide-react';
import { AppBar } from '@/components/app-bar';
import { StatTile } from '@/components/ui/stat-tile';
import { SiteFooter } from '@/components/site-footer';
import { SimulatedBadge } from '@/components/simulated-badge';
import { mockSites, getMockSiteDetail } from '@/lib/mock-data';

/**
 * Impact — contributions, framed by the north-star metric (coverage freshness),
 * never by points or badges. Lists recent checks that link to their receipts.
 */
export default function ImpactPage() {
  const fresh = mockSites.filter((s) => s.daysUnseen <= 14).length;
  const freshness = Math.round((fresh / mockSites.length) * 100);

  return (
    <main className="mx-auto min-h-dvh max-w-2xl pb-28">
      <AppBar />

      <div className="space-y-6 px-4 pt-5">
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-ink">Your impact</h1>
            <SimulatedBadge />
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            Coverage freshness is our north star — the share of sites seen in the last 14 days.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatTile value={`${freshness}%`} label="Coverage fresh" Icon={Droplets} accent="var(--success)" />
          <StatTile value={12} label="Checks made" Icon={CalendarCheck} accent="var(--action)" />
          <StatTile value={9} label="FHIR records" Icon={Database} accent="var(--water)" />
        </div>

        <section>
          <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-ink-muted">
            Recent contributions
          </h2>
          <ul className="space-y-3">
            {mockSites.map((site) => {
              const detail = getMockSiteDetail(site.id);
              return (
                <li key={site.id}>
                  <Link
                    href={`/receipt/${site.id}`}
                    className="rk-card rk-card-link flex items-center gap-3 rounded-card border border-unseen bg-surface p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-ink">{site.name}</p>
                      <p className="truncate text-sm text-ink-muted">
                        {site.waterbody} · {detail?.city ?? ''}
                      </p>
                    </div>
                    <span className="shrink-0 text-right">
                      <span className="text-sm font-semibold text-[var(--success)]">
                        {site.daysUnseen} → 0
                      </span>
                      <span className="block text-[11px] uppercase tracking-wide text-ink-muted">
                        gap closed
                      </span>
                    </span>
                    <ChevronRight className="h-5 w-5 shrink-0 text-ink-muted" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
