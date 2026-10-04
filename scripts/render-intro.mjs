/**
 * Render a Remotion composition to video (+ a still for quick QA).
 *
 *   node scripts/render-intro.mjs [compositionId]
 *
 * compositionId defaults to "RiverKinIntro" (the full self-contained scene).
 * Pass "RiverKinAtmosphere" to render just the transparent atmosphere layer.
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

const id = process.argv[2] || 'RiverKinIntro';

async function main() {
  await mkdir(outDir, { recursive: true });

  console.log('• ensuring headless browser…');
  await ensureBrowser();

  console.log('• bundling composition…');
  const serveUrl = await bundle({ entryPoint, publicDir });

  console.log(`• selecting "${id}"…`);
  const composition = await selectComposition({ serveUrl, id });

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
    onProgress: ({ progress }) => {
      process.stdout.write(`\r  ${Math.round(progress * 100)}%  `);
    },
  });

  console.log('\n✓ done');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
