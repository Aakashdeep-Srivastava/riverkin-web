import { cn } from '@/lib/utils';

export type SiteFilter = 'all' | 'fresh' | 'attention' | 'unresolved';

export const SITE_FILTERS: { value: SiteFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'fresh', label: 'Fresh' },
  { value: 'attention', label: 'Attention' },
  { value: 'unresolved', label: 'Unresolved' },
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
      {SITE_FILTERS.map((f) => {
        const active = f.value === value;
        return (
          <button
            key={f.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(f.value)}
            className={cn(
              'shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-[color,background-color,border-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]',
              active
                ? 'border-[var(--action)] bg-[var(--action)] text-white'
                : 'rk-glass text-ink hover:border-[var(--action)]',
            )}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
