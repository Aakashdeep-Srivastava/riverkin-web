'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { isMicrosoftEnabled, signInWithMicrosoft } from '@/lib/auth-api';

/** Microsoft's four-square mark. */
function MicrosoftMark() {
  return (
    <svg viewBox="0 0 21 21" className="h-5 w-5" aria-hidden="true">
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  );
}

/**
 * Sign-in surface: browse as a guest (no wall), or sign in with Microsoft for a
 * real account that makes your work count. No forced registration (progressive
 * registration — see the RiverKin auth model).
 */
export function AuthPanel({ onGuest }: { onGuest: () => void }) {
  const [msEnabled, setMsEnabled] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    let active = true;
    void isMicrosoftEnabled().then((v) => {
      if (active) setMsEnabled(v);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="rk-reveal" style={{ animationDelay: '220ms' }}>
      {msEnabled ? (
        <button
          onClick={() => {
            setRedirecting(true);
            signInWithMicrosoft();
          }}
          disabled={redirecting}
          className="flex min-h-tap w-full items-center justify-center gap-2.5 rounded-button bg-white px-4 py-3 font-semibold text-[#1b1b1b] transition-transform active:scale-[0.98] disabled:opacity-70"
        >
          {redirecting ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <MicrosoftMark />}
          Sign in with Microsoft
        </button>
      ) : null}

      <button
        onClick={onGuest}
        className={`flex min-h-tap w-full items-center justify-center gap-2 rounded-button border border-white/20 px-4 font-semibold text-white transition-transform active:scale-[0.98] ${
          msEnabled ? 'mt-2.5 py-3' : 'py-3.5'
        }`}
      >
        Browse as a guest
        <ArrowRight className="h-4 w-4 opacity-70" aria-hidden="true" />
      </button>

      <p className="mt-3 text-center text-[12px] leading-relaxed text-white/50">
        Guests can explore and try a check. Sign in to make your work count toward the shared data.
      </p>
      <p className="mt-2 text-center text-[11px] text-white/40">
        By continuing you agree to our{' '}
        <Link href="/terms" className="underline underline-offset-2 hover:text-white/70">
          Terms
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-white/70">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
