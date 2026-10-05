'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const KEY = 'rk_saved_sites';

function readSaved(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeSaved(ids: string[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* storage unavailable (private mode) — toggle still works for this view */
  }
}

/**
 * Save/un-save a site to a personal, on-device list (no account needed — crews
 * "adopt" sites, which is a different, shared concept). The heart fills when
 * saved, with instant press feedback and a small pop on toggle.
 */
export function SaveSiteButton({ siteId }: { siteId: string }) {
  const [saved, setSaved] = useState(false);
  const [pop, setPop] = useState(false);

  useEffect(() => {
    setSaved(readSaved().includes(siteId));
  }, [siteId]);

  function toggle() {
    const next = !saved;
    setSaved(next);
    setPop(true);
    const current = readSaved();
    writeSaved(next ? [...new Set([...current, siteId])] : current.filter((id) => id !== siteId));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? 'Saved — tap to remove' : 'Save site'}
      className="rk-glass flex h-10 w-10 items-center justify-center rounded-full text-ink transition-transform duration-100 active:scale-90"
    >
      <Heart
        aria-hidden="true"
        onAnimationEnd={() => setPop(false)}
        className={cn(
          'h-5 w-5 transition-colors',
          saved ? 'fill-[var(--urgent)] text-[var(--urgent)]' : 'fill-transparent',
          pop && 'motion-safe:animate-[rk-heart-pop_320ms_ease-out]',
        )}
      />
    </button>
  );
}
