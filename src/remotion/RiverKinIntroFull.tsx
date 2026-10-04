/**
 * RiverKinIntroFull — the self-contained marketing/export composition.
 *
 * Same cinematic scene as the live welcome background, but baked into one frame
 * so it renders to a standalone MP4/WebM: the painted Earth→river base with a
 * slow Ken Burns move, the RiverKinComposition atmosphere on top, and the blend
 * gradients. No text — leave room to overlay a wordmark in an editor, or reuse
 * as-is as a looping hero clip. This is the "one visual engine → web AND video"
 * payoff of building the scene in Remotion.
 */
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { RiverKinComposition } from './RiverKinComposition';

export const RiverKinIntroFull: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Gentle Ken Burns: scale 1.06 → 1.12 with a slight downward drift, eased by
  // a cosine so the loop point is seamless (start ≈ end velocity).
  const t = (1 - Math.cos((frame / durationInFrames) * Math.PI * 2)) / 2; // 0→1→0
  const scale = 1.06 + t * 0.06;
  const ty = -t * 2; // percent

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a1a30', overflow: 'hidden' }}>
      <Img
        src={staticFile('hero-bg.jpg')}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale}) translateY(${ty}%)`,
          willChange: 'transform',
        }}
      />

      <RiverKinComposition />

      {/* Blend layer — matches the web scene. */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(120% 70% at 50% 30%, rgba(5,16,33,0) 42%, rgba(5,16,33,0.18) 72%, rgba(5,16,33,0.5) 100%)',
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(5,16,33,0) 38%, rgba(5,16,33,0.3) 64%, rgba(5,16,33,0.6) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
