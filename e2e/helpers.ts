import { type Page } from '@playwright/test';

/**
 * Capture a photo in the field check without a real camera: generate a unique
 * noise JPEG in the browser and hand it to the current step's (hidden) file
 * input. Noise → high Laplacian variance (passes the blur gate); unique each
 * call → distinct pHash (passes the duplicate gate). Exercises the real upload,
 * processing, vision-analysis and authenticity path end to end.
 */
export async function capturePhoto(page: Page): Promise<void> {
  const input = page.locator('input[type="file"]').last();
  await input.evaluate(async (el) => {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext('2d')!;
    const img = ctx.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < img.data.length; i += 4) {
      img.data[i] = (Math.random() * 255) | 0;
      img.data[i + 1] = (Math.random() * 255) | 0;
      img.data[i + 2] = (Math.random() * 255) | 0;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], `shot-${Date.now()}-${Math.random()}.jpg`, { type: 'image/jpeg' });
    const dt = new DataTransfer();
    dt.items.add(file);
    const target = el as HTMLInputElement;
    target.files = dt.files;
    target.dispatchEvent(new Event('change', { bubbles: true }));
  });
}
