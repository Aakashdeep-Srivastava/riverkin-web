'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Sprout, Star, Flag, Flame, Binoculars, ChevronRight } from 'lucide-react';
import { fetchScore } from '@/lib/auth-api';
import { fetchMissions, type MissionListItem } from '@/lib/missions-api';
import { identityFor } from '@/lib/identity';
import { touchStreak } from '@/lib/streak';
import type { AttentionLevel } from '@/lib/api-types';

/** Illustrative reward weight by urgency (River Value → shown as XP). */
const XP_BY_LEVEL: Record<AttentionLevel, number> = {
  urgent: 200,
  attention: 160,
  monitoring: 130,
  ok: 110,
};

function StatCell({
  Icon,
  tint,
  value,
  label,
}: {
  Icon: typeof Sprout;
  tint: string;
  value: number | string;
  label: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-0.5 px-1 text-center">
      <Icon className="h-5 w-5" style={{ color: tint }} aria-hidden="true" />
      <span className="text-[19px] font-extrabold leading-none text-ink tabular-nums">{value}</span>
      <span className="text-[11px] font-medium text-ink-muted">{label}</span>
    </div>
  );
}

/** Circular progress ring with a leaf at its centre (identity goal-gradient). */
function LevelRing({ fraction, level }: { fraction: number; level: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="var(--unseen)" strokeWidth="5" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="url(#rk-ring)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.max(0.04, fraction))}
        />
        <defs>
          <linearGradient id="rk-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1E7BFF" />
            <stop offset="1" stopColor="#2FA36B" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center">
        <Sprout className="h-6 w-6 text-[#2FA36B]" aria-hidden="true" />
      </span>
      <span className="sr-only">Level {level}</span>
    </div>
  );
}

/**
 * Home overview — the gamified KPI card (identity level + live site/mission/flag
 * counts + a device day-streak) and the top Active Mission. Numbers are live:
 * Sites/Missions/Flags from the API, the level from the account River Score,
 * the streak from on-device visits. Sits under the priority card on C1.
 */
export function HomeOverview({ sites, flags }: { sites: number; flags: number }) {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setStreak(touchStreak());
  }, []);

  const { data: missions } = useQuery({
    queryKey: ['missions'],
    queryFn: () => fetchMissions(),
    staleTime: 60_000,
    retry: 1,
  });
  const { data: score } = useQuery({
    queryKey: ['score'],
    queryFn: fetchScore,
    staleTime: 60_000,
    retry: 0,
  });

  const points = score?.score ?? 0;
  const identity = identityFor(points);
  const level = Math.max(1, Math.floor(points / 15) + 1);
  const missionCount = missions?.length ?? 0;
  const lead: MissionListItem | undefined = missions?.[0];
  const xp = lead ? XP_BY_LEVEL[lead.attention] : 0;

  return (
    <div className="space-y-3">
      {/* KPI card */}
      <div className="rk-glass rk-reveal rounded-card p-3.5 shadow-[var(--rk-shadow-lift)]">
        <div className="flex items-center gap-3">
          <LevelRing fraction={identity.fraction} level={level} />
          <div className="min-w-0">
            <p className="text-[17px] font-extrabold leading-tight text-ink">Level {level}</p>
            <p className="text-[12px] font-medium text-ink-muted">{identity.tier.name}</p>
          </div>
          <div className="ml-1 flex flex-1 items-center">
            <StatCell Icon={Sprout} tint="#2FA36B" value={sites} label="Sites" />
            <span className="h-8 w-px bg-unseen" />
            <StatCell Icon={Star} tint="#F2A93B" value={missionCount} label="Missions" />
            <span className="h-8 w-px bg-unseen" />
            <StatCell Icon={Flag} tint="#1E7BFF" value={flags} label="Flags" />
            <span className="h-8 w-px bg-unseen" />
            <StatCell Icon={Flame} tint="#E5724D" value={streak} label="Day Streak" />
          </div>
        </div>
      </div>

      {/* Active mission */}
      {lead ? (
        <div className="rk-reveal">
          <div className="mb-1.5 flex items-center justify-between px-0.5">
            <p className="text-[13px] font-bold text-ink">Active Mission</p>
            <Link href="/missions" className="flex items-center gap-0.5 text-[13px] font-semibold text-[var(--action)]">
              See all <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <Link
            href={`/missions/${lead.id}`}
            className="rk-glass flex items-center gap-3 rounded-card p-3 shadow-[var(--rk-shadow-lift)]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--action)]/12">
              <Binoculars className="h-5 w-5 text-[var(--action)]" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-bold text-ink">{lead.title}</p>
              <p className="truncate text-[12px] text-ink-muted">{lead.summary}</p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#F2A93B]/15 px-2.5 py-1 text-[12px] font-bold text-[#B9791B]">
              <Star className="h-3.5 w-3.5 fill-[#F2A93B] text-[#F2A93B]" aria-hidden="true" />+{xp} XP
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-ink-muted" aria-hidden="true" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}
