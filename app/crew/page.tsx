'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, MapPin, Flame, ShieldCheck, Settings, ArrowRight } from 'lucide-react';
import { buttonClasses } from '@/components/ui/button';
import { AttentionStatus } from '@/components/attention-status';
import {
  fetchCrew,
  getRememberedCrewId,
  type CrewView,
} from '@/lib/crews-api';
import type { AttentionLevel } from '@/lib/api-types';

/** Coverage ring — % of adopted sites that are fresh. */
function CoverageRing({ pct }: { pct: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct / 100);
  return (
    <span className="relative inline-flex h-24 w-24 items-center justify-center">
      <svg viewBox="0 0 80 80" className="absolute inset-0 -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--unseen)" strokeWidth="6" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="var(--success)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="text-xl font-bold tabular-nums text-ink">{pct}%</span>
    </span>
  );
}

export default function CrewPage() {
  const [crew, setCrew] = useState<CrewView | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = getRememberedCrewId();
    if (id == null) {
      setLoading(false);
      return;
    }
    void fetchCrew(id).then((c) => {
      setCrew(c);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-2xl items-center justify-center px-4">
        <p className="text-sm text-ink-muted">Loading crew…</p>
      </main>
    );
  }

  // No crew yet → invite the Crew Lead to set one up (L2).
  if (!crew) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center gap-6 px-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--action-tint)] text-[var(--action)]">
          <Users className="h-8 w-8" aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-ink">Start a crew</h1>
          <p className="mt-2 text-ink-muted">
            Adopt up to three rivers and keep them seen together. Students join as
            pseudonymous handles — no personal data.
          </p>
        </div>
        <Link href="/crew/setup" className={`max-w-xs ${buttonClasses('primary', 'cta')}`}>
          Set up your crew
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-dvh max-w-2xl px-4 pb-24">
      <header className="flex items-center justify-between pt-[calc(env(safe-area-inset-top)+0.75rem)]">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-wide text-ink-muted">Crew</p>
          <h1 className="text-xl font-bold leading-tight text-ink">{crew.name}</h1>
          {crew.city ? <p className="text-sm text-ink-muted">{crew.city}</p> : null}
        </div>
        <Link
          href="/crew/setup"
          aria-label="Crew settings"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-unseen text-ink"
        >
          <Settings className="h-5 w-5" aria-hidden="true" />
        </Link>
      </header>

      {/* Coverage + streak */}
      <div className="mt-5 flex items-center gap-5 rounded-card border border-unseen bg-surface p-5">
        <CoverageRing pct={crew.coverage_pct} />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-ink">Keep the river seen</p>
          <p className="inline-flex items-center gap-1.5 text-sm text-ink-muted">
            <Flame className="h-4 w-4 text-[var(--attention)]" aria-hidden="true" />
            {crew.streak_windows} window{crew.streak_windows === 1 ? '' : 's'} streak
          </p>
          <p
            className={`inline-flex items-center gap-1.5 text-sm ${
              crew.checkin_active ? 'text-[var(--success)]' : 'text-ink-muted'
            }`}
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            {crew.checkin_active ? 'Check-in active' : 'No active check-in'}
          </p>
        </div>
      </div>

      {/* Adopted sites */}
      <section className="mt-6">
        <h2 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-ink-muted">
          Adopted sites ({crew.adopted.length}/3)
        </h2>
        {crew.adopted.length > 0 ? (
          <ul className="space-y-2">
            {crew.adopted.map((s) => (
              <li key={s.site_code}>
                <Link
                  href={`/sites/${s.site_code}`}
                  className="flex items-center justify-between rounded-card border border-unseen bg-surface p-4 hover:border-water"
                >
                  <div>
                    <p className="font-semibold text-ink">{s.name}</p>
                    <p className="inline-flex items-center gap-1 text-sm text-ink-muted">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {s.days_unseen} days unseen
                    </p>
                  </div>
                  <AttentionStatus level={s.attention as AttentionLevel} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <Link
            href="/crew/setup"
            className="block rounded-card border border-dashed border-unseen bg-surface p-4 text-sm text-ink-muted hover:border-water"
          >
            Adopt your first site →
          </Link>
        )}
      </section>

      {/* Members */}
      <section className="mt-6">
        <h2 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-ink-muted">
          Members ({crew.members.length})
        </h2>
        <ul className="flex flex-wrap gap-2">
          {crew.members.map((m) => (
            <li
              key={m.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--action-tint)] px-3 py-1.5 text-xs font-semibold text-[var(--action)]"
            >
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              {m.handle}
              {m.role_this_week ? <span className="text-ink-muted">· {m.role_this_week}</span> : null}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
