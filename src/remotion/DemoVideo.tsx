/**
 * RiverKinDemo — an ~80 s product-demo video (1920×1080) built from the real
 * app screenshots in public/demo. Data-driven: each entry in SCENES renders as
 * a brand / text / feature / close scene with a phone mockup, kinetic caption,
 * continuous animated background, watermark and progress bar. Render with:
 *   npm run render:intro RiverKinDemo
 */
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const FONT = 'Inter, "Helvetica Neue", Arial, sans-serif';
const ACCENT = '#4ea6ff';
const GREEN = '#2FA36B';

type Scene =
  | { kind: 'brand'; title: string; sub: string; dur: number }
  | { kind: 'text'; eyebrow: string; title: string; sub: string; dur: number }
  | { kind: 'feature'; img: string; eyebrow: string; title: string; sub: string; dur: number }
  | { kind: 'close'; title: string; sub: string; dur: number };

// Per-scene durations are matched to the narration-clip lengths (public/demo/vo/sN.mp3).
const SCENES: Scene[] = [
  { kind: 'brand', title: 'RiverKin', sub: 'Citizen science for Europe’s urban rivers', dur: 168 },
  {
    kind: 'text',
    eyebrow: 'THE PROBLEM',
    title: '106 urban streams.\nBarely monitored.',
    sub: 'Experts are few. Citizens are everywhere.',
    dur: 200,
  },
  {
    kind: 'feature',
    img: 'entry.png',
    eyebrow: '01 · OPEN',
    title: 'Open to a living map',
    sub: 'Guest-first — no account to start',
    dur: 175,
  },
  {
    kind: 'feature',
    img: 'dashboard.png',
    eyebrow: '02 · NOTICE',
    title: 'Find where the river needs you',
    sub: '106 real OneAquaHealth sites, ranked by need · live data',
    dur: 205,
  },
  {
    kind: 'feature',
    img: 'menu.png',
    eyebrow: '03 · NAVIGATE',
    title: 'One app, every screen',
    sub: 'Map · Missions · Learn · Community · Rewards · Impact',
    dur: 231,
  },
  {
    kind: 'feature',
    img: 'check.png',
    eyebrow: '04 · ACT',
    title: 'A five-minute field check',
    sub: 'One question per screen · live camera · works offline',
    dur: 208,
  },
  {
    kind: 'feature',
    img: 'receipt.png',
    eyebrow: '05 · AI + IMPACT',
    title: 'The AI reads it. You decide.',
    sub: 'GPT-4o-mini vision → FHIR R4 research data · the gap is closed',
    dur: 438,
  },
  {
    kind: 'feature',
    img: 'challenges.png',
    eyebrow: '06 · RETURN',
    title: 'Join challenges. Bring your crew.',
    sub: 'Run for the River · no account needed',
    dur: 200,
  },
  {
    kind: 'feature',
    img: 'share.png',
    eyebrow: '07 · GROW',
    title: 'Share a card. Scan to join.',
    sub: 'Pseudonymous referrals · a real growth loop',
    dur: 214,
  },
  { kind: 'close', title: 'Find where the river needs you.', sub: 'riverkin.online', dur: 239 },
];

export const DEMO_TOTAL = SCENES.reduce((n, s) => n + s.dur, 0);

/** Continuous animated backdrop (navy → deep water with a drifting glow). */
function Background() {
  const frame = useCurrentFrame();
  const gx = 50 + Math.sin(frame / 120) * 18;
  const gy = 35 + Math.cos(frame / 150) * 12;
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(140deg, #103a6e 0%, #081628 55%, #050f21 100%)' }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(40% 40% at ${gx}% ${gy}%, rgba(78,166,255,0.22), transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(35% 35% at ${100 - gx}% ${80 - gy}%, rgba(47,163,107,0.14), transparent 70%)`,
        }}
      />
    </AbsoluteFill>
  );
}

function Watermark() {
  return (
    <div style={{ position: 'absolute', top: 44, left: 56, display: 'flex', alignItems: 'center', gap: 14, zIndex: 20 }}>
      <Img src={staticFile('logo.png')} style={{ width: 46, height: 46, objectFit: 'contain' }} />
      <span style={{ fontFamily: FONT, fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: 2 }}>RIVERKIN</span>
    </div>
  );
}

function ProgressBar() {
  const frame = useCurrentFrame();
  const pct = Math.min(1, frame / DEMO_TOTAL);
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 6, background: 'rgba(255,255,255,0.1)', zIndex: 20 }}>
      <div style={{ width: `${pct * 100}%`, height: '100%', background: `linear-gradient(90deg, ${ACCENT}, ${GREEN})` }} />
    </div>
  );
}

/** Scene-local fade (in/out) helper. */
function useFade() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return interpolate(
    frame,
    [0, 16, durationInFrames - 16, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
}

function PhoneFrame({ img }: { img: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 30 });
  const x = interpolate(enter, [0, 1], [-80, 0]);
  const kb = 1.04 + (frame / 600) * 0.06; // slow Ken Burns
  return (
    <div
      style={{
        transform: `translateX(${x}px)`,
        width: 452,
        height: 920,
        borderRadius: 54,
        padding: 12,
        background: 'linear-gradient(160deg, #1b2b45, #0b1626)',
        boxShadow: '0 40px 90px rgba(0,0,0,0.55), inset 0 0 0 2px rgba(255,255,255,0.06)',
        overflow: 'hidden',
      }}
    >
      <div style={{ width: '100%', height: '100%', borderRadius: 42, overflow: 'hidden', background: '#000' }}>
        <Img
          src={staticFile(`demo/${img}`)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', transform: `scale(${kb})` }}
        />
      </div>
    </div>
  );
}

function Caption({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 32 });
  const y = interpolate(s, [0, 1], [34, 0]);
  return (
    <div style={{ transform: `translateY(${y}px)`, maxWidth: 820 }}>
      {eyebrow ? (
        <p style={{ fontFamily: FONT, fontSize: 24, fontWeight: 800, letterSpacing: 4, color: ACCENT, margin: 0 }}>
          {eyebrow}
        </p>
      ) : null}
      <h1
        style={{
          fontFamily: FONT,
          fontSize: 76,
          lineHeight: 1.05,
          fontWeight: 800,
          color: '#fff',
          margin: '18px 0 0',
          whiteSpace: 'pre-line',
          textShadow: '0 4px 24px rgba(0,0,0,0.5)',
        }}
      >
        {title}
      </h1>
      <p style={{ fontFamily: FONT, fontSize: 32, lineHeight: 1.35, color: 'rgba(255,255,255,0.82)', margin: '24px 0 0' }}>
        {sub}
      </p>
    </div>
  );
}

function BrandScene({ title, sub }: { title: string; sub: string }) {
  const fade = useFade();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 36 });
  return (
    <AbsoluteFill style={{ opacity: fade, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <div style={{ transform: `scale(${interpolate(pop, [0, 1], [0.8, 1])})` }}>
        <Img src={staticFile('logo.png')} style={{ width: 200, height: 200, objectFit: 'contain' }} />
      </div>
      <h1 style={{ fontFamily: FONT, fontSize: 118, fontWeight: 800, color: '#fff', letterSpacing: 6, margin: '28px 0 0' }}>
        {title.toUpperCase()}
      </h1>
      <p style={{ fontFamily: FONT, fontSize: 36, color: 'rgba(255,255,255,0.85)', margin: '16px 0 0' }}>{sub}</p>
    </AbsoluteFill>
  );
}

function CloseScene({ title, sub }: { title: string; sub: string }) {
  const fade = useFade();
  return (
    <AbsoluteFill style={{ opacity: fade, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <Img src={staticFile('logo.png')} style={{ width: 150, height: 150, objectFit: 'contain' }} />
      <h1 style={{ fontFamily: FONT, fontSize: 82, fontWeight: 800, color: '#fff', textAlign: 'center', margin: '28px 60px 0', lineHeight: 1.1 }}>
        {title}
      </h1>
      <p style={{ fontFamily: FONT, fontSize: 40, fontWeight: 700, color: ACCENT, margin: '22px 0 0' }}>{sub}</p>
    </AbsoluteFill>
  );
}

function TextScene({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  const fade = useFade();
  return (
    <AbsoluteFill style={{ opacity: fade, alignItems: 'center', justifyContent: 'center', padding: '0 140px' }}>
      <Caption eyebrow={eyebrow} title={title} sub={sub} />
    </AbsoluteFill>
  );
}

function FeatureScene({ img, eyebrow, title, sub }: { img: string; eyebrow: string; title: string; sub: string }) {
  const fade = useFade();
  return (
    <AbsoluteFill style={{ opacity: fade, flexDirection: 'row', alignItems: 'center', padding: '0 120px', gap: 90 }}>
      <PhoneFrame img={img} />
      <Caption eyebrow={eyebrow} title={title} sub={sub} />
    </AbsoluteFill>
  );
}

function SceneView({ scene }: { scene: Scene }) {
  switch (scene.kind) {
    case 'brand':
      return <BrandScene title={scene.title} sub={scene.sub} />;
    case 'close':
      return <CloseScene title={scene.title} sub={scene.sub} />;
    case 'text':
      return <TextScene eyebrow={scene.eyebrow} title={scene.title} sub={scene.sub} />;
    case 'feature':
      return <FeatureScene img={scene.img} eyebrow={scene.eyebrow} title={scene.title} sub={scene.sub} />;
  }
}

export const DemoVideo: React.FC = () => {
  let at = 0;
  return (
    <AbsoluteFill style={{ background: '#05101f' }}>
      <Background />
      {SCENES.map((scene, i) => {
        const from = at;
        at += scene.dur;
        return (
          <Sequence key={i} from={from} durationInFrames={scene.dur}>
            <SceneView scene={scene} />
            <Audio src={staticFile(`demo/vo/s${i}.mp3`)} />
          </Sequence>
        );
      })}
      <Watermark />
      <ProgressBar />
    </AbsoluteFill>
  );
};
