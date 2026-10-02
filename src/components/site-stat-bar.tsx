import { Waves, EyeOff, AlertTriangle, CheckCircle2 } from 'lucide-react';

/**
 * Floating glass stat bar for C1: Sites · Attention · Flags · Recent. Counts are
 * derived from the visible site set. Numbers are tabular.
 */
export function SiteStatBar({
  sites,
  attention,
  flags,
  recent,
}: {
  sites: number;
  attention: number;
  flags: number;
  recent: number;
}) {
  const items = [
    { value: sites, label: 'Sites', Icon: Waves, color: 'var(--water)' },
    { value: attention, label: 'Attention', Icon: EyeOff, color: 'var(--attention)' },
    { value: flags, label: 'Flags', Icon: AlertTriangle, color: 'var(--urgent)' },
    { value: recent, label: 'Recent', Icon: CheckCircle2, color: 'var(--success)' },
  ];
  return (
    <dl className="rk-glass grid grid-cols-4 gap-1 rounded-card px-2 py-2.5 shadow-[var(--rk-shadow)]">
      {items.map(({ value, label, Icon, color }) => (
        <div key={label} className="flex flex-col items-center gap-0.5 text-center">
          <Icon className="h-4 w-4" aria-hidden="true" style={{ color }} />
          <dd className="text-lg font-bold leading-none tabular-nums text-ink">{value}</dd>
          <dt className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">{label}</dt>
        </div>
      ))}
    </dl>
  );
}
