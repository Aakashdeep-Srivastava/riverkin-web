'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Droplets, Waves, ShieldCheck, Compass } from 'lucide-react';
import { AppBar } from '@/components/app-bar';
import { StatTile } from '@/components/ui/stat-tile';
import { SiteFooter } from '@/components/site-footer';
import { fetchMetrics } from '@/lib/researcher-api';
import { getToken, fetchScore } from '@/lib/auth-api';
import { listChecks, type QueuedCheck } from '@/lib/offline-queue';
import { identityFor, type IdentityProgress } from '@/lib/identity';

/**
 * Impact — your River Score and standing. The score is the River Value you've
 * earned (usefulness-weighted, more for sites that needed a look), tied to the
 * Observer → River Keeper ladder. Signed-in: permanent, server-side. Guests: a
 * device tally with a nudge to sign in and make it permanent. Never vanity XP.
 */
export default function ImpactPage() {
  const [coverage, setCoverage] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [checks, setChecks] = useState<QueuedCheck[]>([]);
  const [verified, setVerified] = useState(0);
  const [signedIn, setSignedIn] = useState(false);
  const [identity, setIdentity] = useState<IdentityProgress>(() => identityFor(0));

  useEffect(() => {
    void import('@/lib/analytics').then((m) => m.track('identity_viewed'));
    void fetchMetrics().then((m) => m && setCoverage(m.coverage_fresh_pct));
    void listChecks().then(setChecks);

    const hasToken = !!getToken();
    setSignedIn(hasToken);
    (async () => {
      const server = hasToken ? await fetchScore() : null;
      if (server) {
        setScore(server.score);
        setVerified(server.verified);
        setIdentity(identityFor(server.score));
      } else {
        // Guest (or offline): tally River points from this device's checks.
        const local = await listChecks();
        const sum = local.reduce((acc, c) => acc + (c.points ?? 0), 0);
        setScore(sum);
        setIdentity(identityFor(sum));
      }
    })();
  }, []);

  return (
    <main className="mx-auto min-h-dvh max-w-2xl pb-28">
      <AppBar />

      <div className="space-y-6 px-4 pt-5">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Your impact</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Your River Score grows with every useful check — most for the sites that needed a look.
          </p>
        </div>

        {/* River Score + identity progression (goal-gradient, not XP) */}
        <section className="rounded-card border border-unseen bg-surface p-5">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--action-tint)] text-[var(--action)]">
              <Compass className="h-7 w-7" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-ink-muted">
                River Score
              </p>
              <p className="font-display text-3xl font-bold leading-none text-ink tabular-nums">
                {score}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[var(--action)] px-3 py-1 text-xs font-bold text-white">
              {identity.tier.name}
            </span>
          </div>
          <p className="mt-3 text-sm text-ink-muted">{identity.tier.blurb}</p>

          {identity.next ? (
            <div className="mt-4">
              <div className="h-2 overflow-hidden rounded-full bg-unseen">
                <div
                  className="h-full rounded-full bg-[var(--action)] transition-all duration-500"
                  style={{ width: `${Math.round(identity.fraction * 100)}%` }}
                />
              </div>
              <p className="mt-2 text-sm font-medium text-ink">
                {identity.toNext} more {identity.toNext === 1 ? 'point' : 'points'} to{' '}
                {identity.next.name}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm font-medium text-[var(--success)]">
              Highest standing reached. Thank you for keeping the rivers seen.
            </p>
          )}

          {!signedIn ? (
            <Link
              href="/welcome"
              className="mt-4 flex items-center justify-between rounded-xl border border-dashed border-unseen bg-[var(--bg)] px-4 py-3 text-sm font-medium text-ink hover:border-water"
            >
              Sign in to make your score permanent across devices
              <ChevronRight className="h-4 w-4 text-[var(--action)]" aria-hidden="true" />
            </Link>
          ) : null}
        </section>

        <div className="grid grid-cols-3 gap-3">
          <StatTile
            value={coverage == null ? '—' : `${coverage}%`}
            label="Coverage fresh"
            Icon={Droplets}
            accent="var(--success)"
          />
          <StatTile value={checks.length} label="Your checks" Icon={Waves} accent="var(--action)" />
          <StatTile value={verified} label="Verified" Icon={ShieldCheck} accent="var(--water)" />
        </div>

        <section>
          <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-ink-muted">
            Your recent checks
          </h2>
          {checks.length > 0 ? (
            <ul className="space-y-3">
              {checks.slice(0, 12).map((c) => (
                <li key={c.createdAt}>
                  <Link
                    href={`/receipt/${c.siteId}`}
                    className="rk-card rk-card-link flex items-center gap-3 rounded-card border border-unseen bg-surface p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-ink">{c.siteId}</p>
                      <p className="truncate text-sm text-ink-muted">
                        {new Date(c.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                        })}
                        {c.feeling ? ` · felt ${c.feeling}` : ''}
                      </p>
                    </div>
                    {c.points ? (
                      <span className="shrink-0 text-sm font-bold tabular-nums text-[var(--action)]">
                        +{c.points}
                      </span>
                    ) : null}
                    <ChevronRight className="h-5 w-5 shrink-0 text-ink-muted" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Link
              href="/missions"
              className="block rounded-card border border-dashed border-unseen bg-surface p-5 text-center text-sm text-ink-muted hover:border-water"
            >
              No checks yet — find a river that needs you and earn your first River points.
            </Link>
          )}
        </section>

        <p className="text-[11px] leading-relaxed text-ink-muted">
          River Score = the River Value of your checks (10·(1+need)·quality), the usefulness-weighted
          reward — not points per tap. Coverage is live from the RiverKin API over real OneAquaHealth sites.
        </p>
      </div>

      <SiteFooter />
    </main>
  );
}
