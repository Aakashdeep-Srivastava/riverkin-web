/**
 * Remotion root — registers the compositions available to the renderer/Studio.
 * The <Player> on the welcome screen does NOT use this (it references the
 * component directly); this is only the entry point for rendering to video
 * (scripts/render-intro.mjs) and for `npx remotion studio`.
 */
import { Composition } from 'remotion';
import { RiverKinComposition } from './RiverKinComposition';
import { RiverKinIntroFull } from './RiverKinIntroFull';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Full self-contained scene for marketing/export. */}
      <Composition
        id="RiverKinIntro"
        component={RiverKinIntroFull}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* Transparent atmosphere layer only (the web background). */}
      <Composition
        id="RiverKinAtmosphere"
        component={RiverKinComposition}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
