import { cn } from '@/lib/utils';

/**
 * RiverKin emblem — the brand mark (royal-blue river through maroon terrain with
 * a golden sun). The art is a crisp PNG so it stays recognizable at any size.
 * A plain <img> keeps it dependency-free in the standalone build.
 */
export function RiverMark({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt=""
      aria-hidden="true"
      className={cn('h-7 w-7 object-contain', className)}
    />
  );
}

/** Emblem + wordmark lockup. */
export function RiverKinLogo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <RiverMark />
      <span className="text-lg font-bold tracking-tight text-ink">RiverKin</span>
    </span>
  );
}
