import { Layers, Droplet, Sprout, AlertTriangle, Compass, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SiteFilter = 'all' | 'freshwater' | 'biodiversity' | 'pollution' | 'unresolved';

export const SITE_FILTERS: { value: SiteFilter; label: string; Icon: LucideIcon }[] = [
  { value: 'all', label: 'All', Icon: Layers },
  { value: 'freshwater', label: 'Freshwater', Icon: Droplet },
  { value: 'biodiversity', label: 'Biodiversity', Icon: Sprout },
  { value: 'pollution', label: 'Pollution', Icon: AlertTriangle },
  { value: 'unresolved', label: 'Unresolved', Icon: Compass },
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
    <div role="tablist" aria-label="Filter sites" className="flex gap-2 overflow-x-auto pb-1">
      {SITE_FILTERS.map(({ value: v, label, Icon }) => {
        const active = v === value;
        return (
          <button
            key={v}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(v)}
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-[color,background-color,border-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]',
              active
                ? 'border-[var(--action)] bg-[var(--action)] text-white'
                : 'rk-glass text-ink hover:border-[var(--action)]',
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
