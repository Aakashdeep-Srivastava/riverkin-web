import { Check, type LucideIcon } from 'lucide-react';
import type { AnswerTone } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

/**
 * A single answer choice — icon + text, large tap target, selectable. Status
 * uses the design tokens; the selected state is shown by border + tint + a
 * check, never colour alone (every answer has a text label). One question per
 * screen (PRD C4/C5).
 */
const TONE_DOT: Record<AnswerTone, string> = {
  ok: 'var(--success)',
  warn: 'var(--attention)',
  bad: 'var(--urgent)',
  neutral: 'var(--ink-muted)',
};

export function OptionButton({
  label,
  selected = false,
  tone,
  Icon,
  onClick,
  className,
}: {
  label: string;
  selected?: boolean;
  tone?: AnswerTone;
  Icon?: LucideIcon;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'flex min-h-tap w-full items-center gap-3 rounded-button border bg-surface px-4 py-3.5 text-left text-[15px] font-medium transition-colors',
        selected
          ? 'border-[var(--action)] bg-[var(--action-tint)] text-ink'
          : 'border-unseen text-ink hover:border-[var(--action)]',
        className,
      )}
    >
      {tone ? (
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ background: TONE_DOT[tone] }}
        />
      ) : Icon ? (
        <Icon className="h-5 w-5 shrink-0 text-ink-muted" aria-hidden="true" />
      ) : null}
      <span className="flex-1">{label}</span>
      <span
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors',
          selected ? 'border-[var(--action)] bg-[var(--action)] text-white' : 'border-unseen',
        )}
      >
        {selected ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : null}
      </span>
    </button>
  );
}
