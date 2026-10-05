/**
 * Neutral loading skeleton for data-backed routes. Used by each route's
 * `loading.tsx` so a navigation paints an instant placeholder while the server
 * component awaits its data, instead of blocking on a blank screen.
 */
export function PageSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <main className="mx-auto min-h-dvh max-w-2xl px-4 pb-28 pt-6" aria-busy="true" aria-label="Loading">
      <div className="h-7 w-40 animate-pulse rounded-lg bg-[color-mix(in_srgb,var(--ink)_10%,var(--surface))]" />
      <div className="mt-2.5 h-4 w-56 animate-pulse rounded bg-[color-mix(in_srgb,var(--ink)_7%,var(--surface))]" />
      <div className="mt-6 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-card border border-unseen bg-surface"
          />
        ))}
      </div>
    </main>
  );
}
