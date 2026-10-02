import type { AttentionLevel } from './api-types';

/**
 * Raw design-token references per attention level, for surfaces that need the
 * colour as a CSS value (accent rails, meters, dots) rather than a Tailwind
 * text class. The human-readable label + icon live in `attentionMeta`
 * (see components/attention-status) so status is always colour + icon + label,
 * never colour alone (WCAG 2.2 AA, per the design system).
 */
export const LEVEL_VAR: Record<AttentionLevel, string> = {
  urgent: 'var(--urgent)',
  attention: 'var(--attention)',
  monitoring: 'var(--water)',
  ok: 'var(--success)',
};

/** Sort priority: most-urgent first. */
export const LEVEL_RANK: Record<AttentionLevel, number> = {
  urgent: 0,
  attention: 1,
  monitoring: 2,
  ok: 3,
};
