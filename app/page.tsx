'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ChevronRight, Droplet } from 'lucide-react';
import { hasEntered } from '@/lib/entry-state';
import { fetchSites } from '@/lib/sites-api';
import { AppBar } from '@/components/app-bar';
import { AttentionMap } from '@/components/attention-map';
import { AttentionStatus } from '@/components/attention-status';
import { SiteCard } from '@/components/site-card';
import { HomeOverview } from '@/components/home-overview';
import { ViewToggle, type HomeView } from '@/components/view-toggle';
import { FilterChips, type SiteFilter } from '@/components/filter-chips';
import { SiteFooter } from '@/components/site-footer';
import { LEVEL_RANK } from '@/lib/attention';
import { mockSites } from '@/lib/mock-data';
import type { Site } from '@/lib/api-types';

function matchesFilter(site: Site, filter: SiteFilter): boolean {
  switch (filter) {
    case 'freshwater':
      // Every monitored OAH site is an urban freshwater stream.
      return true;
    case 'biodiversity':
      // Sites with real OAH ecology (macroinvertebrate/diatom/fish) data.
      return !!site.hasEcology;
    case 'pollution':
      // A pollution / One Health risk concern is present.
      return !!site.pollution;
    case 'unresolved':
      return site.attention === 'urgent';
    default:
      return true;
  }
}

/**
 * C1 — Attention map (home). "Where does the river need you?"
 * Full-screen map with a glass top-priority card and an accessible list view.
 */
export default function HomePage() {
  const router = useRouter();
  const [view, setView] = useState<HomeView>('map');
  const [filter, setFilter] = useState<SiteFilter>('all');
  // Entry gate: first visit opens on the globe/login screen (remembered).
  const [checked, setChecked] = useState(false);

  // Live data from the API; falls back to bundled mock sites if unreachable.
  const { data: liveSites } = useQuery({
    queryKey: ['sites'],
    queryFn: fetchSites,
    staleTime: 60_000,
    retry: 1,
  });
  const baseSites = useMemo(() => liveSites ?? mockSites, [liveSites]);

  const sorted = useMemo(
    () =>
      [...baseSites].sort(
        (a, b) => LEVEL_RANK[a.attention] - LEVEL_RANK[b.attention] || b.daysUnseen - a.daysUnseen,
      ),
    [baseSites],
  );
  const visible = useMemo(() => sorted.filter((s) => matchesFilter(s, filter)), [sorted, filter]);
  const maxDays = useMemo(() => sorted.reduce((m, s) => Math.max(m, s.daysUnseen), 0), [sorted]);

  useEffect(() => {
    if (hasEntered()) {
      setChecked(true);
      void import('@/lib/analytics').then((m) => m.track('map_engaged'));
    } else {
      router.replace('/welcome');
    }
  }, [router]);

  const counts = {
    sites: sorted.length,
    attention: sorted.filter((s) => s.attention === 'attention' || s.attention === 'monitoring').length,
    flags: sorted.filter((s) => s.attention === 'urgent').length,
    recent: sorted.filter((s) => s.attention === 'ok' || s.daysUnseen <= 3).length,
  };

  const lead = visible[0];

  // While deciding whether to show the entry screen, render nothing (avoids a
  // flash of the map before redirecting first-time visitors to /welcome).
  if (!checked) return null;

  const controls = (
    <div className="flex items-center justify-between gap-2 px-4 pt-1">
      <ViewToggle value={view} onChange={setView} />
    </div>
  );
  const chips = (
    <div className="px-4 pt-2">
      <FilterChips value={filter} onChange={setFilter} />
    </div>
  );

  if (view === 'list') {
    return (
      <main className="mx-auto min-h-dvh max-w-2xl pb-28">
        <AppBar active="/" />
        {controls}
        {chips}
        <section aria-label="Sites" className="px-4 pt-4">
          {visible.length === 0 ? (
            <p className="rounded-card border border-unseen bg-surface p-6 text-center text-sm text-ink-muted">
              No sites match this filter.
            </p>
          ) : (
            <ul className="space-y-3">
              {visible.map((site, i) => (
                <li key={site.id}>
                  <SiteCard site={site} maxDays={maxDays} index={i} />
                </li>
              ))}
            </ul>
          )}
        </section>
        <SiteFooter />
      </main>
    );
  }

  // Map view — scrollable dashboard: map region on top, cards below.
  return (
    <main className="relative min-h-dvh bg-bg pb-[calc(env(safe-area-inset-bottom)+6rem)]">
      {/* Map region. */}
      <div className="relative h-[56dvh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <AttentionMap />
        </div>
      </div>

      {/* Top controls — above the map AND the dashboard so the brand menu opens over everything. */}
      <div className="absolute inset-x-0 top-0 z-40">
        <AppBar transparent active="/" />
        <div className="flex items-center justify-between px-4 pt-1">
          <ViewToggle value={view} onChange={setView} />
        </div>
        {chips}
      </div>

      {/* Dashboard content, pulled up to overlap the map. */}
      <div className="relative z-10 -mt-12 space-y-3 px-4">
        {lead ? (
          <Link
            href={`/sites/${lead.id}`}
            className="rk-glass rk-reveal block rounded-card p-3 shadow-[var(--rk-shadow-lift)]"
          >
            <div className="flex items-center gap-3">
              {/* Thumbnail (decorative water tile). */}
              <span
                className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-2xl"
                style={{ background: 'linear-gradient(145deg,#2FA7D9 0%,#1E7BFF 60%,#0E4FA0 100%)' }}
                aria-hidden="true"
              >
                <Droplet className="h-7 w-7 text-white/90" />
              </span>
              <div className="min-w-0 flex-1">
                <AttentionStatus level={lead.attention} />
                <p className="mt-1 truncate text-[20px] font-extrabold text-ink">{lead.name}</p>
                <p className="truncate text-[13px] text-ink-muted">
                  {lead.waterbody} ·{' '}
                  {lead.daysUnseen === 0 ? 'seen today' : `${lead.daysUnseen} days unseen`}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-bg px-2 py-0.5 text-[11px] font-medium text-ink-muted">
                    Freshwater
                  </span>
                  {lead.pollution ? (
                    <span className="rounded-full bg-bg px-2 py-0.5 text-[11px] font-medium text-ink-muted">
                      Water Quality
                    </span>
                  ) : null}
                  {lead.hasEcology ? (
                    <span className="rounded-full bg-bg px-2 py-0.5 text-[11px] font-medium text-ink-muted">
                      Biodiversity
                    </span>
                  ) : null}
                </div>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-unseen bg-surface">
                <ChevronRight className="h-5 w-5 text-ink" aria-hidden="true" />
              </span>
            </div>
          </Link>
        ) : null}

        <HomeOverview sites={counts.sites} flags={counts.flags} />
      </div>
    </main>
  );
}
