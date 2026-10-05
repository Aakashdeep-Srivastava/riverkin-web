'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/lib/api';
import { PhotoFrame } from '@/components/ui/photo-frame';

type Aspect = 'video' | 'square' | 'tall' | 'wide';

const RATIO: Record<Aspect, string> = {
  video: 'aspect-[16/10]',
  square: 'aspect-square',
  tall: 'aspect-[3/4]',
  wide: 'aspect-[2/1]',
};

// Pixel dimensions requested from the static-map endpoint, matched to the frame
// so the satellite image isn't over- or under-sampled.
const PX: Record<Aspect, { w: number; h: number }> = {
  video: { w: 800, h: 500 },
  square: { w: 560, h: 560 },
  tall: { w: 540, h: 720 },
  wide: { w: 960, h: 480 },
};

/**
 * A real satellite image of a site's actual coordinates (Azure Maps static image
 * proxied by the API so no token reaches the browser). Falls back to the
 * illustrative <PhotoFrame /> when coordinates are missing, the API URL is unset,
 * or the image fails to load — so the page never shows a broken image.
 */
export function SiteImage({
  lat,
  lng,
  label,
  aspect = 'wide',
  zoom = 15,
  className,
}: {
  lat?: number | null;
  lng?: number | null;
  label?: string;
  aspect?: Aspect;
  zoom?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const usable =
    !failed &&
    API_BASE_URL &&
    typeof lat === 'number' &&
    typeof lng === 'number';

  if (!usable) {
    return <PhotoFrame aspect={aspect} label={label} className={className} />;
  }

  const { w, h } = PX[aspect];
  const src =
    `${API_BASE_URL}/api/v1/maps/static` +
    `?lat=${lat}&lng=${lng}&zoom=${zoom}&w=${w}&h=${h}`;

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
