import Link from 'next/link';
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Trend = 'up' | 'down' | 'flat';

const TREND_ICON: Record<Trend, LucideIcon> = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
};

/**
 * A compact KPI tile: the number large on the left with a small accent-coloured
 * icon top-right, the label beneath, and a trend glyph + short detail at the
 * foot. When `href` is set the whole tile is a link to that metric's underlying
 * data (e.g. the site timeline) with a hover/press affordance.
 */
export function StatTile({
  value,
  unit,
  label,
  Icon,
  accent,
  href,
  trend,
  trendLabel,
  className,
}: {
  value: string | number;
  unit?: string;
  label: string;
  Icon?: LucideIcon;
  /** CSS colour token for the number + icon. Defaults to ink / muted. */
  accent?: string;
  /** Makes the tile a link to the metric's data/reference. */
  href?: string;
  /** Trend direction glyph shown at the foot. */
  trend?: Trend;
  /** Short detail next to the trend glyph (e.g. "Open-Meteo", "vs usual"). */
  trendLabel?: string;
  className?: string;
}) {
  const TrendIcon = trend ? TREND_ICON[trend] : null;
  const trendColor =
    trend === 'up' ? 'var(--urgent)' : trend === 'down' ? 'var(--success)' : 'var(--ink-muted)';

  const body = (
    <>
      <div className="flex items-start justify-between gap-1">
        <p className="flex items-baseline gap-0.5 leading-none">
          <span
            className="text-[clamp(1.35rem,6vw,1.7rem)] font-bold tracking-tight tabular-nums"
            style={{ color: accent ?? 'var(--ink)' }}
          >
            {value}
          </span>
          {unit ? <span className="text-[11px] font-semibold text-ink-muted">{unit}</span> : null}
        </p>
        {Icon ? (
          <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" style={{ color: accent ?? 'var(--ink-muted)' }} />
        ) : null}
      </div>

      <p className="mt-1.5 text-[10.5px] font-semibold uppercase leading-tight tracking-wide text-ink-muted">
        {label}
      </p>

      <div className="mt-1.5 flex items-center gap-1 text-[10.5px] text-ink-muted">
        {TrendIcon ? (
          <TrendIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" style={{ color: trendColor }} />
        ) : null}
        {trendLabel ? <span className="truncate">{trendLabel}</span> : null}
        {href ? (
          <ArrowUpRight
            className="ml-auto h-3.5 w-3.5 shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        ) : null}
      </div>
    </>
  );

  const base = 'flex flex-col rounded-card border border-unseen bg-surface p-3';

  if (href) {
    return (
      <Link
        href={href}
        aria-label={`${label}: ${value}${unit ? ' ' + unit : ''} — view data`}
        className={cn(base, 'group transition-colors hover:border-[var(--action)] active:scale-[0.98]', className)}
      >
        {body}
      </Link>
    );
  }

  return <div className={cn(base, className)}>{body}</div>;
}
