import Link from 'next/link';
import { Eye, ChevronRight, Clock, ArrowRight } from 'lucide-react';
import { AppBar } from '@/components/app-bar';
import { AttentionStatus } from '@/components/attention-status';
import { SiteFooter } from '@/components/site-footer';
import { mockMissionBriefs, getMockSite } from '@/lib/mock-data';

/**
 * Missions tab — the two ways to help: verify others' checks (at home), and run
 * a suggested mission (in the field). Entry point into F1 and F2.
 */
export default function MissionsPage() {
  const briefs = Object.values(mockMissionBriefs);

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
            {briefs.map((brief) => {
              const site = getMockSite(brief.siteId);
              if (!site) return null;
              return (
                <li key={brief.id}>
                  <Link
                    href={`/missions/${brief.siteId}`}
                    className="rk-card rk-card-link flex items-center gap-3 rounded-card border border-unseen bg-surface p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-ink">{brief.name}</p>
                      <p className="truncate text-sm text-ink-muted">
                        {site.name} · {site.waterbody}
                      </p>
                      <div className="mt-1.5 flex items-center gap-3">
                        <AttentionStatus level={site.attention} />
                        <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {brief.estMinutes}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-ink-muted" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
