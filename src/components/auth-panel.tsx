'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, Compass, Mail } from 'lucide-react';
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
 * real account that makes your work count. Progressive registration (RiverKin
 * auth model). Styled as the white sheet in the welcome mockup.
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
        <motion.button
          onClick={() => {
            setRedirecting(true);
            signInWithMicrosoft();
          }}
          disabled={redirecting}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.985 }}
          className="flex min-h-tap w-full items-center justify-center gap-2.5 rounded-full border border-unseen bg-surface px-4 py-3.5 text-[14px] font-semibold text-ink shadow-sm disabled:opacity-70"
        >
          {redirecting ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <MicrosoftMark />}
          Sign in with Microsoft
          <ArrowRight className="ml-auto h-5 w-5 text-ink-muted" aria-hidden="true" />
        </motion.button>
      ) : null}

      <motion.button
        onClick={onGuest}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.985 }}
        className={`flex min-h-tap w-full items-center justify-center gap-2.5 rounded-full px-4 py-3.5 text-[14px] font-semibold text-white shadow-[0_6px_18px_rgba(10,110,255,0.35)] ${
          msEnabled ? 'mt-3' : ''
        }`}
        style={{ background: 'linear-gradient(90deg, #1E7BFF 0%, #0052FF 100%)' }}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/25">
          <Compass className="h-4 w-4" aria-hidden="true" />
        </span>
        Browse as a guest
        <ArrowRight className="ml-auto h-5 w-5" aria-hidden="true" />
      </motion.button>

      <Link
        href="/register"
        className="mt-3 flex min-h-tap w-full items-center justify-center gap-2.5 rounded-full border border-unseen bg-surface px-4 py-3.5 text-[14px] font-semibold text-ink shadow-sm"
      >
        <Mail className="h-5 w-5 text-ink-muted" aria-hidden="true" />
        Create an account
        <ArrowRight className="ml-auto h-5 w-5 text-ink-muted" aria-hidden="true" />
      </Link>

      <p className="mt-3.5 text-center text-[12px] leading-relaxed text-white/85 drop-shadow">
        Guests can explore and try a check. Sign in to make your work count toward the shared data.
        <br />
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-white underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </div>
  );
}
