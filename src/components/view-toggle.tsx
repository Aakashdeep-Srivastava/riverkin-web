import { Map as MapIcon, List } from 'lucide-react';
import { cn } from '@/lib/utils';

export type HomeView = 'map' | 'list';

/** Segmented Map / List toggle (C1). Controlled. */
export function ViewToggle({
  value,
  onChange,
}: {
  value: HomeView;
  onChange: (v: HomeView) => void;
}) {
  const items: { value: HomeView; label: string; Icon: typeof MapIcon }[] = [
    { value: 'map', label: 'Map', Icon: MapIcon },
    { value: 'list', label: 'List', Icon: List },
  ];
  return (
    <div className="rk-glass inline-flex rounded-full p-1" role="tablist" aria-label="View">
      {items.map(({ value: v, label, Icon }) => {
        const active = v === value;
        return (
          <button
            key={v}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(v)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors',
              active ? 'bg-[var(--action)] text-white' : 'text-ink-muted hover:text-ink',
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
