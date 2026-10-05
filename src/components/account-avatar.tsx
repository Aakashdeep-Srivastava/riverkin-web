'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User } from 'lucide-react';
import { getStoredUser } from '@/lib/auth-api';

/** First letter of the signed-in name (falls back to the email local-part). */
function initialOf(displayName?: string, email?: string): string | null {
  const name = displayName?.trim();
  if (name) return name.charAt(0).toUpperCase();
  const local = email?.trim();
  if (local) return local.charAt(0).toUpperCase();
  return null;
}

/**
 * Account badge in the top bar. Reads the stored user so it reflects who is
 * actually signed in (e.g. "A" for Aakashdeep), not a hardcoded persona. Guests
 * (no stored account) get a neutral person glyph.
 */
export function AccountAvatar() {
  const [initial, setInitial] = useState<string | null>(null);
  const [label, setLabel] = useState('Your account');

  useEffect(() => {
    const user = getStoredUser();
    setInitial(initialOf(user?.display_name, user?.email));
    if (user?.display_name) setLabel(`Your account — ${user.display_name}`);
  }, []);

  return (
    <Link
      href="/me"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--action)] text-sm font-bold text-white"
    >
      {initial ?? <User className="h-5 w-5" aria-hidden="true" strokeWidth={2} />}
    </Link>
  );
}
