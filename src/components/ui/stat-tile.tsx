import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * A single hero-number tile (days since check, rain mm, gap level). Numbers are
 * tabular and large per the design system; the unit/label sits beneath.
 */
export function StatTile({
  value,
  unit,
  label,
  Icon,
  accent,
  className,
}: {
  value: string | number;
  unit?: string;
  label: string;
  Icon?: LucideIcon;
  /** CSS colour token for the value + icon. Defaults to ink. */
  accent?: string;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-1 rounded-card border border-unseen bg-surface p-4', className)}>
      {Icon ? (
        <Icon className="h-4 w-4" aria-hidden="true" style={{ color: accent ?? 'var(--ink-muted)' }} />
      ) : null}
      <p className="flex items-baseline gap-1 leading-none">
        <span
          className="text-[clamp(1.75rem,8vw,2.5rem)] font-bold tracking-tight"
          style={{ color: accent ?? 'var(--ink)' }}
        >
          {value}
        </span>
        {unit ? <span className="text-sm font-semibold text-ink-muted">{unit}</span> : null}
      </p>
      <p className="text-[12px] font-semibold uppercase leading-tight tracking-wide text-ink-muted">
        {label}
      </p>
    </div>
  );
}
