/**
 * Generate a shareable 9:16 campaign poster on a canvas — a real image a user
 * can download or share to Instagram/X (via the native share sheet with files).
 * Everything is drawn client-side (no network): background, brand, title, a QR
 * code of the /join link, and the "no account required" line.
 */
import QRCode from 'qrcode';

export interface PosterOptions {
  title: string;
  subtitle: string;
  joinUrl: string;
  /** Optional background image path (same-origin), else a brand gradient. */
  bg?: string;
  accent?: string;
}

const W = 1080;
const H = 1920;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
  const scale = Math.max(W / img.width, H / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function buildPoster(opts: PosterOptions): Promise<Blob> {
  const accent = opts.accent ?? '#1E7BFF';
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Best-effort load the brand font so canvas text matches the app.
  try {
    await (document as unknown as { fonts: FontFaceSet }).fonts.load('800 96px Inter');
    await (document as unknown as { fonts: FontFaceSet }).fonts.ready;
  } catch {
    /* fall back to system */
  }

  // --- Background ---
  if (opts.bg) {
    try {
      drawCover(ctx, await loadImage(opts.bg));
    } catch {
      /* fall through to gradient */
    }
  }
  if (!opts.bg) {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#0E4FA0');
    g.addColorStop(1, '#081628');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
  // Legibility overlay.
  const ov = ctx.createLinearGradient(0, 0, 0, H);
  ov.addColorStop(0, 'rgba(5,16,33,0.55)');
  ov.addColorStop(0.45, 'rgba(5,16,33,0.25)');
  ov.addColorStop(1, 'rgba(5,16,33,0.9)');
  ctx.fillStyle = ov;
  ctx.fillRect(0, 0, W, H);

  const fam = '"Inter", Arial, sans-serif';

  // --- Brand ---
  try {
    const logo = await loadImage('/logo.png');
    ctx.drawImage(logo, 70, 86, 76, 76);
  } catch {
    /* no logo */
  }
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 40px ${fam}`;
  ctx.textBaseline = 'middle';
  ctx.fillText('RIVERKIN', 162, 126);

  // --- Title ---
  ctx.font = `800 104px ${fam}`;
  const titleLines = wrap(ctx, opts.title.toUpperCase(), W - 140);
  let y = 760;
  for (const line of titleLines) {
    ctx.fillText(line, 70, y);
    y += 116;
  }
  // Accent swoosh under the title.
  ctx.strokeStyle = accent;
  ctx.lineWidth = 12;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(74, y - 40);
  ctx.bezierCurveTo(220, y - 70, 300, y - 10, 470, y - 40);
  ctx.stroke();

  // --- Subtitle ---
  ctx.font = `500 40px ${fam}`;
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  y += 40;
  for (const line of wrap(ctx, opts.subtitle, W - 160)) {
    ctx.fillText(line, 72, y);
    y += 56;
  }

  // --- Bottom card: QR + join ---
  const cardY = H - 420;
  ctx.fillStyle = 'rgba(255,255,255,0.97)';
  roundRect(ctx, 60, cardY, W - 120, 340, 36);
  ctx.fill();

  const qrDataUrl = await QRCode.toDataURL(opts.joinUrl, {
    margin: 1,
    width: 240,
    color: { dark: '#0A2A52', light: '#ffffff' },
  });
  const qr = await loadImage(qrDataUrl);
  ctx.drawImage(qr, 100, cardY + 50, 240, 240);

  ctx.fillStyle = '#0A2A52';
  ctx.font = `800 46px ${fam}`;
  ctx.fillText('Join as guest', 376, cardY + 108);
  ctx.fillStyle = '#5B6475';
  ctx.font = `500 32px ${fam}`;
  ctx.fillText('No account required · ~2 min', 376, cardY + 162);
  ctx.fillStyle = accent;
  ctx.font = `700 34px ${fam}`;
  ctx.fillText(opts.joinUrl.replace(/^https?:\/\//, ''), 376, cardY + 230);

  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/jpeg', 0.92),
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
