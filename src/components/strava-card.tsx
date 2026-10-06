'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Activity, ChevronRight, Loader2, MapPin, Unlink } from 'lucide-react';
import { ActivitiesCard, type ActivityItemType } from '@/components/activities-card';
import {
  fetchStravaConfig,
  fetchStravaStatus,
  fetchPatrols,
  disconnectStrava,
  beginStravaConnect,
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
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
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
      mountedRef.current = false;
    };
  }, []);

  if (loading) return null;

  const StravaMark = (
    <span
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
      style={{ background: `color-mix(in srgb, ${STRAVA_ORANGE} 14%, var(--surface))` }}
    >
      <Activity className="h-5 w-5" style={{ color: STRAVA_ORANGE }} aria-hidden="true" />
    </span>
  );

  // Not configured on the server yet — still show the entry so people know it's
  // coming, but make clear it isn't live (honest, not a dead button).
  if (!enabled) {
    return (
      <div className="flex items-center gap-3 rounded-card border border-unseen bg-surface p-4">
        {StravaMark}
        <div className="min-w-0 flex-1">
          <p className="font-bold text-ink">Connect a running watch</p>
          <p className="text-[13px] text-ink-muted">Strava — turn your riverside runs into patrols.</p>
        </div>
        <span className="shrink-0 rounded-full bg-[var(--action-tint)] px-2.5 py-1 text-[11px] font-semibold text-[var(--action)]">
          Coming soon
        </span>
      </div>
    );
  }

  // Connected: show the athlete + recent patrols.
  if (status?.connected) {
    async function handleDisconnect() {
      setBusy(true);
      await disconnectStrava();
      if (!mountedRef.current) return;
      setStatus({ enabled: true, connected: false, athlete_name: null });
      setPatrols(null);
      setBusy(false);
    }
    const list = (patrols ?? []).slice(0, 6);
    const items: ActivityItemType[] = list.map((p) => ({
      icon: <MapPin className="h-5 w-5" style={{ color: STRAVA_ORANGE }} aria-hidden="true" />,
      title: p.name ?? p.type ?? 'Activity',
      desc: `${km(p.distance_m)}${p.type ? ` · ${p.type}` : ''}`,
      time: shortDate(p.start_date),
    }));
    return (
      <div className="space-y-2.5">
        <ActivitiesCard
          headerIcon={<Activity className="h-6 w-6" style={{ color: STRAVA_ORANGE }} aria-hidden="true" />}
          title="Your patrols"
          subtitle={
            items.length
              ? `${status.athlete_name ?? 'Strava'} · ${items.length} recent`
              : `${status.athlete_name ?? 'Strava'} · no runs yet`
          }
          activities={
            items.length
              ? items
              : [
                  {
                    icon: <Activity className="h-5 w-5" style={{ color: STRAVA_ORANGE }} aria-hidden="true" />,
                    title: 'No patrols yet',
                    desc: 'Your next riverside run shows up here',
                    time: '',
                  },
                ]
          }
        />
        <button
          onClick={handleDisconnect}
          disabled={busy}
          className="flex items-center gap-1.5 rounded-full border border-unseen px-3 py-1.5 text-[13px] font-semibold text-ink-muted transition-colors hover:text-[var(--urgent)] disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Unlink className="h-4 w-4" aria-hidden="true" />}
          Disconnect Strava
        </button>
      </div>
    );
  }

  // Signed in but not linked yet → start the ticket-based OAuth connect.
  if (status) {
    return (
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          const ok = await beginStravaConnect();
          // On success the browser navigates away; only reset if it didn't.
          if (!ok && mountedRef.current) setBusy(false);
        }}
        className="flex w-full items-center gap-3 rounded-card border border-unseen bg-surface p-4 text-left transition-transform active:scale-[0.99] disabled:opacity-70"
      >
        {StravaMark}
        <div className="min-w-0 flex-1">
          <p className="font-bold text-ink">Connect Strava</p>
          <p className="text-[13px] text-ink-muted">Turn your riverside runs and walks into patrols.</p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-ink-muted" aria-hidden="true" />
      </button>
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
