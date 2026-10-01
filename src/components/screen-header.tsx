import { Radar } from 'lucide-react';
import type { ReactNode } from 'react';

/**
 * Lightweight screen header. The AI identity is a small radar glyph + status
 * text only — no chatbot avatar or mascot (per the design system).
 */
export function ScreenHeader({
  title,
  subtitle,
  aiStatus,
  children,
}: {
  title: string;
  subtitle?: string;
  aiStatus?: string;
  children?: ReactNode;
}) {
  return (
    <header className="px-4 pt-6">
      {aiStatus ? (
        <p className="mb-2 inline-flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-wide text-ink-muted">
          <Radar className="h-4 w-4 text-water" aria-hidden="true" />
          {aiStatus}
        </p>
      ) : null}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-ink-muted">{subtitle}</p> : null}
        </div>
        {children}
      </div>
    </header>
  );
}
