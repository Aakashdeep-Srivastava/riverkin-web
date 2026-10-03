'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Mail, UserCircle } from 'lucide-react';
import { ScreenHeader } from '@/components/screen-header';
import { SimulatedBadge } from '@/components/simulated-badge';
import { SiteFooter } from '@/components/site-footer';
import { buttonClasses } from '@/components/ui/button';
import { getStoredUser, signOut, type AuthUser } from '@/lib/auth-api';

const ROLE_LABEL: Record<string, string> = {
  keeper: 'Keeper · adult volunteer',
  crew_lead: 'Crew Lead',
  researcher: 'Researcher',
};

/**
 * "Me" — identity + sign out. No points, XP, badges or leaderboards (hard rule);
 * contribution-focused only.
 */
export default function MePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [demoRole, setDemoRole] = useState<string | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
    try {
      setDemoRole(localStorage.getItem('rk_role'));
    } catch {
      /* ignore */
    }
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
  const subtitle = user ? ROLE_LABEL[user.role] ?? 'River keeper' : ROLE_LABEL[demoRole ?? 'keeper'] ?? 'River keeper';

  return (
    <main className="mx-auto max-w-2xl pb-28">
      <ScreenHeader title={name} subtitle={subtitle}>
        {!user ? <SimulatedBadge /> : null}
      </ScreenHeader>

      <section className="space-y-4 px-4 pt-4">
        {/* Account card */}
        <div className="flex items-center gap-3 rounded-card border border-unseen bg-surface p-5">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--action-tint)] text-[var(--action)]">
            {user ? <Mail className="h-6 w-6" aria-hidden="true" /> : <UserCircle className="h-6 w-6" aria-hidden="true" />}
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-ink">{user ? user.email : 'Demo session'}</p>
            <p className="text-sm text-ink-muted">
              {user ? 'Signed in with your account' : 'Passwordless — no account on this device'}
            </p>
          </div>
        </div>

        <div className="rounded-card border border-unseen bg-surface p-5">
          <p className="text-sm text-ink-muted">
            Your recent checks and verified contributions appear here. No scores, no badges — just the
            gaps you helped close.
          </p>
          <Link
            href="/researcher"
            className="mt-4 inline-flex min-h-tap items-center text-sm font-semibold text-[var(--action)] hover:underline"
          >
            Open researcher view
          </Link>
        </div>

        <button onClick={handleSignOut} className={buttonClasses('secondary', 'cta')}>
          <LogOut className="h-5 w-5" aria-hidden="true" />
          {user ? 'Sign out' : 'Leave demo'}
        </button>
      </section>
      <SiteFooter />
    </main>
  );
}
