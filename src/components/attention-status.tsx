import { AlertTriangle, Eye, EyeOff, CheckCircle2, type LucideIcon } from 'lucide-react';
import type { AttentionLevel } from '@/lib/api-types';

/**
 * Status is conveyed by colour + icon + label together — never colour alone
 * (WCAG 2.2 AA, per the design system).
 */
interface StatusMeta {
  label: string;
  Icon: LucideIcon;
  /** Tailwind text colour class mapped to a design token. */
  color: string;
}

const META: Record<AttentionLevel, StatusMeta> = {
  urgent: { label: 'Needs a look', Icon: AlertTriangle, color: 'text-urgent' },
  attention: { label: 'Attention', Icon: EyeOff, color: 'text-attention' },
  monitoring: { label: 'Monitoring', Icon: Eye, color: 'text-water' },
  ok: { label: 'Recently seen', Icon: CheckCircle2, color: 'text-success' },
};

export function AttentionStatus({
  level,
  className,
}: {
  level: AttentionLevel;
  className?: string;
}) {
  const { label, Icon, color } = META[level];
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${color} ${className ?? ''}`}>
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </span>
  );
}

export { META as attentionMeta };
