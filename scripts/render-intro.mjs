/**
 * Render a Remotion composition to video (+ a still for quick QA).
 *
 *   node scripts/render-intro.mjs [compositionId] [--social]
 *
 * compositionId defaults to "RiverKinIntro" (the full self-contained scene).
 * Pass "RiverKinAtmosphere" to render just the transparent atmosphere layer.
 *
 * Variants:
 *   (default)  pitch-quality H.264 MP4 (crf 18) + a QA still — for the deck.
 *   --social   a lighter, share-ready pair alongside the pitch MP4: a VP9 WebM
 *              (crf 34) and a compressed H.264 MP4 (crf 30), both scaled to 0.8,
 *              named <id>-social.webm / <id>-social.mp4. The portrait
 *              RiverKinIntro (1080×1920) is already 9:16 for Reels/Stories/TikTok.
 *
 * Output lands in design/marketing/ (git-ignored, not deployed). This is the
 * "one visual engine → web AND video" payoff: the exact same scene that runs
 * live on the welcome screen is exported here for socials / the pitch deck.
 */
import { bundle } from '@remotion/bundler';
import { ensureBrowser, selectComposition, renderMedia, renderStill } from '@remotion/renderer';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const entryPoint = path.join(root, 'src/remotion/index.ts');
const publicDir = path.join(root, 'public');
const outDir = path.join(root, 'design/marketing');

const argv = process.argv.slice(2);
const social = argv.includes('--social') || argv.includes('--variant=social');
const id = argv.find((a) => !a.startsWith('--')) || 'RiverKinIntro';

const onProgress = ({ progress }) => {
  process.stdout.write(`\r  ${Math.round(progress * 100)}%  `);
};

async function main() {
  await mkdir(outDir, { recursive: true });

  console.log('• ensuring headless browser…');
  await ensureBrowser();

  console.log('• bundling composition…');
  const serveUrl = await bundle({ entryPoint, publicDir });

  console.log(`• selecting "${id}"…`);
  const composition = await selectComposition({ serveUrl, id });

  if (social) {
    // Share-ready, lighter encodes for socials (kept separate from the pitch MP4).
    const webmOut = path.join(outDir, `${id}-social.webm`);
    console.log(`• rendering social WebM (VP9) → ${path.relative(root, webmOut)}`);
    await renderMedia({
      serveUrl,
      composition,
      codec: 'vp9',
      crf: 34,
      scale: 0.8,
      outputLocation: webmOut,
      onProgress,
    });

    const mp4Out = path.join(outDir, `${id}-social.mp4`);
    console.log(`\n• rendering social MP4 (H.264, compressed) → ${path.relative(root, mp4Out)}`);
    await renderMedia({
      serveUrl,
      composition,
      codec: 'h264',
      crf: 30,
      scale: 0.8,
      outputLocation: mp4Out,
      onProgress,
    });

    console.log('\n✓ done (social)');
    return;
  }

  const stillOut = path.join(outDir, `${id}-frame.png`);
  console.log(`• rendering QA still → ${path.relative(root, stillOut)}`);
  await renderStill({ serveUrl, composition, frame: 180, output: stillOut });

  const videoOut = path.join(outDir, `${id}.mp4`);
  console.log(`• rendering video → ${path.relative(root, videoOut)}`);
  await renderMedia({
    serveUrl,
    composition,
    codec: 'h264',
    crf: 18,
    outputLocation: videoOut,
    onProgress,
  });

  console.log('\n✓ done');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
