'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, ArrowRight, Trophy } from 'lucide-react';
import { AppBar } from '@/components/app-bar';
import { SiteFooter } from '@/components/site-footer';
import { ChallengeList } from '@/components/community/challenge-list';
import {
  fetchStandings,
  fetchChallenges,
  type CityStanding,
  type Challenge,
} from '@/lib/community-api';
import { track } from '@/lib/analytics';

/**
 * Community — the Track 5 home for sustained participation. Collective city
 * standings (ranked by usefulness: coverage kept fresh + gaps closed, never
 * personal points) and this-period field challenges, both live from the API.
 */
export default function CommunityPage() {
  const [standings, setStandings] = useState<CityStanding[] | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    track('community_opened');
    void fetchStandings().then(setStandings);
    void fetchChallenges().then((c) => {
      setChallenges(c ?? []);
      if (c && c.length > 0) track('challenge_viewed', { count: c.length });
    });
  }, []);

  return (
    <main className="mx-auto min-h-dvh max-w-2xl pb-28">
      <AppBar />

      <div className="space-y-6 px-4 pt-5">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Community</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Five cities keeping their rivers seen — together.
          </p>
        </div>

        {/* This-period challenges */}
        {challenges.length > 0 ? (
          <section>
            <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-ink-muted">
              This week
            </h2>
            <ChallengeList challenges={challenges} />
          </section>
        ) : null}

        {/* City standings */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wide text-ink-muted">
            <Trophy className="h-4 w-4" aria-hidden="true" /> City standings
          </h2>
          {standings && standings.length > 0 ? (
            <ul className="space-y-2">
              {standings.map((s) => (
                <li
                  key={s.city}
                  className="rounded-card border border-unseen bg-surface p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--action-tint)] text-sm font-bold text-[var(--action)]">
                      {s.rank}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-ink">{s.city}</p>
                      <p className="text-xs text-ink-muted">
                        {s.sites_fresh}/{s.sites_total} sites fresh
                        {s.gaps_closed > 0 ? ` · ${s.gaps_closed} gap-days closed` : ''}
                        {s.checks_7d > 0 ? ` · ${s.checks_7d} checks this week` : ''}
                      </p>
                    </div>
                    <span className="shrink-0 text-right text-lg font-bold tabular-nums text-ink">
                      {s.coverage_pct}%
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-unseen">
                    <div
                      className="h-full rounded-full bg-[var(--success)]"
                      style={{ width: `${s.coverage_pct}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-card border border-dashed border-unseen bg-surface p-5 text-center text-sm text-ink-muted">
              Standings are loading…
            </p>
          )}
          <p className="mt-2 text-[11px] text-ink-muted">
            Ranked by coverage kept fresh — a shared goal, not a personal scoreboard.
          </p>
        </section>

        {/* Your crew */}
        <Link
          href="/crew"
          className="flex items-center gap-3 rounded-card border border-unseen bg-[var(--action-tint)] p-4"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--action)] text-white">
            <Users className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-ink">Your crew</p>
            <p className="text-sm text-ink-muted">Adopt up to three rivers and keep them seen together.</p>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-[var(--action)]" aria-hidden="true" />
        </Link>
      </div>

      <SiteFooter />
    </main>
  );
}
