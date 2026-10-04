'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Loader2, Compass, Search, Heart } from 'lucide-react';
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

const ITEMS = [
  { Icon: Compass, title: 'Explore freely', sub: 'No account needed' },
  { Icon: Search, title: 'Try a check', sub: 'See how it works' },
  { Icon: Heart, title: 'Make it count', sub: 'Sign in to contribute' },
];

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
        <button
          onClick={() => {
            setRedirecting(true);
            signInWithMicrosoft();
          }}
          disabled={redirecting}
          className="flex min-h-tap w-full items-center justify-center gap-2.5 rounded-full border border-unseen bg-surface px-4 py-3.5 text-[14px] font-semibold text-ink shadow-sm transition-transform active:scale-[0.98] disabled:opacity-70"
        >
          {redirecting ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <MicrosoftMark />}
          Sign in with Microsoft
          <ArrowRight className="ml-auto h-5 w-5 text-ink-muted" aria-hidden="true" />
        </button>
      ) : null}

      <button
        onClick={onGuest}
        className={`flex min-h-tap w-full items-center justify-center gap-2.5 rounded-full px-4 py-3.5 text-[14px] font-semibold text-white shadow-[0_6px_18px_rgba(10,110,255,0.35)] transition-transform active:scale-[0.98] ${
          msEnabled ? 'mt-3' : ''
        }`}
        style={{ background: 'linear-gradient(90deg, #1E7BFF 0%, #0052FF 100%)' }}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/25">
          <Compass className="h-4 w-4" aria-hidden="true" />
        </span>
        Browse as a guest
        <ArrowRight className="ml-auto h-5 w-5" aria-hidden="true" />
      </button>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {ITEMS.map(({ Icon, title, sub }) => (
          <div key={title} className="text-center">
            <Icon className="mx-auto h-5 w-5 text-ink" aria-hidden="true" />
            <p className="mt-1.5 text-[12px] font-semibold leading-tight text-ink">{title}</p>
            <p className="mt-0.5 text-[10px] leading-tight text-ink-muted">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
