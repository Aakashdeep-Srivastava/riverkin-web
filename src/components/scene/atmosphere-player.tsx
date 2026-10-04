'use client';

import { Player } from '@remotion/player';
import { RiverKinComposition } from '@/remotion/RiverKinComposition';

/**
 * Embeds the Remotion atmosphere composition as a live, looping background
 * layer. Loaded via next/dynamic({ ssr: false }) by <RiverKinScene /> so
 * Remotion never enters the server bundle. Purely decorative — the host wraps
 * this in a pointer-events-none, aria-hidden container and only mounts it when
 * the viewer has NOT requested reduced motion.
 *
 * The 1080×1920 composition is scaled to cover its container; its elements are
 * soft gradients that fade before the edges, so any fit letterboxing is unseen.
 */
export default function AtmospherePlayer() {
  return (
    <div className="h-full w-full scale-[1.14]">
      <Player
        component={RiverKinComposition}
        durationInFrames={900}
        fps={30}
        compositionWidth={1080}
        compositionHeight={1920}
        loop
        autoPlay
        controls={false}
        clickToPlay={false}
        doubleClickToFullscreen={false}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
