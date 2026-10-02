import Link from 'next/link';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { AttentionStatus } from '@/components/attention-status';
import { LEVEL_VAR } from '@/lib/attention';
import type { Site } from '@/lib/api-types';

/** Proportion of the attention meter to fill (0–1). */
function meterPct(daysUnseen: number, maxDays: number): number {
  if (maxDays <= 0 || daysUnseen <= 0) return 0;
  return Math.max(daysUnseen / maxDays, 0.06);
}

/** "19 days unseen" / "Seen today", split so the number can be tabular + large. */
function UnseenReadout({
  daysUnseen,
  size,
}: {
  daysUnseen: number;
  size: 'hero' | 'compact';
}) {
  const seenToday = daysUnseen === 0;
  const numberClass =
    size === 'hero'
      ? 'text-[clamp(2.75rem,12vw,3.75rem)]'
      : 'text-[1.75rem]';

  if (seenToday) {
    return (
      <p className={`${size === 'hero' ? 'text-2xl' : 'text-base'} font-semibold leading-none text-success`}>
        Seen today
      </p>
    );
  }

  return (
    <p className="flex items-baseline justify-end gap-1.5 leading-none">
      <span className={`${numberClass} font-bold tracking-tight text-ink`}>{daysUnseen}</span>
      <span className="max-w-[3.5rem] text-left text-[11px] font-semibold uppercase leading-tight tracking-wide text-ink-muted">
        {daysUnseen === 1 ? 'day unseen' : 'days unseen'}
      </span>
    </p>
  );
}

/** Decorative proportional meter. Hidden from assistive tech — the status chip
 * and the "days unseen" readout carry the same information in text. */
function AttentionMeter({
  site,
  maxDays,
  delayMs,
}: {
  site: Site;
  maxDays: number;
  delayMs: number;
}) {
  const pct = meterPct(site.daysUnseen, maxDays);
  return (
    <div
      aria-hidden="true"
      className="h-1.5 w-full overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--unseen)_55%,transparent)]"
    >
      <div
        className="rk-meter-fill h-full rounded-full"
        style={{
          width: `${Math.round(pct * 100)}%`,
          background: LEVEL_VAR[site.attention],
          animationDelay: `${delayMs}ms`,
        }}
      />
    </div>
  );
}

export function SiteCard({
  site,
  maxDays,
  index = 0,
  featured = false,
}: {
  site: Site;
  maxDays: number;
  index?: number;
  featured?: boolean;
}) {
  const delayMs = 120 + index * 70;
  const rail = LEVEL_VAR[site.attention];

  if (featured) {
    return (
      <Link
        href={`/status/${site.id}`}
        style={{ animationDelay: `${delayMs}ms` }}
        className="rk-reveal rk-card rk-card-link group relative block overflow-hidden rounded-card border border-unseen bg-surface"
      >
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5" style={{ background: rail }} />
        <div className="flex flex-col gap-4 p-5 pl-6 sm:p-6 sm:pl-7">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
              Top priority
            </span>
            <AttentionStatus level={site.attention} />
          </div>

          <div className="flex items-end justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold leading-tight text-ink sm:text-3xl">{site.name}</h3>
              <p className="mt-1 text-sm text-ink-muted">{site.waterbody}</p>
            </div>
            <div className="shrink-0 text-right">
              <UnseenReadout daysUnseen={site.daysUnseen} size="hero" />
            </div>
          </div>

          <AttentionMeter site={site} maxDays={maxDays} delayMs={delayMs + 120} />

          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-water">
            Open mission brief
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/status/${site.id}`}
      style={{ animationDelay: `${delayMs}ms` }}
      className="rk-reveal rk-card rk-card-link group relative flex items-stretch gap-4 overflow-hidden rounded-card border border-unseen bg-surface p-4 pl-5"
    >
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5" style={{ background: rail }} />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink">{site.name}</p>
          <p className="truncate text-sm text-ink-muted">{site.waterbody}</p>
        </div>
        <AttentionStatus level={site.attention} />
        <AttentionMeter site={site} maxDays={maxDays} delayMs={delayMs + 120} />
      </div>

      <div className="flex shrink-0 flex-col items-end justify-center gap-0.5 text-right">
        <UnseenReadout daysUnseen={site.daysUnseen} size="compact" />
        <ChevronRight
          className="mt-1 h-5 w-5 text-ink-muted transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
