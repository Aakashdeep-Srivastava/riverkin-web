'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Footprints, MapPin, Users, Clock, Target, ClipboardCheck } from 'lucide-react';
import { RiverMark } from '@/components/ui/logo';
import { attachReferral, joinChallenge, getChallenges, type Challenge } from '@/lib/community';
import { markEntered } from '@/lib/entry-state';

/** Instant hero content while the live campaign loads from the API. */
const FALLBACK: Challenge = {
  id: 'run-for-the-river',
  title: 'Run for the River',
  city: 'Ghent',
  kind: 'run',
  meta: '5 km',
  window: 'This week',
  status: 'live',
  daysLeft: 5,
  joined: 21,
  sites: 5,
  blurb: 'Find 5 freshwater sites along your run, walk or cycle route and help keep the river seen.',
  credit: 120,
  featured: true,
};

const STEPS = [
  { Icon: Footprints, title: 'Run, walk or cycle', body: 'Find freshwater sites near your route.' },
  { Icon: Target, title: 'Find water sites', body: 'The map ranks what needs a look today.' },
  { Icon: ClipboardCheck, title: 'Submit quick checks', body: '5-minute bank-side observations.' },
];

/**
 * /join/[code] — the shared invite landing. Pseudonymous: the code is the
 * referrer's guest id; we attach it (no self-referral), then "Join as guest"
 * creates a guest session and drops the newcomer straight into the challenge.
 * No account, no email. The referrer earns community credit only when this
 * person actually completes a mission (science data is never affected).
 */
export default function JoinPage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const code = String(params?.code ?? '');
  const [challenge, setChallenge] = useState<Challenge>(FALLBACK);

  useEffect(() => {
    if (code) void attachReferral(code);
    void getChallenges('live').then((cs) => {
      const feat = cs.find((c) => c.featured) ?? cs[0];
      if (feat) setChallenge(feat);
    });
  }, [code]);

  async function joinAsGuest() {
    markEntered('guest');
    await joinChallenge(challenge.id);
    void import('@/lib/analytics').then((m) => m.track('guest_entered'));
    router.replace('/challenges');
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col bg-[#081628] text-white">
      {/* Hero */}
      <div
        className="relative px-6 pt-[calc(env(safe-area-inset-top)+2rem)] pb-8"
        style={{ background: 'linear-gradient(160deg, #0E4FA0 0%, #0A2A52 70%, #081628 100%)' }}
      >
        <div className="flex items-center gap-2">
          <RiverMark className="h-8 w-8" />
          <span className="text-[17px] font-bold tracking-tight">RiverKin</span>
        </div>

        <p className="mt-8 text-[13px] font-semibold uppercase tracking-[0.2em] text-white/70">You’re invited to</p>
        <h1 className="mt-1 text-[32px] font-extrabold leading-tight">{challenge.title}</h1>
        <p className="mt-2 text-[15px] text-white/85">
          {challenge.meta} community challenge · {challenge.city} · {challenge.window}
        </p>

        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur">
          {[
            { Icon: Users, v: challenge.joined, l: 'Joined' },
            { Icon: MapPin, v: challenge.sites, l: 'Sites' },
            { Icon: Clock, v: `${challenge.daysLeft}d`, l: 'Left' },
          ].map(({ Icon, v, l }) => (
            <div key={l} className="flex flex-1 flex-col items-center gap-0.5">
              <Icon className="h-5 w-5 text-white/80" aria-hidden="true" />
              <span className="text-[17px] font-extrabold tabular-nums">{v}</span>
              <span className="text-[11px] text-white/70">{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* How it works + CTA */}
      <div className="flex-1 rounded-t-[2rem] bg-surface px-5 pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-6 text-ink">
        <p className="text-[13px] text-ink-muted">{challenge.blurb}</p>

        <ol className="mt-5 space-y-3">
          {STEPS.map(({ Icon, title, body }) => (
            <li key={title} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--action)]/12 text-[var(--action)]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[15px] font-bold text-ink">{title}</p>
                <p className="text-[12px] text-ink-muted">{body}</p>
              </div>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={joinAsGuest}
          className="mt-7 w-full rounded-full px-4 py-4 text-[16px] font-bold text-white shadow-[0_8px_22px_rgba(10,110,255,0.4)]"
          style={{ background: 'linear-gradient(90deg, #1E7BFF 0%, #0052FF 100%)' }}
        >
          Join as guest
        </button>
        <p className="mt-2.5 text-center text-[12px] text-ink-muted">
          No account required. Takes about 2 minutes.
        </p>
      </div>
    </main>
  );
}
