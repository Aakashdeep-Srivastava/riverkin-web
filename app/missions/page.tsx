import Link from 'next/link';
import { Eye, ChevronRight, Clock, ArrowRight } from 'lucide-react';
import { AppBar } from '@/components/app-bar';
import { AttentionStatus } from '@/components/attention-status';
import { SiteFooter } from '@/components/site-footer';
import { mockMissionBriefs, getMockSite } from '@/lib/mock-data';
import { fetchMissions, type MissionListItem } from '@/lib/missions-api';
import type { AttentionLevel } from '@/lib/api-types';

/** Bundled fallback used when the live missions engine is unreachable. */
function mockMissionList(): MissionListItem[] {
  return Object.values(mockMissionBriefs).flatMap((brief) => {
    const site = getMockSite(brief.siteId);
    if (!site) return [];
    return [
      {
        id: brief.id,
        siteId: brief.siteId,
        title: brief.name,
        siteName: site.name,
        waterbody: site.waterbody,
        summary: '',
        attention: site.attention as AttentionLevel,
        estMinutes: brief.estMinutes,
      },
    ];
  });
}

/**
 * Missions tab — the two ways to help: verify others' checks (at home), and run
 * a suggested mission (in the field). Entry point into F1 and F2. Reads the live
 * missions engine (GET /api/v1/missions), falling back to bundled briefs.
 */
export default async function MissionsPage() {
  const live = await fetchMissions();
  const missions = live && live.length > 0 ? live.slice(0, 12) : mockMissionList();

  return (
    <main className="mx-auto min-h-dvh max-w-2xl pb-28">
      <AppBar />

      <div className="space-y-6 px-4 pt-5">
        {/* Verify round (F2) */}
        <Link
          href="/verify"
          className="flex items-center gap-4 rounded-card border border-[var(--action)] bg-[var(--action-tint)] p-4"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--action)] text-white">
            <Eye className="h-6 w-6" aria-hidden="true" />
          </span>
          <div className="flex-1">
            <p className="font-bold text-ink">5 checks need your eyes</p>
            <p className="text-sm text-ink-muted">20-second rounds · verify from anywhere</p>
          </div>
          <ArrowRight className="h-5 w-5 text-[var(--action)]" aria-hidden="true" />
        </Link>

        {/* Suggested field missions (F1) */}
        <section>
          <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-ink-muted">
            Suggested missions
          </h2>
          <ul className="space-y-3">
            {missions.map((mission) => (
              <li key={mission.id}>
                <Link
                  href={`/missions/${encodeURIComponent(mission.siteId)}`}
                  className="rk-card rk-card-link flex items-center gap-3 rounded-card border border-unseen bg-surface p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-ink">{mission.title}</p>
                    <p className="truncate text-sm text-ink-muted">
                      {mission.siteName} · {mission.waterbody}
                    </p>
                    <div className="mt-1.5 flex items-center gap-3">
                      <AttentionStatus level={mission.attention} />
                      <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {mission.estMinutes}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-ink-muted" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
