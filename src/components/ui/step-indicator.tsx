import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * 3-step progress header (Observe → Photograph → Verify). The current step is
 * filled with the action colour; completed steps show a check. Connector lines
 * fill as you advance.
 */
export function StepIndicator({
  steps,
  current,
}: {
  steps: string[];
  /** 0-based index of the active step. */
  current: number;
}) {
  return (
    <ol className="flex items-center" aria-label="Progress">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className={cn('flex items-center', i < steps.length - 1 && 'flex-1')}>
            <div className="flex flex-col items-center gap-1">
              <span
                aria-current={active ? 'step' : undefined}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold tabular-nums transition-colors',
                  done && 'bg-[var(--action)] text-white',
                  active && 'bg-[var(--action)] text-white ring-4 ring-[var(--action-tint)]',
                  !done && !active && 'border border-unseen text-ink-muted',
                )}
              >
                {done ? <Check className="h-4 w-4" aria-hidden="true" /> : i + 1}
              </span>
              <span
                className={cn(
                  'text-[11px] font-semibold uppercase tracking-wide',
                  active || done ? 'text-ink' : 'text-ink-muted',
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 ? (
              <span className="mx-1 mb-5 h-0.5 flex-1 rounded-full bg-unseen">
                <span
                  className="block h-full rounded-full bg-[var(--action)] transition-all"
                  style={{ width: done ? '100%' : '0%' }}
                />
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
