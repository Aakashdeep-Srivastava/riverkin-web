'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Activity, ChevronRight, Loader2, MapPin, Unlink } from 'lucide-react';
import {
  fetchStravaConfig,
  fetchStravaStatus,
  fetchPatrols,
  disconnectStrava,
  stravaConnectUrl,
  type StravaStatus,
  type Patrol,
} from '@/lib/strava-api';

const STRAVA_ORANGE = '#FC4C02';

function km(m: number | null): string {
  if (!m || m <= 0) return '—';
  return `${(m / 1000).toFixed(1)} km`;
}

function shortDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

/**
 * "Connect Strava" / linked-patrols card for the account page. Turns a runner's
 * riverside runs and walks into patrols. Renders nothing unless the server has
 * Strava configured (config-gated, like the Microsoft sign-in button).
 */
export function StravaCard() {
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState<StravaStatus | null>(null);
  const [patrols, setPatrols] = useState<Patrol[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    void (async () => {
      const on = await fetchStravaConfig();
      if (!active) return;
      setEnabled(on);
      if (on) {
        const st = await fetchStravaStatus();
        if (!active) return;
        setStatus(st);
        if (st?.connected) {
          const p = await fetchPatrols();
          if (active) setPatrols(p);
        }
      }
      if (active) setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  if (!enabled || loading) return null;

  const StravaMark = (
    <span
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
      style={{ background: `color-mix(in srgb, ${STRAVA_ORANGE} 14%, var(--surface))` }}
    >
      <Activity className="h-5 w-5" style={{ color: STRAVA_ORANGE }} aria-hidden="true" />
    </span>
  );

  // Connected: show the athlete + recent patrols.
  if (status?.connected) {
    async function handleDisconnect() {
      setBusy(true);
      await disconnectStrava();
      setStatus({ enabled: true, connected: false, athlete_name: null });
      setPatrols(null);
      setBusy(false);
    }
    const list = (patrols ?? []).slice(0, 5);
    return (
      <div className="rounded-card border border-unseen bg-surface p-4">
        <div className="flex items-center gap-3">
          {StravaMark}
          <div className="min-w-0 flex-1">
            <p className="font-bold text-ink">Strava connected</p>
            <p className="truncate text-[13px] text-ink-muted">
              {status.athlete_name ?? 'Your activities count as patrols'}
            </p>
          </div>
          <button
            onClick={handleDisconnect}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-full border border-unseen px-3 py-1.5 text-[13px] font-semibold text-ink-muted transition-colors hover:text-[var(--urgent)] disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Unlink className="h-4 w-4" aria-hidden="true" />}
            Disconnect
          </button>
        </div>

        {list.length > 0 ? (
          <ul className="mt-3 space-y-1.5 border-t border-unseen pt-3">
            {list.map((p) => (
              <li key={p.id} className="flex items-center gap-2.5 text-[13px]">
                <MapPin className="h-4 w-4 shrink-0 text-[var(--action)]" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate text-ink">{p.name ?? p.type ?? 'Activity'}</span>
                <span className="shrink-0 font-semibold tabular-nums text-ink">{km(p.distance_m)}</span>
                <span className="shrink-0 text-ink-muted">{shortDate(p.start_date)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 border-t border-unseen pt-3 text-[13px] text-ink-muted">
            No recent activities yet — your next run along a river shows up here.
          </p>
        )}
      </div>
    );
  }

  // Signed in but not linked yet.
  const connectUrl = stravaConnectUrl();
  if (connectUrl) {
    return (
      <a
        href={connectUrl}
        className="flex items-center gap-3 rounded-card border border-unseen bg-surface p-4 transition-transform active:scale-[0.99]"
      >
        {StravaMark}
        <div className="min-w-0 flex-1">
          <p className="font-bold text-ink">Connect Strava</p>
          <p className="text-[13px] text-ink-muted">Turn your riverside runs and walks into patrols.</p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-ink-muted" aria-hidden="true" />
      </a>
    );
  }

  // Guest (no account): linking needs an account first.
  return (
    <Link
      href="/register"
      className="flex items-center gap-3 rounded-card border border-unseen bg-surface p-4 transition-transform active:scale-[0.99]"
    >
      {StravaMark}
      <div className="min-w-0 flex-1">
        <p className="font-bold text-ink">Connect Strava</p>
        <p className="text-[13px] text-ink-muted">Create an account to link your runs as patrols.</p>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-ink-muted" aria-hidden="true" />
    </Link>
  );
}
