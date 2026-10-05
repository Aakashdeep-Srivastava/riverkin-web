/**
 * One-time generator for per-site satellite images.
 *
 * Site coordinates are FIXED, so a satellite image of a site is immutable static
 * data — baking it once beats rendering it live on every view (which bills an
 * Azure Maps transaction and ships a ~1.3 MB PNG each time). This script fetches
 * each site's image once via the deployed /maps/static endpoint, re-encodes it to
 * a compact JPEG, and writes public/sites/<id>.jpg. Those are then served from
 * our own origin: $0 ongoing Maps cost, ~10x smaller, same-site (no CORP).
 *
 * Run manually when the site list or the desired look changes:
 *   NEXT_PUBLIC_API_URL=<api-url> npm run gen:site-images
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const API =
  process.env.NEXT_PUBLIC_API_URL ??
  'https://ca-riverkin-api.proudsmoke-b6a86d41.centralindia.azurecontainerapps.io';

// Wide hero crop; zoom 15 frames the urban reach around the site.
const ZOOM = 15;
const REQ_W = 900;
const REQ_H = 450;
const JPEG_QUALITY = 72;

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'sites');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const sitesRes = await fetch(`${API}/api/v1/sites`);
  if (!sitesRes.ok) throw new Error(`GET /sites failed: ${sitesRes.status}`);
  const sites = await sitesRes.json();
  await mkdir(outDir, { recursive: true });

  let ok = 0;
  let skipped = 0;
  let bytes = 0;
  for (const s of sites) {
    if (typeof s.lat !== 'number' || typeof s.lng !== 'number') {
      skipped++;
      continue;
    }
    const url =
      `${API}/api/v1/maps/static?lat=${s.lat}&lng=${s.lng}` +
      `&zoom=${ZOOM}&w=${REQ_W}&h=${REQ_H}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`  skip ${s.id}: image ${res.status}`);
        skipped++;
        await sleep(200);
        continue;
      }
      const png = Buffer.from(await res.arrayBuffer());
      const jpg = await sharp(png).jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
      await writeFile(join(outDir, `${s.id}.jpg`), jpg);
      ok++;
      bytes += jpg.length;
      console.log(`  ${s.id}  ${(jpg.length / 1024).toFixed(0)} KB`);
    } catch (err) {
      console.warn(`  skip ${s.id}: ${err.message}`);
      skipped++;
    }
    // Be gentle on the API's per-IP rate limit; this is a one-time batch.
    await sleep(150);
  }
  console.log(
    `\nDone: ${ok} images, ${skipped} skipped, ${(bytes / 1024 / 1024).toFixed(1)} MB total ` +
      `(avg ${ok ? (bytes / ok / 1024).toFixed(0) : 0} KB).`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
