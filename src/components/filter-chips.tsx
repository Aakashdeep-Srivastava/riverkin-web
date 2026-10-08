import { Layers, Droplet, Sprout, AlertTriangle, Compass, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SiteFilter = 'all' | 'freshwater' | 'biodiversity' | 'pollution' | 'unresolved';

// Each filter carries its own brand colour so the categories read as distinct
// at a glance (colour + icon + label — WCAG, never colour alone). Reuses the
// design tokens: water=freshwater, success=biodiversity, attention=pollution,
// urgent=unresolved flags (per the design system), action=all.
export const SITE_FILTERS: { value: SiteFilter; label: string; Icon: LucideIcon; color: string }[] = [
  { value: 'all', label: 'All', Icon: Layers, color: 'var(--action)' },
  { value: 'freshwater', label: 'Freshwater', Icon: Droplet, color: 'var(--water)' },
  { value: 'biodiversity', label: 'Biodiversity', Icon: Sprout, color: 'var(--success)' },
  { value: 'pollution', label: 'Pollution', Icon: AlertTriangle, color: 'var(--attention)' },
  { value: 'unresolved', label: 'Unresolved', Icon: Compass, color: 'var(--urgent)' },
];

/** Horizontally scrollable filter chips (pill radius). Controlled. */
export function FilterChips({
  value,
  onChange,
}: {
  value: SiteFilter;
  onChange: (v: SiteFilter) => void;
}) {
  return (
    <div role="tablist" aria-label="Filter sites" className="rk-no-scrollbar flex gap-2 overflow-x-auto pb-1">
      {SITE_FILTERS.map(({ value: v, label, Icon, color }) => {
        const active = v === value;
        return (
          <button
            key={v}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(v)}
            style={
              active
                ? { backgroundColor: color, borderColor: color }
                : { borderColor: `color-mix(in srgb, ${color} 40%, transparent)` }
            }
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-[color,background-color,border-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]',
              active ? 'text-white' : 'rk-glass text-ink',
            )}
          >
            {/* Icon keeps the category colour even when the chip is inactive. */}
            <Icon className="h-4 w-4" aria-hidden="true" style={{ color: active ? '#fff' : color }} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
