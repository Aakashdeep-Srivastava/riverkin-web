'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Mail, UserCircle, FileText, ChevronRight } from 'lucide-react';
import { AppBar } from '@/components/app-bar';
import { SiteFooter } from '@/components/site-footer';
import { getStoredUser, signOut, type AuthUser } from '@/lib/auth-api';
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

  useEffect(() => {
    setUser(getStoredUser());
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

  return (
    <main className="mx-auto min-h-dvh max-w-2xl pb-28">
      <AppBar active="/me" />

      {/* Identity hero */}
      <div className="px-5 pt-5">
        <h1 className="text-[34px] font-extrabold leading-none tracking-tight text-ink">{name}</h1>
        <p className="mt-1.5 text-[16px] text-ink-muted">{role}</p>
        <p className="mt-0.5 text-[14px] text-ink-muted">Explore · Observe · Protect</p>
      </div>

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
