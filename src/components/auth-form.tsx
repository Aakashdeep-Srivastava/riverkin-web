'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { register, login, type Role } from '@/lib/auth-api';
import { markEntered } from '@/lib/entry-state';

type Mode = 'register' | 'login';

const ROLES: { value: Role; label: string }[] = [
  { value: 'keeper', label: 'Keeper' },
  { value: 'crew_lead', label: 'Crew lead' },
  { value: 'researcher', label: 'Researcher' },
];

const inputClasses =
  'min-h-tap w-full rounded-2xl border border-unseen bg-surface px-4 py-3 text-[15px] text-ink placeholder:text-ink-muted/70 outline-none transition-colors focus:border-[var(--action)]';

/**
 * Email + password sign-up / sign-in. Wraps the existing register()/login()
 * helpers, which persist the token + user on success; we then mark entry and
 * send the viewer into the app. Microsoft and guest entry stay on /welcome.
 */
export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const isRegister = mode === 'register';

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('keeper');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError('');
    setBusy(true);
    const result = isRegister
      ? await register({ email: email.trim(), password, displayName: displayName.trim(), role })
      : await login({ email: email.trim(), password });
    if (result.user) {
      markEntered(result.user.role);
      router.replace('/');
      return;
    }
    setError(result.error ?? 'Something went wrong. Please try again.');
    setBusy(false);
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col px-6 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-10">
      <Link
        href="/welcome"
        aria-label="Back"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
      </Link>

      <h1 className="mt-4 text-[28px] font-bold leading-tight text-ink">
        {isRegister ? 'Create your account' : 'Welcome back'}
      </h1>
      <p className="mt-1.5 text-[14px] leading-relaxed text-ink-muted">
        {isRegister
          ? 'An account makes your checks and verifications count toward the shared data.'
          : 'Sign in to pick up where you left off.'}
      </p>

      <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-4">
        {isRegister ? (
          <div>
            <label htmlFor="name" className="mb-1.5 block text-[13px] font-semibold text-ink">
              Name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className={inputClasses}
            />
          </div>
        ) : null}

        <div>
          <label htmlFor="email" className="mb-1.5 block text-[13px] font-semibold text-ink">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-[13px] font-semibold text-ink">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isRegister ? 'At least 8 characters' : 'Your password'}
            className={inputClasses}
          />
        </div>

        {isRegister ? (
          <fieldset>
            <legend className="mb-1.5 block text-[13px] font-semibold text-ink">I am a…</legend>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => {
                const active = role === r.value;
                return (
                  <button
                    key={r.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setRole(r.value)}
                    className={`min-h-tap rounded-2xl border px-2 py-2.5 text-[13px] font-semibold transition-colors ${
                      active
                        ? 'border-[var(--action)] bg-[var(--action-tint)] text-[var(--action)]'
                        : 'border-unseen bg-surface text-ink-muted hover:text-ink'
                    }`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ) : null}

        {error ? (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-2xl bg-[color-mix(in_srgb,var(--urgent)_10%,var(--surface))] px-3.5 py-2.5 text-[13px] text-[var(--urgent)]"
          >
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        ) : null}

        <Button type="submit" disabled={busy} className="mt-1">
          {busy ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : null}
          {isRegister ? 'Create account' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-ink-muted">
        {isRegister ? (
          <>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-[var(--action)]">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New to RiverKin?{' '}
            <Link href="/register" className="font-semibold text-[var(--action)]">
              Create an account
            </Link>
          </>
        )}
      </p>
    </main>
  );
}
