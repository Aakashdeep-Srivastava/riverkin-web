'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Mail, UserCircle, FileText, ChevronRight, Waves, CheckCircle2, Sparkles } from 'lucide-react';
import { AppBar } from '@/components/app-bar';
import { SiteFooter } from '@/components/site-footer';
import { getStoredUser, signOut, fetchScore, type AuthUser, type RiverScore } from '@/lib/auth-api';
import { TourMenuItem } from '@/components/guide/tour-button';
import { InstallButton, AlertsButton } from '@/components/pwa';

const ROLE_LABEL: Record<string, string> = {
  keeper: 'River keeper',
  crew_lead: 'Crew Lead',
  researcher: 'Researcher',
};

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
export default function MePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [score, setScore] = useState<RiverScore | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
    let active = true;
    void fetchScore().then((s) => {
      if (active) setScore(s);
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

      {/* Identity hero — brand banner + avatar give the top presence (was bare text) */}
      <div className="relative">
        <div
          aria-hidden="true"
          className="relative h-28 w-full overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#1E7BFF 0%,#0E4FA0 58%,#7A1F3D 150%)' }}
        >
          {/* Soft light sheen catching the top-right. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(120% 140% at 85% -20%, rgba(255,255,255,0.30) 0%, transparent 55%)',
            }}
          />
          {/* Flowing river current — gives the band texture instead of flat colour. */}
          <svg
            viewBox="0 0 400 120"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full opacity-35"
          >
            <path d="M0 58 C70 42 120 80 200 62 S330 42 400 62" fill="none" stroke="white" strokeWidth="1.5" opacity="0.5" />
            <path d="M0 78 C70 58 120 98 200 78 S330 58 400 78" fill="none" stroke="white" strokeWidth="2.5" />
            <path d="M0 96 C70 76 120 116 200 96 S330 76 400 96" fill="none" stroke="white" strokeWidth="2" opacity="0.7" />
          </svg>
          {/* Wordmark so the header reads as RiverKin's. */}
          <span className="absolute right-4 top-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75">
            RiverKin
          </span>
        </div>
        <div className="px-5">
          <div className="-mt-11 flex items-end justify-between gap-3">
            <span className="flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-full bg-[var(--action)] text-[36px] font-bold text-white shadow-[var(--rk-shadow-lift)] ring-4 ring-surface">
              {initial}
            </span>
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-unseen bg-surface px-3 py-1 text-[12px] font-semibold text-ink shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-[var(--attention)]" aria-hidden="true" />
              {role}
            </span>
          </div>
          <h1 className="mt-3 text-[30px] font-extrabold leading-[1.05] tracking-tight text-ink">{name}</h1>
          <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
            Explore · Observe · Protect
          </p>
        </div>
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

      <section className="space-y-3 px-4 pt-6">
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
