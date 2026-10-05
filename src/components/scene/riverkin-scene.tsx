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

// The live satellite globe (opt-in) with the flowing river-monitoring network.
// Token-auths its tiles and falls back to a WebGL orb if unavailable. Separate
// from the home map so that critical screen is untouched.
const LoginGlobe = dynamic(() => import('@/components/scene/login-globe'), { ssr: false });

export function RiverKinScene() {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [liveGlobe, setLiveGlobe] = useState(false);
  // The Remotion atmosphere is heavy (a looping GPU-composited player). Defer it
  // to browser idle time so the hero copy + background paint first and the screen
  // feels instant; the cinematic layer fades in a beat later.
  const [atmosphereReady, setAtmosphereReady] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);

    // Opt-in live globe for side-by-side comparison: /welcome?live=globe
    const params = new URLSearchParams(window.location.search);
    setLiveGlobe(params.get('live') === 'globe');

    const hasIdle = typeof window.requestIdleCallback === 'function';
    const idle = hasIdle
      ? window.requestIdleCallback(() => setAtmosphereReady(true), { timeout: 2000 })
      : window.setTimeout(() => setAtmosphereReady(true), 800);

    return () => {
      mq.removeEventListener('change', onChange);
      if (hasIdle) window.cancelIdleCallback(idle as number);
      else window.clearTimeout(idle as number);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* --- Geography layer --- */}
      {liveGlobe ? (
        <div className="absolute inset-0">
          <LoginGlobe />
        </div>
      ) : (
        <div
          className={`absolute inset-0 bg-cover bg-center ${reducedMotion ? '' : 'rk-kenburns'}`}
          style={{ backgroundImage: 'url(/hero-bg.jpg)' }}
        />
      )}

      {/* --- Cinematic atmosphere layer (Remotion, deferred to idle) --- */}
      {mounted && atmosphereReady && !reducedMotion ? (
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
