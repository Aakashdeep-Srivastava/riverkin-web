/**
 * Remotion root — registers the compositions available to the renderer/Studio.
 * The <Player> on the welcome screen does NOT use this (it references the
 * component directly); this is only the entry point for rendering to video
 * (scripts/render-intro.mjs) and for `npx remotion studio`.
 */
import { Composition } from 'remotion';
import { RiverKinComposition } from './RiverKinComposition';
import { RiverKinIntroFull } from './RiverKinIntroFull';
import { DemoVideo, DEMO_TOTAL } from './DemoVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ~80 s product-demo video (landscape) built from real app screenshots. */}
      <Composition
        id="RiverKinDemo"
        component={DemoVideo}
        durationInFrames={DEMO_TOTAL}
        fps={30}
        width={1920}
        height={1080}
      />
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
