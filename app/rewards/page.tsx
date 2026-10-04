'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star, Flame, TrendingUp, Lock, Check } from 'lucide-react';
import { AppBar } from '@/components/app-bar';
import { fetchScore } from '@/lib/auth-api';
import { identityFor, TIERS } from '@/lib/identity';
import { getStreak } from '@/lib/streak';

/**
 * Rewards — your River Score (a usefulness signal, not vanity points), the
 * identity ladder (Observer → Explorer → River Keeper), the on-device day
 * streak, and how River Value is earned. Score is server-backed when signed in.
 */
export default function RewardsPage() {
  const [streak, setStreak] = useState(0);
  useEffect(() => setStreak(getStreak()), []);

  const { data: score, isLoading } = useQuery({
    queryKey: ['score'],
    queryFn: fetchScore,
    staleTime: 60_000,
    retry: 0,
  });

  const points = score?.score ?? 0;
  const identity = identityFor(points);
  const signedIn = !!score;

  return (
    <main className="mx-auto min-h-dvh max-w-2xl pb-28">
      <AppBar active="/rewards" />
      <div className="px-4 pt-4">
        <h1 className="text-[26px] font-extrabold tracking-tight text-ink">Rewards</h1>
        <p className="mt-1 text-[14px] text-ink-muted">
          Your River Score reflects how useful your checks are — not how many you make.
        </p>

        {/* Score hero */}
        <div className="mt-5 rounded-card border border-unseen bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--action)]/12">
              <Star className="h-8 w-8 fill-[#F2A93B] text-[#F2A93B]" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[32px] font-extrabold leading-none text-ink tabular-nums">{points}</p>
              <p className="text-[13px] font-semibold text-[var(--action)]">{identity.tier.name}</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 rounded-full bg-[#E5724D]/12 px-3 py-1.5">
              <Flame className="h-4 w-4 text-[#E5724D]" aria-hidden="true" />
              <span className="text-[14px] font-bold text-ink tabular-nums">{streak}</span>
              <span className="text-[12px] text-ink-muted">day streak</span>
            </div>
          </div>

          {identity.next ? (
            <>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-bg">
                <div
                  className="h-full rounded-full bg-[var(--action)]"
                  style={{ width: `${Math.round(identity.fraction * 100)}%` }}
                />
              </div>
              <p className="mt-1.5 text-[12px] text-ink-muted">
                {identity.toNext} points to <span className="font-semibold text-ink">{identity.next.name}</span>
              </p>
            </>
          ) : (
            <p className="mt-4 text-[13px] font-medium text-[var(--success)]">
              Top tier reached — a steward your streams rely on.
            </p>
          )}

          {!signedIn && !isLoading ? (
            <p className="mt-3 rounded-xl bg-bg px-3 py-2 text-[12px] text-ink-muted">
              You’re browsing as a guest. <span className="font-semibold text-ink">Sign in</span> to make
              your checks count and save your River Score for good.
            </p>
          ) : null}
        </div>

        {/* Identity ladder */}
        <h2 className="mt-6 text-[13px] font-bold uppercase tracking-[0.14em] text-ink-muted">Your path</h2>
        <ol className="mt-2 space-y-2">
          {TIERS.map((t) => {
            const reached = points >= t.at;
            const current = identity.tier.key === t.key;
            return (
              <li
                key={t.key}
                className={`flex items-center gap-3 rounded-card border p-3.5 ${
                  current ? 'border-[var(--action)] bg-[var(--action)]/8' : 'border-unseen bg-surface'
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    reached ? 'bg-[var(--success)] text-white' : 'bg-bg text-ink-muted'
                  }`}
                >
                  {reached ? <Check className="h-4 w-4" aria-hidden="true" /> : <Lock className="h-4 w-4" aria-hidden="true" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-bold text-ink">{t.name}</p>
                  <p className="truncate text-[12px] text-ink-muted">{t.blurb}</p>
                </div>
                <span className="shrink-0 text-[12px] font-semibold text-ink-muted tabular-nums">{t.at} pts</span>
              </li>
            );
          })}
        </ol>

        {/* How you earn */}
        <div className="mt-6 flex gap-3 rounded-card border border-unseen bg-surface p-4 shadow-sm">
          <TrendingUp className="h-5 w-5 shrink-0 text-[var(--action)]" aria-hidden="true" />
          <p className="text-[13px] leading-relaxed text-ink">
            <span className="font-bold">How you earn.</span> Each check earns{' '}
            <span className="font-semibold">River Value</span> — more for a site that badly needed a look,
            scaled by the quality of your evidence. Revisiting the same spot the same day earns little, so
            the score rewards <span className="font-semibold">usefulness, not grinding</span>.
          </p>
        </div>
      </div>
    </main>
  );
}
