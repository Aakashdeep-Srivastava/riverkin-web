import Link from 'next/link';
import { ScreenHeader } from '@/components/screen-header';
import { SimulatedBadge } from '@/components/simulated-badge';
import { SiteFooter } from '@/components/site-footer';

/**
 * "Me" — profile stub. No points, XP, badges or leaderboards (hard rule).
 * TODO(PRD): what "Me" actually shows — recent checks, verified contributions,
 * settings. Keep it contribution-focused, never gamified.
 */
export default function MePage() {
  return (
    <main className="mx-auto max-w-2xl">
      <ScreenHeader title="Kari" subtitle="River keeper">
        <SimulatedBadge />
      </ScreenHeader>
      <section className="px-4 pt-4">
        <div className="rounded-card border border-unseen bg-surface p-5">
          <p className="text-sm text-ink-muted">
            Your recent checks and verified contributions appear here. No scores, no badges — just the
            gaps you helped close.
          </p>
          <Link
            href="/researcher"
            className="mt-4 inline-flex min-h-tap items-center text-sm font-semibold text-water hover:underline"
          >
            Open researcher view
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
