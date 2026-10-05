'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { PhotoFrame } from '@/components/ui/photo-frame';

type Aspect = 'video' | 'square' | 'tall' | 'wide';

const RATIO: Record<Aspect, string> = {
  video: 'aspect-[16/10]',
  square: 'aspect-square',
  tall: 'aspect-[3/4]',
  wide: 'aspect-[2/1]',
};

/**
 * A site's real satellite image. Served as a pre-baked, same-origin JPEG
 * (public/site-images/<id>.jpg, generated once by `npm run gen:site-images`)
 * rather than rendered live — so there's no per-view Azure Maps cost, no
 * cross-origin CORP concern, and the file is ~10x smaller than the live PNG.
 * Falls back to the illustrative <PhotoFrame /> if the baked image is missing
 * or fails to load.
 */
export function SiteImage({
  siteId,
  label,
  aspect = 'wide',
  className,
}: {
  siteId?: string;
  label?: string;
  aspect?: Aspect;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (failed || !siteId) {
    return <PhotoFrame aspect={aspect} label={label} className={className} />;
  }

  // Served from /site-images (NOT /sites — that path is the site-detail route).
  const src = `/site-images/${encodeURIComponent(siteId)}.jpg`;

  return (
    <div
      className={cn('relative overflow-hidden rounded-card bg-[var(--unseen)]', RATIO[aspect], className)}
      role="img"
      aria-label={label ? `Satellite view of ${label}` : 'Satellite view of the site'}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        onError={() => setFailed(true)}
        onLoad={() => setLoaded(true)}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-500 ease-out motion-reduce:transition-none',
          loaded ? 'opacity-100' : 'opacity-0',
        )}
      />
      {/* Legibility scrim for any overlaid chrome/label. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(5,16,33,0.22) 0%, rgba(5,16,33,0) 28%, rgba(5,16,33,0.34) 100%)' }}
      />
      {label ? (
        <span className="absolute bottom-2 left-2 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          {label}
        </span>
      ) : null}
      <span className="absolute right-2 top-2 rounded-full bg-black/35 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/90 backdrop-blur-sm">
        Satellite · Azure Maps
      </span>
    </div>
  );
}
