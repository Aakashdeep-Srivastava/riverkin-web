'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, TriangleAlert } from 'lucide-react';
import { completeFromToken } from '@/lib/auth-api';
import { markEntered } from '@/lib/entry-state';
import { buttonClasses } from '@/components/ui/button';

const ERRORS: Record<string, string> = {
  bad_state: 'Your sign-in link expired. Please try again.',
  token_exchange: 'Microsoft sign-in could not be completed. Please try again.',
  no_email: 'Your Microsoft account did not share an email, which we need.',
  denied: 'Sign-in was cancelled.',
  signin_failed: 'We could not finish signing you in. Please try again.',
};

function Complete() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = params.get('token');
    const err = params.get('error');
    if (err) {
      setError(ERRORS[err] ?? 'Sign-in failed. Please try again.');
      return;
    }
    if (!token) {
      router.replace('/welcome');
      return;
    }
    void completeFromToken(token).then((user) => {
      if (user) {
        markEntered(user.role);
        router.replace('/');
      } else {
        setError(ERRORS.signin_failed);
      }
    });
  }, [params, router]);

  if (error) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-sm flex-col items-center justify-center gap-5 px-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--urgent)_12%,var(--surface))] text-[var(--urgent)]">
          <TriangleAlert className="h-7 w-7" aria-hidden="true" />
        </span>
        <p className="text-ink">{error}</p>
        <Link href="/welcome" className={`max-w-xs ${buttonClasses('primary', 'cta')}`}>
          Back to sign in
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
      <Loader2 className="h-7 w-7 animate-spin text-[var(--action)]" aria-hidden="true" />
      <p className="text-sm text-ink-muted">Signing you in…</p>
    </main>
  );
}

export default function AuthCompletePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-dvh items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-[var(--action)]" aria-hidden="true" />
        </main>
      }
    >
      <Complete />
    </Suspense>
  );
}
