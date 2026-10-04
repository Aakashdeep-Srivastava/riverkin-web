import Link from 'next/link';
import { CloudRain, EyeOff, TrendingUp, ArrowRight, type LucideIcon } from 'lucide-react';
import type { Challenge } from '@/lib/community-api';

const KIND_META: Record<Challenge['kind'], { Icon: LucideIcon; accent: string }> = {
  'after-rain': { Icon: CloudRain, accent: 'var(--water)' },
  orphan: { Icon: EyeOff, accent: 'var(--attention)' },
  coverage: { Icon: TrendingUp, accent: 'var(--action)' },
};

/**
 * This-period field challenges. Each target is a real count of sites in that
 * state right now (no fake urgency) — tapping routes to the missions that
 * advance it. Collective goals, not personal streak guilt.
 */
export function ChallengeList({ challenges }: { challenges: Challenge[] }) {
  if (challenges.length === 0) return null;
  return (
    <ul className="space-y-3">
      {challenges.map((c) => {
        const meta = KIND_META[c.kind] ?? KIND_META.coverage;
        const Icon = meta.Icon;
        return (
          <li key={c.id}>
            <Link
              href={c.city ? `/missions?city=${encodeURIComponent(c.city)}` : '/missions'}
              className="rk-card rk-card-link flex items-center gap-3 rounded-card border border-unseen bg-surface p-4"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                style={{ background: 'color-mix(in srgb, ' + meta.accent + ' 14%, transparent)', color: meta.accent }}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">{c.title}</p>
                <p className="text-sm text-ink-muted">{c.detail}</p>
              </div>
              <span className="shrink-0 text-right">
                <span className="block text-lg font-bold tabular-nums text-ink">{c.target}</span>
                <ArrowRight className="ml-auto h-4 w-4 text-[var(--action)]" aria-hidden="true" />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
