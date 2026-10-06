import { Map as MapIcon, List } from 'lucide-react';
import { cn } from '@/lib/utils';

export type HomeView = 'map' | 'list';

/**
 * Map / List toggle (C1). Controlled. Horizontal segmented by default; the
 * `vertical` variant is a small icon-only stacked pill for floating on the map.
 */
export function ViewToggle({
  value,
  onChange,
  orientation = 'horizontal',
}: {
  value: HomeView;
  onChange: (v: HomeView) => void;
  orientation?: 'horizontal' | 'vertical';
}) {
  const vertical = orientation === 'vertical';
  const items: { value: HomeView; label: string; Icon: typeof MapIcon }[] = [
    { value: 'map', label: 'Map', Icon: MapIcon },
    { value: 'list', label: 'List', Icon: List },
  ];
  return (
    <div
      className={cn('rk-glass p-1 shadow-[var(--rk-shadow)]', vertical ? 'inline-flex flex-col rounded-2xl' : 'inline-flex rounded-full')}
      role="tablist"
      aria-label="View"
    >
      {items.map(({ value: v, label, Icon }) => {
        const active = v === value;
        return (
          <button
            key={v}
            role="tab"
            aria-selected={active}
            aria-label={vertical ? `${label} view` : undefined}
            onClick={() => onChange(v)}
            className={cn(
              'inline-flex items-center justify-center font-semibold transition-colors',
              vertical ? 'h-10 w-10 rounded-xl' : 'gap-1.5 rounded-full px-4 py-1.5 text-sm',
              active ? 'bg-[var(--action)] text-white' : 'text-ink-muted hover:text-ink',
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {vertical ? <span className="sr-only">{label}</span> : label}
          </button>
        );
      })}
    </div>
  );
}
