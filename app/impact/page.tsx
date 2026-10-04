'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Droplets, CalendarCheck, ShieldCheck, Compass } from 'lucide-react';
import { AppBar } from '@/components/app-bar';
import { StatTile } from '@/components/ui/stat-tile';
import { SiteFooter } from '@/components/site-footer';
import { fetchMetrics } from '@/lib/researcher-api';
import { listChecks, type QueuedCheck } from '@/lib/offline-queue';
import { identityFor, type IdentityProgress } from '@/lib/identity';

/**
 * Impact — your contribution to the shared record, framed by the north-star
 * (coverage freshness) and by identity progression (Observer → River Keeper),
 * never by points or badges. Coverage + verified counts are live from the API;
 * "your checks" are this device's real check history.
 */
export default function ImpactPage() {
  const [coverage, setCoverage] = useState<number | null>(null);
  const [verified, setVerified] = useState<number | null>(null);
  const [checks, setChecks] = useState<QueuedCheck[]>([]);
  const [identity, setIdentity] = useState<IdentityProgress>(() => identityFor(0));

  useEffect(() => {
    void fetchMetrics().then((m) => {
      if (m) {
        setCoverage(m.coverage_fresh_pct);
        setVerified(m.verified_this_month);
      }
    });
    void listChecks().then((c) => {
      setChecks(c);
      setIdentity(identityFor(c.length));
    });
  }, []);

  return (
    <main className="mx-auto min-h-dvh max-w-2xl pb-28">
      <AppBar />

      <div className="space-y-6 px-4 pt-5">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Your impact</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Coverage freshness is our north star — the share of OneAquaHealth sites seen recently.
          </p>
        </div>

        {/* Identity progression (goal-gradient, not points) */}
        <section className="rounded-card border border-unseen bg-surface p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--action-tint)] text-[var(--action)]">
              <Compass className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-wide text-ink-muted">
                Your standing
              </p>
              <p className="font-display text-lg font-semibold leading-tight text-ink">
                {identity.tier.name}
              </p>
            </div>
          </div>
          <p className="mt-2 text-sm text-ink-muted">{identity.tier.blurb}</p>

          {identity.next ? (
            <div className="mt-4">
              <div className="h-2 overflow-hidden rounded-full bg-unseen">
                <div
                  className="h-full rounded-full bg-[var(--action)] transition-all duration-500"
                  style={{ width: `${Math.round(identity.fraction * 100)}%` }}
                />
              </div>
              <p className="mt-2 text-sm font-medium text-ink">
                {identity.toNext} more {identity.toNext === 1 ? 'check' : 'checks'} to{' '}
                {identity.next.name}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm font-medium text-[var(--success)]">
              You’ve reached the highest standing. Thank you for keeping the rivers seen.
            </p>
          )}
        </section>

        <div className="grid grid-cols-3 gap-3">
          <StatTile
            value={coverage == null ? '—' : `${coverage}%`}
            label="Coverage fresh"
            Icon={Droplets}
            accent="var(--success)"
          />
          <StatTile value={checks.length} label="Your checks" Icon={CalendarCheck} accent="var(--action)" />
          <StatTile
            value={verified == null ? '—' : verified}
            label="Verified (community)"
            Icon={ShieldCheck}
            accent="var(--water)"
          />
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
              No checks yet — find a river that needs you and make your first one count.
            </Link>
          )}
        </section>

        <p className="text-[11px] leading-relaxed text-ink-muted">
          Coverage &amp; verification counts from the live RiverKin API over real OneAquaHealth sites.
          Your checks are stored on this device.
        </p>
      </div>

      <SiteFooter />
    </main>
  );
}
