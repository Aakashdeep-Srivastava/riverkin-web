'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ChevronRight, ChevronDown, Droplet } from 'lucide-react';
import { hasEntered } from '@/lib/entry-state';
import { fetchSites } from '@/lib/sites-api';
import { AppBar } from '@/components/app-bar';
import { LocationPrompt } from '@/components/location-prompt';
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
  // Dashboard cards (priority, level, active mission) can collapse to reveal the
  // full map. Remembered on-device.
  const [collapsed, setCollapsed] = useState(false);
  // Entry gate: first visit opens on the globe/login screen (remembered).
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem('rk_dash_collapsed') === '1');
    } catch {
      /* ignore */
    }
  }, []);

  function toggleCollapsed() {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem('rk_dash_collapsed', next ? '1' : '0');
      } catch {
        /* ignore */
      }
      return next;
    });
  }

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

  // While deciding whether to show the entry screen, paint an instant static
  // shell (header + map/card skeletons) instead of a blank screen. Returning
  // visitors see chrome immediately and it fills in; first-time visitors are
  // redirected to /welcome a beat later.
  if (!checked) {
    return (
      <main className="relative min-h-dvh bg-bg pb-[calc(env(safe-area-inset-bottom)+6rem)]">
        <div className="relative h-[68dvh] w-full overflow-hidden">
          <div className="absolute inset-0 animate-pulse bg-[color-mix(in_srgb,var(--water)_12%,var(--surface))]" />
        </div>
        <div className="absolute inset-x-0 top-0 z-40">
          <AppBar transparent active="/" />
        </div>
        <div className="relative z-10 -mt-8 space-y-2.5 px-4" aria-hidden="true">
          <div className="h-[72px] animate-pulse rounded-card bg-surface shadow-[var(--rk-shadow-lift)]" />
          <div className="h-24 animate-pulse rounded-card bg-surface" />
        </div>
      </main>
    );
  }

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
      {/* Map region — large so the map dominates the first view. */}
      <div className="relative h-[68dvh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <AttentionMap sites={baseSites} />
        </div>
      </div>

      {/* Top chrome: brand bar + filters sit together near the top. */}
      <div className="absolute inset-x-0 top-0 z-40">
        <AppBar transparent active="/" />
        {chips}
      </div>

      {/* Floating Map/List toggle — small vertical control on the right of the map. */}
      <div className="absolute right-3 top-[28%] z-30">
        <ViewToggle value={view} onChange={setView} orientation="vertical" />
      </div>

      {/* Dashboard, pulled up to overlap the map — collapsible to reveal the full map. */}
      <div className="relative z-10 -mt-8 px-4">
        <div className="flex justify-center">
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-expanded={!collapsed}
            className="rk-glass inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-ink shadow-[var(--rk-shadow)]"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${collapsed ? '' : 'rotate-180'}`}
              aria-hidden="true"
            />
            {collapsed ? 'Show dashboard' : 'Hide'}
          </button>
        </div>

        {!collapsed ? (
          <div className="mt-2 space-y-2.5">
            <LocationPrompt />
            {lead ? (
              <Link
                href={`/sites/${lead.id}`}
                className="rk-glass rk-reveal block rounded-card p-2.5 shadow-[var(--rk-shadow-lift)]"
              >
                <div className="flex items-center gap-2.5">
                  {/* Thumbnail (decorative water tile). */}
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: 'linear-gradient(145deg,#2FA7D9 0%,#1E7BFF 60%,#0E4FA0 100%)' }}
                    aria-hidden="true"
                  >
                    <Droplet className="h-5 w-5 text-white/90" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <AttentionStatus level={lead.attention} />
                    <p className="truncate text-[16px] font-extrabold leading-tight text-ink">{lead.name}</p>
                    <p className="truncate text-[12px] text-ink-muted">
                      {lead.waterbody} ·{' '}
                      {lead.daysUnseen === 0 ? 'seen today' : `${lead.daysUnseen} days unseen`}
                    </p>
                  </div>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-unseen bg-surface">
                    <ChevronRight className="h-4 w-4 text-ink" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ) : null}

            <HomeOverview sites={counts.sites} flags={counts.flags} />
          </div>
        ) : null}
      </div>
    </main>
  );
}
