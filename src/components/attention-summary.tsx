import { AlertTriangle, Clock, Waves } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * Mission-control summary ledger for the C1 screen. Three plain situational
 * stats — no points, XP or scores (design system). Numbers are tabular so the
 * columns line up. The "needs a look" count carries the attention accent only
 * when it is non-zero; it is always paired with an icon + label, never colour
 * alone.
 */
interface Stat {
  value: number;
  label: string;
  Icon: LucideIcon;
  /** Accent token when the value is "live" (non-zero). */
  accent?: string;
}

export function AttentionSummary({
  urgentCount,
  daysOwed,
  siteCount,
}: {
  urgentCount: number;
  daysOwed: number;
  siteCount: number;
}) {
  const stats: Stat[] = [
    {
      value: urgentCount,
      label: urgentCount === 1 ? 'Needs a look' : 'Need a look',
      Icon: AlertTriangle,
      accent: urgentCount > 0 ? 'var(--urgent)' : undefined,
    },
    { value: daysOwed, label: 'Days of attention owed', Icon: Clock },
    { value: siteCount, label: 'Sites watched', Icon: Waves },
  ];

  return (
    <dl className="rk-card grid grid-cols-3 overflow-hidden rounded-card border border-unseen bg-surface">
      {stats.map((stat, i) => {
        const color = stat.accent ?? 'var(--ink)';
        return (
          <div
            key={stat.label}
            className={`flex flex-col gap-1 px-3 py-4 sm:px-5 ${
              i > 0 ? 'border-l border-unseen' : ''
            }`}
          >
            <stat.Icon
              className="h-4 w-4"
              aria-hidden="true"
              style={{ color: stat.accent ?? 'var(--ink-muted)' }}
            />
            <dd
              className="text-[clamp(1.9rem,8vw,2.75rem)] font-bold leading-none tracking-tight"
              style={{ color }}
            >
              {stat.value}
            </dd>
            <dt className="text-[11px] font-semibold uppercase leading-tight tracking-wide text-ink-muted sm:text-[13px]">
              {stat.label}
            </dt>
          </div>
        );
      })}
    </dl>
  );
}
