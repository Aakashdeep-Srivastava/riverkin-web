'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { buttonClasses } from '@/components/ui/button';

/**
 * Share your impact — the invite/awareness loop (Track 5 social feature). Uses
 * the Web Share API on mobile, falls back to copying a short line. No vanity
 * metrics: the message is about the river, not a score.
 */
export function ShareImpact({
  siteName,
  waterbody,
  gapBefore,
}: {
  siteName: string;
  waterbody: string;
  gapBefore: number;
}) {
  const [copied, setCopied] = useState(false);

  const text =
    gapBefore > 0
      ? `I closed a ${gapBefore}-day monitoring gap on the ${waterbody} at ${siteName} with RiverKin. Join me in keeping Europe's urban rivers seen.`
      : `I just ran a stream check on the ${waterbody} at ${siteName} with RiverKin. Join me in keeping Europe's urban rivers seen.`;

  async function onShare() {
    const url = typeof window !== 'undefined' ? window.location.origin : 'https://riverkin.online';
    const nav = typeof navigator !== 'undefined' ? navigator : undefined;
    try {
      if (nav?.share) {
        await nav.share({ title: 'RiverKin', text, url });
        return;
      }
      await nav?.clipboard?.writeText(`${text} ${url}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // User cancelled the share sheet — no-op.
    }
  }

  return (
    <button type="button" onClick={onShare} className={buttonClasses('secondary', 'cta')}>
      {copied ? (
        <>
          <Check className="h-5 w-5" aria-hidden="true" /> Copied to clipboard
        </>
      ) : (
        <>
          <Share2 className="h-5 w-5" aria-hidden="true" /> Share your impact
        </>
      )}
    </button>
  );
}
