import { FlaskConical } from 'lucide-react';

/**
 * Visible marker required by the hard rules: anything simulated must say so.
 */
export function SimulatedBadge({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-unseen bg-surface px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-ink-muted ${className ?? ''}`}
    >
      <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
      Simulated, illustrative
    </span>
  );
}
