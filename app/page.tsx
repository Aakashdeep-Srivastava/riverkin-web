'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { hasEntered } from '@/lib/entry-state';
import { fetchSites } from '@/lib/sites-api';
import { AppBar } from '@/components/app-bar';
import { AttentionMap } from '@/components/attention-map';
import { AttentionStatus } from '@/components/attention-status';
import { SiteCard } from '@/components/site-card';
import { SiteStatBar } from '@/components/site-stat-bar';
import { ViewToggle, type HomeView } from '@/components/view-toggle';
import { FilterChips, type SiteFilter } from '@/components/filter-chips';
import { SiteFooter } from '@/components/site-footer';
import { buttonClasses } from '@/components/ui/button';
import { LEVEL_RANK } from '@/lib/attention';
import { mockSites } from '@/lib/mock-data';
import type { Site } from '@/lib/api-types';

function matchesFilter(site: Site, filter: SiteFilter): boolean {
  switch (filter) {
    case 'fresh':
      return site.attention === 'ok' || site.attention === 'monitoring';
    case 'attention':
      return site.attention === 'attention';
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
        <AppBar />
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

  // Map view — full screen with glass overlays.
  return (
    <main className="relative h-dvh w-full overflow-hidden">
      <div className="absolute inset-0">
        <AttentionMap />
      </div>

      {/* Top overlay: app bar + controls. */}
      <div className="absolute inset-x-0 top-0 z-20">
        <AppBar transparent />
        <div className="flex items-center justify-between px-4 pt-1">
          <ViewToggle value={view} onChange={setView} />
        </div>
        {chips}
      </div>

      {/* Bottom overlay: top-priority site card + stat bar, above the nav. */}
      <div className="absolute inset-x-0 bottom-0 z-20 space-y-3 px-4 pb-[calc(env(safe-area-inset-bottom)+5.5rem)]">
        {lead ? (
          <Link
            href={`/sites/${lead.id}`}
            className="rk-glass rk-reveal block rounded-card p-4 shadow-[var(--rk-shadow-lift)]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <AttentionStatus level={lead.attention} />
                <p className="mt-1 truncate text-lg font-bold text-ink">{lead.name}</p>
                <p className="truncate text-sm text-ink-muted">
                  {lead.waterbody} ·{' '}
                  {lead.daysUnseen === 0 ? 'seen today' : `${lead.daysUnseen} days unseen`}
                </p>
              </div>
              <span className={buttonClasses('primary', 'md')}>
                View
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </Link>
        ) : null}

        <SiteStatBar
          sites={counts.sites}
          attention={counts.attention}
          flags={counts.flags}
          recent={counts.recent}
        />
      </div>
    </main>
  );
}
