import Link from 'next/link';
import { ChevronRight, MapPin } from 'lucide-react';
import { ScreenHeader } from '@/components/screen-header';
import { AttentionStatus } from '@/components/attention-status';
import { SimulatedBadge } from '@/components/simulated-badge';
import { SiteFooter } from '@/components/site-footer';
import { mockMissions } from '@/lib/mock-data';

/** Missions list — entry point into the C2/C3 mission flow. */
export default function MissionsPage() {
  return (
    <main className="mx-auto max-w-2xl">
      <ScreenHeader
        title="Missions"
        subtitle="Short, concrete checks that close a monitoring gap."
        aiStatus={`${mockMissions.length} suggested`}
      >
        <SimulatedBadge />
      </ScreenHeader>

      <section className="px-4 pt-4">
        {mockMissions.length === 0 ? (
          <p className="rounded-card border border-unseen bg-surface p-6 text-center text-sm text-ink-muted">
            No missions right now. Everything nearby was seen recently.
          </p>
        ) : (
          <ul className="space-y-2">
            {mockMissions.map((mission) => (
              <li key={mission.id}>
                <Link
                  href={`/missions/${mission.id}`}
                  className="flex min-h-tap items-center justify-between gap-3 rounded-card border border-unseen bg-surface p-4 hover:border-water"
                >
                  <div>
                    <p className="font-semibold text-ink">{mission.title}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-sm text-ink-muted">
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                      {mission.siteName} · {mission.distanceKm} km away
                    </p>
                    <AttentionStatus level={mission.attention} className="mt-1.5" />
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-ink-muted" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
