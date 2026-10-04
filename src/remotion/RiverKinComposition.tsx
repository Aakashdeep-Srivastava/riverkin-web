/**
 * RiverKinComposition — the cinematic *atmosphere* layer.
 *
 * This is a Remotion composition, not a map and not UI. It renders only soft,
 * transparent atmosphere — a sun glow, slow light-ray sweep, three parallax
 * cloud bands, a drifting haze belt, and fine rising motes — designed to sit
 * ON TOP of the painted Earth→river base (or the live MapLibre globe) and give
 * the scene depth and motion.
 *
 * Everything is driven by useCurrentFrame via sin/cos, so the motion loops
 * perfectly regardless of durationInFrames and never jumps. Only GPU-friendly
 * transforms + opacity are used (no canvas, no video decode) so it stays smooth
 * on low-end phones. The whole thing is purely decorative (pointer-events:none,
 * aria-hidden applied by the host) and is paused by the host under
 * prefers-reduced-motion.
 *
 * Bonus: because the scene is a real Remotion composition, the exact same
 * visuals can later be rendered to MP4/WebM for the pitch deck / socials.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { CSSProperties } from 'react';

const TAU = Math.PI * 2;

/** A single soft cloud puff: a blurred white radial blob. */
function Puff({
  left,
  top,
  w,
  h,
  opacity,
}: {
  left: string;
  top: string;
  w: number;
  h: number;
  opacity: number;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: w,
        height: h,
        opacity,
        background:
          'radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.45) 38%, rgba(255,255,255,0) 72%)',
        filter: 'blur(14px)',
        borderRadius: '50%',
      }}
    />
  );
}

/** One parallax cloud band. Two identical halves wrap seamlessly. */
function CloudBand({
  y,
  pxPerFrame,
  scale,
  opacity,
  bobAmp,
  bobSpeed,
}: {
  y: string;
  pxPerFrame: number;
  scale: number;
  opacity: number;
  bobAmp: number;
  bobSpeed: number;
}) {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  // Seamless horizontal wrap: translate one half-width, then reset.
  const shift = -((frame * pxPerFrame) % width);
  const bob = Math.sin((frame * bobSpeed) / 100) * bobAmp;

  const half: CSSProperties = {
    position: 'absolute',
    top: 0,
    width,
    height: '100%',
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: y,
        width: width * 2,
        height: 320 * scale,
        opacity,
        transform: `translate3d(${shift}px, ${bob}px, 0)`,
        mixBlendMode: 'screen',
        willChange: 'transform',
      }}
    >
      {[0, 1].map((copy) => (
        <div key={copy} style={{ ...half, left: copy * width }}>
          <Puff left="4%" top="18%" w={260 * scale} h={150 * scale} opacity={0.9} />
          <Puff left="22%" top="46%" w={200 * scale} h={120 * scale} opacity={0.7} />
          <Puff left="40%" top="8%" w={320 * scale} h={170 * scale} opacity={0.95} />
          <Puff left="62%" top="40%" w={240 * scale} h={140 * scale} opacity={0.75} />
          <Puff left="80%" top="20%" w={300 * scale} h={160 * scale} opacity={0.88} />
        </div>
      ))}
    </div>
  );
}

export const RiverKinComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Sun breathes: gentle opacity + scale pulse.
  const sunPulse = (Math.sin((frame / 90) * TAU) + 1) / 2; // 0..1
  const sunOpacity = 0.55 + sunPulse * 0.25;
  const sunScale = 1 + sunPulse * 0.06;

  // Light rays sweep very slowly.
  const rayRotate = (frame * 0.08) % 360;
  const rayOpacity = 0.1 + sunPulse * 0.06;

  // Haze belt drifts laterally.
  const hazeShift = Math.sin((frame / 200) * TAU) * 40;

  // Fine rising motes — deterministic per index, seamless via modulo.
  const MOTES = 14;
  const motes = Array.from({ length: MOTES }, (_, i) => {
    const seed = (i * 97.13) % 100;
    const baseX = (seed / 100) * width;
    const period = 360 + (i % 5) * 40; // frames to rise full height
    const prog = ((frame + i * 53) % period) / period; // 0..1
    const yPos = height * (1 - prog); // rises bottom→top
    const sway = Math.sin((frame / 60) + i) * 18;
    const size = 2 + (i % 4);
    const twinkle = (Math.sin((frame / 22) + i * 1.7) + 1) / 2;
    const opacity = (0.25 + twinkle * 0.45) * (1 - Math.abs(prog - 0.5) * 0.6);
    return { x: baseX + sway, y: yPos, size, opacity };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', overflow: 'hidden' }}>
      {/* Sun glow — upper-right, matching the painted sunrise. */}
      <div
        style={{
          position: 'absolute',
          right: '-6%',
          top: '-8%',
          width: width * 0.9,
          height: width * 0.9,
          opacity: sunOpacity,
          transform: `scale(${sunScale})`,
          transformOrigin: '70% 30%',
          background:
            'radial-gradient(42% 42% at 72% 28%, rgba(255,241,204,0.95) 0%, rgba(255,214,140,0.5) 32%, rgba(255,190,110,0) 66%)',
          mixBlendMode: 'screen',
          willChange: 'transform, opacity',
        }}
      />

      {/* Light rays sweeping from the sun. */}
      <div
        style={{
          position: 'absolute',
          right: '-20%',
          top: '-25%',
          width: width * 1.4,
          height: width * 1.4,
          opacity: rayOpacity,
          transform: `rotate(${rayRotate}deg)`,
          transformOrigin: '62% 30%',
          background:
            'repeating-conic-gradient(from 0deg at 62% 30%, rgba(255,240,205,0.5) 0deg 2deg, rgba(255,240,205,0) 2deg 16deg)',
          WebkitMaskImage:
            'radial-gradient(45% 45% at 62% 30%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 70%)',
          maskImage:
            'radial-gradient(45% 45% at 62% 30%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 70%)',
          mixBlendMode: 'screen',
          willChange: 'transform',
        }}
      />

      {/* Three parallax cloud bands (far → near). */}
      <CloudBand y="4%" pxPerFrame={0.14} scale={0.8} opacity={0.35} bobAmp={5} bobSpeed={0.8} />
      <CloudBand y="18%" pxPerFrame={0.26} scale={1.05} opacity={0.5} bobAmp={8} bobSpeed={1.1} />
      <CloudBand y="34%" pxPerFrame={0.44} scale={1.35} opacity={0.42} bobAmp={11} bobSpeed={1.4} />

      {/* Atmospheric haze belt — the globe→river dissolve zone. */}
      <div
        style={{
          position: 'absolute',
          left: '-10%',
          top: '46%',
          width: '120%',
          height: '26%',
          transform: `translateX(${hazeShift}px)`,
          background:
            'linear-gradient(180deg, rgba(190,214,236,0) 0%, rgba(190,214,236,0.22) 45%, rgba(190,214,236,0) 100%)',
          filter: 'blur(26px)',
          mixBlendMode: 'screen',
          willChange: 'transform',
        }}
      />

      {/* Fine rising motes. */}
      {motes.map((m, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: m.x,
            top: m.y,
            width: m.size,
            height: m.size,
            borderRadius: '50%',
            background: 'rgba(255,248,225,0.95)',
            opacity: m.opacity,
            boxShadow: '0 0 6px rgba(255,236,190,0.8)',
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
