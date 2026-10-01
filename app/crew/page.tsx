import { ScreenHeader } from '@/components/screen-header';
import { SimulatedBadge } from '@/components/simulated-badge';
import { SiteFooter } from '@/components/site-footer';

/**
 * L1 — Crew (later layer; stub for now).
 * TODO(PRD): crew view and crew-lead setup (L1/L2). Demo persona is an adult
 * Keeper ("Kari"); school crew mode is a later layer.
 */
export default function CrewPage() {
  return (
    <main className="mx-auto max-w-2xl">
      <ScreenHeader title="Crew" subtitle="People keeping these rivers with you.">
        <SimulatedBadge />
      </ScreenHeader>
      <section className="px-4 pt-4">
        <p className="rounded-card border border-unseen bg-surface p-6 text-center text-sm text-ink-muted">
          Crew comes after the core loop. For the demo, you&apos;re keeping on your own as Kari.
        </p>
      </section>
      <SiteFooter />
    </main>
  );
}
