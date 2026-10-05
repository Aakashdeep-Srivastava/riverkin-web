'use client';

import { useState } from 'react';
import { Image as ImageIcon, Download, Share2, X, Loader2 } from 'lucide-react';
import { buildPoster } from '@/lib/share-poster';

interface Props {
  title: string;
  subtitle: string;
  joinUrl: string;
  bg?: string;
  accent?: string;
  /** Render style: full-width button (default) or a compact icon chip. */
  variant?: 'button' | 'chip';
  label?: string;
}

const SHARE_TEXT = 'Join me on RiverKin — help keep our rivers seen. No account needed.';

/**
 * Generates a 9:16 campaign poster (image + QR of the /join link) and lets the
 * user share it to Instagram/X via the native share sheet, or download it. The
 * poster is a real image, so it works where plain-link sharing doesn't.
 */
export function SharePosterButton({ title, subtitle, joinUrl, bg, accent, variant = 'button', label }: Props) {
  const [busy, setBusy] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  async function make() {
    setBusy(true);
    try {
      const b = await buildPoster({ title, subtitle, joinUrl, bg, accent });
      setBlob(b);
      setPreview(URL.createObjectURL(b));
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  }

  function close() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setBlob(null);
  }

  async function share() {
    if (!blob) return;
    const file = new File([blob], 'riverkin-invite.jpg', { type: 'image/jpeg' });
    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
    if (nav.canShare && nav.canShare({ files: [file] }) && navigator.share) {
      try {
        await navigator.share({ files: [file], title: 'RiverKin', text: `${SHARE_TEXT} ${joinUrl}` });
        return;
      } catch {
        /* cancelled — fall through to download */
      }
    }
    download();
  }

  function download() {
    if (!preview) return;
    const a = document.createElement('a');
    a.href = preview;
    a.download = 'riverkin-invite.jpg';
    a.click();
  }

  return (
    <>
      {variant === 'chip' ? (
        <button
          type="button"
          onClick={make}
          disabled={busy}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink shadow"
          aria-label="Create a share card"
        >
          {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Share2 className="h-5 w-5" />}
        </button>
      ) : (
        <button
          type="button"
          onClick={make}
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-[var(--action)]/30 bg-surface px-4 py-3 text-[14px] font-bold text-[var(--action)] disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImageIcon className="h-5 w-5" />}
          {label ?? 'Create a share card'}
        </button>
      )}

      {preview ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4" onClick={close}>
          <div
            className="flex max-h-[92dvh] w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-surface"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-[15px] font-bold text-ink">Your share card</p>
              <button type="button" onClick={close} aria-label="Close" className="text-ink-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="RiverKin share card" className="mx-auto w-full max-w-[280px] rounded-xl" />
            </div>
            <div className="flex gap-2 p-4">
              <button
                type="button"
                onClick={share}
                className="flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-[14px] font-bold text-white"
                style={{ background: 'linear-gradient(90deg, #1E7BFF 0%, #0052FF 100%)' }}
              >
                <Share2 className="h-5 w-5" /> Share
              </button>
              <button
                type="button"
                onClick={download}
                className="flex items-center justify-center gap-2 rounded-full border border-unseen bg-surface px-4 py-3 text-[14px] font-bold text-ink"
              >
                <Download className="h-5 w-5" /> Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
