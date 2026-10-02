import { cn } from '@/lib/utils';

/**
 * RiverKin wave mark — two stacked river currents. Uses the --water token so it
 * sits on-brand in light and dark. Decorative when paired with the wordmark.
 */
export function RiverMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 24"
      fill="none"
      aria-hidden="true"
      className={cn('h-6 w-8', className)}
    >
      <path
        d="M2 8c4-4 7-4 10 0s6 4 10 0 7-4 8-3"
        stroke="var(--water)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 16c4-4 7-4 10 0s6 4 10 0 7-4 8-3"
        stroke="var(--action)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
    </svg>
  );
}

/** Wave mark + wordmark lockup. */
export function RiverKinLogo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <RiverMark />
      <span className="text-lg font-bold tracking-tight text-ink">RiverKin</span>
    </span>
  );
}
