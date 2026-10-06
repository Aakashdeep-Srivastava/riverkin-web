'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LogOut,
  Mail,
  UserCircle,
  FileText,
  ChevronRight,
  Waves,
  CheckCircle2,
  Sparkles,
  Trophy,
  Gift,
  Users,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react';
import { AppBar } from '@/components/app-bar';
import { SiteFooter } from '@/components/site-footer';
import { getStoredUser, signOut, fetchScore, type AuthUser, type RiverScore } from '@/lib/auth-api';
import { TourMenuItem } from '@/components/guide/tour-button';
import { InstallButton, AlertsButton } from '@/components/pwa';
import { StravaCard } from '@/components/strava-card';
import { ActivitiesCard, type ActivityItemType } from '@/components/activities-card';
import { listChecks, type QueuedCheck } from '@/lib/offline-queue';
import { Droplet } from 'lucide-react';

const ROLE_LABEL: Record<string, string> = {
  keeper: 'River keeper',
  crew_lead: 'Crew Lead',
  researcher: 'Researcher',
};

/** Feature shortcuts surfaced on the account page so the whole app is reachable. */
const HUB: { href: string; label: string; sub: string; Icon: LucideIcon; color: string }[] = [
  { href: '/challenges', label: 'Challenges', sub: 'Join the push', Icon: Trophy, color: 'var(--gold)' },
  { href: '/rewards', label: 'Rewards', sub: 'Your perks', Icon: Gift, color: 'var(--maroon)' },
  { href: '/crew', label: 'Crew', sub: 'Patrol together', Icon: Users, color: 'var(--action)' },
  { href: '/learn', label: 'Learn', sub: 'How it works', Icon: GraduationCap, color: 'var(--water)' },
];

function ActionTile({ href, label, sub, Icon, color }: (typeof HUB)[number]) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-card border border-unseen bg-surface p-3.5 transition-colors hover:border-[var(--action)] active:scale-[0.98]"
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ background: `color-mix(in srgb, ${color} 14%, var(--surface))`, color }}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-bold leading-tight text-ink">{label}</p>
        <p className="text-[12px] text-ink-muted">{sub}</p>
      </div>
      <ChevronRight
        className="h-4 w-4 shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  );
}

/** A small decorative "contribution radar" — concentric rings with site dots. */
function Radar() {
  return (
    <svg viewBox="0 0 96 96" className="h-20 w-20 shrink-0" aria-hidden="true">
      {[34, 24, 14].map((r) => (
        <circle key={r} cx="48" cy="48" r={r} fill="none" stroke="var(--unseen)" strokeWidth="1.5" opacity={0.7} />
      ))}
      <circle cx="48" cy="48" r="6" fill="var(--action)" />
      <circle cx="80" cy="30" r="3.5" fill="#2FA36B" />
      <circle cx="78" cy="64" r="3.5" fill="#2FA36B" />
      <circle cx="22" cy="70" r="3.5" fill="#F2A93B" />
    </svg>
  );
}

/**
 * "Me" — identity + account actions, styled as the account dashboard: brand-menu
 * app bar, an identity hero (name · role · Explore·Observe·Protect), and icon
 * cards for the demo session, recent contributions, guided tour, river alerts
 * and leaving the demo. Data & credits in the footer.
 */
function relTime(ms: number): string {
  const s = Math.max(0, Math.round((Date.now() - ms) / 1000));
  if (s < 60) return 'just now';
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

export default function MePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [score, setScore] = useState<RiverScore | null>(null);
  const [checks, setChecks] = useState<QueuedCheck[]>([]);

  useEffect(() => {
    setUser(getStoredUser());
    let active = true;
    void fetchScore().then((s) => {
      if (active) setScore(s);
    });
    void listChecks().then((c) => {
      if (active) setChecks(c);
    });
    return () => {
      active = false;
    };
  }, []);

  function handleSignOut() {
    signOut();
    try {
      localStorage.removeItem('rk_entered');
      localStorage.removeItem('rk_role');
    } catch {
      /* ignore */
    }
    router.replace('/welcome');
  }

  const name = user?.display_name ?? 'Kari';
  const role = user ? ROLE_LABEL[user.role] ?? 'River keeper' : 'River keeper';
  const initial = name.trim().charAt(0).toUpperCase() || 'K';

  return (
    <main className="mx-auto min-h-dvh max-w-2xl pb-28">
      <AppBar active="/me" />

      {/* Identity header — clean, no banner band. */}
      <div className="px-5 pt-5">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--action)] text-[28px] font-bold text-white shadow-[var(--rk-shadow)]">
            {initial}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-[clamp(1.4rem,6.5vw,1.85rem)] font-semibold leading-[1.05] text-ink">
              {name}
            </h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full border border-unseen bg-surface px-2.5 py-0.5 text-[12px] font-semibold text-ink">
                <Sparkles className="h-3 w-3 text-[var(--attention)]" aria-hidden="true" />
                {role}
              </span>
              {score ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--action-tint)] px-2.5 py-0.5 text-[12px] font-bold capitalize text-[var(--action)]">
                  <Waves className="h-3 w-3" aria-hidden="true" />
                  {score.tier}
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
          Explore · Observe · Protect
        </p>
      </div>

      {/* River Score — real, server-computed (points trace to usefulness, per PRD) */}
      {score ? (
        <div className="rk-reveal mx-4 mt-5 overflow-hidden rounded-card border border-unseen bg-surface shadow-[var(--rk-shadow)]">
          <div className="flex items-center justify-between p-4 pb-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">River Score</p>
              <p className="mt-0.5 text-[40px] font-extrabold leading-none tabular-nums text-ink">{score.score}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--action-tint)] px-3 py-1.5 text-[13px] font-bold capitalize text-[var(--action)]">
              <Waves className="h-4 w-4" aria-hidden="true" />
              {score.tier}
            </span>
          </div>
          {score.next_tier ? (
            <p className="px-4 pb-1 text-[12px] text-ink-muted">
              <span className="font-semibold tabular-nums text-ink">{score.to_next}</span> to {score.next_tier}
            </p>
          ) : null}
          <div className="grid grid-cols-2 border-t border-unseen">
            <div className="flex items-center gap-2.5 p-4">
              <FileText className="h-5 w-5 shrink-0 text-[var(--action)]" aria-hidden="true" />
              <div>
                <p className="text-[18px] font-bold leading-none tabular-nums text-ink">{score.checks}</p>
                <p className="mt-0.5 text-[12px] text-ink-muted">Checks</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 border-l border-unseen p-4">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-success" aria-hidden="true" />
              <div>
                <p className="text-[18px] font-bold leading-none tabular-nums text-ink">{score.verified}</p>
                <p className="mt-0.5 text-[12px] text-ink-muted">Verified</p>
              </div>
            </div>
          </div>
        </div>
      ) : user ? null : (
        <Link
          href="/register"
          className="mx-4 mt-5 flex items-center gap-3 rounded-card border border-dashed border-[var(--action)] bg-[var(--action-tint)] p-4 transition-transform active:scale-[0.99]"
        >
          <Sparkles className="h-5 w-5 shrink-0 text-[var(--action)]" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="font-bold text-ink">Start your River Score</p>
            <p className="text-[13px] text-ink-muted">Create an account to make your checks count.</p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-[var(--action)]" aria-hidden="true" />
        </Link>
      )}

      {/* Recent activity — collapsible activities card (your on-device checks). */}
      <section className="px-4 pt-6">
        <h2 className="mb-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
          Recent activity
        </h2>
        <ActivitiesCard
          headerIcon={<Droplet className="h-6 w-6 text-[var(--action)]" aria-hidden="true" />}
          title="Your river checks"
          subtitle={checks.length ? `${checks.length} on this device` : 'No checks yet'}
          activities={
            checks.length
              ? checks.slice(0, 6).map(
                  (c): ActivityItemType => ({
                    icon: <Droplet className="h-5 w-5 text-[var(--action)]" aria-hidden="true" />,
                    title: 'River check',
                    desc: c.points ? `+${c.points} River points` : 'Logged on this device',
                    time: relTime(c.createdAt),
                  }),
                )
              : [
                  {
                    icon: <Droplet className="h-5 w-5 text-[var(--action)]" aria-hidden="true" />,
                    title: 'No checks yet',
                    desc: 'Tap + to start your first river check',
                    time: '',
                  },
                ]
          }
        />
      </section>

      {/* Feature hub — reach the rest of the app from here. */}
      <section className="px-4 pt-6">
        <h2 className="mb-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
          Explore more
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          {HUB.map((item) => (
            <ActionTile key={item.href} {...item} />
          ))}
        </div>
      </section>

      <section className="space-y-3 px-4 pt-5">
        {/* Account / demo session */}
        <div className="flex items-center gap-3 rounded-card border border-unseen bg-surface p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--action-tint)] text-[var(--action)]">
            {user ? <Mail className="h-5 w-5" aria-hidden="true" /> : <UserCircle className="h-5 w-5" aria-hidden="true" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-ink">{user ? user.email : 'Demo session'}</p>
            <p className="text-[13px] text-ink-muted">
              {user ? 'Signed in with your account' : 'Passwordless — no account on this device'}
            </p>
          </div>
        </div>

        {/* Recent contributions */}
        <div className="flex items-center gap-3 rounded-card border border-unseen bg-surface p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--action-tint)] text-[var(--action)]">
            <FileText className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-bold leading-snug text-ink">Your recent checks and verified contributions appear here.</p>
            <p className="mt-0.5 text-[13px] text-ink-muted">The gaps you helped close — with real FHIR observation ids.</p>
            <Link
              href="/impact"
              className="mt-2 inline-flex items-center gap-1 text-[14px] font-semibold text-[var(--action)] hover:underline"
            >
              See your impact <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <Radar />
        </div>

        {/* Strava linking (hidden until configured on the server) */}
        <StravaCard />

        {/* Guided tour (already card-styled) */}
        <TourMenuItem />

        {/* River alerts (renders its own control; hidden where push is unsupported) */}
        <AlertsButton />

        <InstallButton />

        {/* Leave demo / sign out */}
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-card border border-unseen bg-surface p-4 text-left transition-transform active:scale-[0.99]"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--urgent)]/12 text-[var(--urgent)]">
            <LogOut className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-ink">{user ? 'Sign out' : 'Leave demo'}</p>
            <p className="text-[13px] text-ink-muted">
              {user ? 'End your session on this device' : 'Clear local data from this device'}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-ink-muted" aria-hidden="true" />
        </button>
      </section>

      <SiteFooter />
    </main>
  );
}
