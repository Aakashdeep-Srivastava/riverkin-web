import { attentionMeta } from '@/components/attention-status';
import { LEVEL_VAR } from '@/lib/attention';
import type { AttentionLevel } from '@/lib/api-types';

const ORDER: AttentionLevel[] = ['urgent', 'attention', 'monitoring', 'ok'];

/**
 * Legend for the attention map. Each entry is a coloured dot + its icon + its
 * label, so the meaning never rests on colour alone (WCAG 2.2 AA).
 */
export function MapLegend() {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {ORDER.map((level) => {
        const { label, Icon } = attentionMeta[level];
        return (
          <li key={level} className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full ring-1 ring-inset ring-black/5"
              style={{ background: LEVEL_VAR[level] }}
            />
            <Icon className="h-3.5 w-3.5 text-ink-muted" aria-hidden="true" />
            <span className="text-[12px] font-medium text-ink-muted">{label}</span>
          </li>
        );
      })}
    </ul>
  );
}
