'use client';

import { MapPin } from 'lucide-react';

/**
 * Styled stand-in for the full-screen MapLibre attention map.
 *
 * It renders no network tiles so the build/SSR never depends on a map server.
 * A decorative FluidOrb (WebGL, water-coloured) sits behind the label as an
 * ambient "river system" visual; it is aria-hidden and freezes itself when the
 * viewer prefers reduced motion.
 *
 * TODO(PRD): replace with a real MapLibre GL map (OSM or Azure Maps tiles via
 * NEXT_PUBLIC_MAP_STYLE_URL) showing sites pulsing by need. The accessible site
 * list alongside it (WCAG) lives on the home screen and stays regardless.
 */
export function MapPlaceholder() {
  return (
    <div
      role="img"
      aria-label="Map of river sites (simulated placeholder). A text list of the same sites is shown below."
      className="relative flex h-full min-h-[14rem] w-full items-center justify-center overflow-hidden bg-[color-mix(in_srgb,var(--water)_10%,var(--surface))]"
    >
      {/* Ambient water glow (decorative, CSS-only — no WebGL on the critical path). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 55% at 50% 45%, color-mix(in srgb, var(--water) 45%, transparent) 0%, transparent 70%)',
        }}
      />

      {/* Faint grid to read as a map surface. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(var(--unseen) 1px, transparent 1px), linear-gradient(90deg, var(--unseen) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-2 text-center">
        <MapPin className="h-8 w-8 text-water" aria-hidden="true" />
        <p className="text-sm font-medium text-ink">Attention map</p>
        <p className="max-w-xs text-xs text-ink-muted">
          MapLibre + OpenStreetMap tiles render here. Use the list below to reach every site by keyboard.
        </p>
      </div>
    </div>
  );
}
