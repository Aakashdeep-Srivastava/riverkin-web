/**
 * Identity progression — Observer → Explorer → River Keeper.
 *
 * Identity, NOT points. RiverKin never shows XP or a per-person leaderboard
 * (design-psychology model + API hard rule). A keeper's standing is simply how
 * many stream checks they've contributed — a role they grow into. Goal-gradient
 * framing ("2 checks to Explorer") motivates the next step honestly.
 */

export interface Tier {
  key: 'observer' | 'explorer' | 'river-keeper';
  name: string;
  /** Checks required to reach this tier. */
  at: number;
  blurb: string;
}

export const TIERS: Tier[] = [
  { key: 'observer', name: 'Observer', at: 0, blurb: 'Watching the river, learning its signs.' },
  { key: 'explorer', name: 'Explorer', at: 3, blurb: 'Out in the field, building the record.' },
  { key: 'river-keeper', name: 'River Keeper', at: 10, blurb: 'A steward your streams rely on.' },
];

export interface IdentityProgress {
  tier: Tier;
  next: Tier | null;
  checks: number;
  /** 0–1 progress from the current tier toward the next. */
  fraction: number;
  toNext: number;
}

export function identityFor(checks: number): IdentityProgress {
  let tier = TIERS[0];
  for (const t of TIERS) if (checks >= t.at) tier = t;
  const idx = TIERS.indexOf(tier);
  const next = idx < TIERS.length - 1 ? TIERS[idx + 1] : null;
  if (!next) return { tier, next: null, checks, fraction: 1, toNext: 0 };
  const span = next.at - tier.at;
  const done = checks - tier.at;
  return {
    tier,
    next,
    checks,
    fraction: span > 0 ? Math.min(1, done / span) : 1,
    toNext: Math.max(0, next.at - checks),
  };
}
