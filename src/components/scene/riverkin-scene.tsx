'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

/**
 * RiverKinScene — the layered cinematic background for the welcome screen.
 *
 *   geography   →  painted Earth→river composite (default, reliable, cohesive)
 *                  OR the live MapLibre satellite globe (opt-in: ?live=globe)
 *   atmosphere  →  Remotion composition (sun, light rays, clouds, haze, motes)
 *   blend       →  CSS gradients that fuse the layers into one environment
 *
 * All layers are decorative (pointer-events-none, aria-hidden). The Remotion
 * atmosphere and the Ken Burns drift are disabled under prefers-reduced-motion.
 * The host renders the UI (logo, hero copy, buttons) above this at z-10.
 */

// Remotion Player — client-only, kept out of the server bundle.
const AtmospherePlayer = dynamic(() => import('@/components/scene/atmosphere-player'), {
  ssr: false,
});

// The live satellite globe (opt-in). Reuses the proven home-map component,
// which token-auths its tiles and falls back to a WebGL orb if unavailable.
const GlobeMap = dynamic(() => import('@/components/globe-map'), { ssr: false });

export function RiverKinScene() {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [liveGlobe, setLiveGlobe] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);

    // Opt-in live globe for side-by-side comparison: /welcome?live=globe
    const params = new URLSearchParams(window.location.search);
    setLiveGlobe(params.get('live') === 'globe');

    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* --- Geography layer --- */}
      {liveGlobe ? (
        <div className="absolute inset-0 pointer-events-auto">
          <GlobeMap />
        </div>
      ) : (
        <div
          className={`absolute inset-0 bg-cover bg-center ${reducedMotion ? '' : 'rk-kenburns'}`}
          style={{ backgroundImage: 'url(/hero-bg.jpg)' }}
        />
      )}

      {/* --- Cinematic atmosphere layer (Remotion) --- */}
      {mounted && !reducedMotion ? (
        <div className="absolute inset-0 opacity-90">
          <AtmospherePlayer />
        </div>
      ) : null}

      {/* --- Blend layer: fuse everything + guarantee copy readability --- */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 70% at 50% 30%, rgba(5,16,33,0) 42%, rgba(5,16,33,0.18) 72%, rgba(5,16,33,0.5) 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(5,16,33,0) 38%, rgba(5,16,33,0.34) 62%, rgba(5,16,33,0.66) 100%)',
        }}
      />
    </div>
  );
}
