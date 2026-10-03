'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, Upload, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Status = 'idle' | 'starting' | 'live' | 'error' | 'captured';

export interface Capture {
  file: File;
  url: string;
  live: boolean;
}

/**
 * One photo step. Opens a live rear-camera preview (getUserMedia) with a shutter;
 * if the camera is unavailable or blocked (desktop, denied permission, insecure
 * context) it falls back to the native file picker / OS camera. Captured frames
 * are returned as a JPEG File plus an object-URL preview, with a `live` flag that
 * feeds the backend's capture-authenticity score.
 */
export function CameraCapture({
  label,
  hint,
  capture,
  onCapture,
  onRetake,
}: {
  label: string;
  hint: string;
  capture: Capture | null;
  onCapture: (c: Capture) => void;
  onRetake: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>('idle');

  function stop() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  useEffect(() => stop, []);

  async function startCamera() {
    setStatus('starting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus('live');
    } catch {
      // No camera / denied / insecure context → use the file fallback.
      setStatus('error');
    }
  }

  function shoot() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `${label.toLowerCase()}.jpg`, { type: 'image/jpeg' });
        stop();
        setStatus('captured');
        onCapture({ file, url: URL.createObjectURL(blob), live: true });
      },
      'image/jpeg',
      0.85,
    );
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus('captured');
    onCapture({ file, url: URL.createObjectURL(file), live: false });
  }

  function retake() {
    setStatus('idle');
    onRetake();
  }

  const frameClasses =
    'relative aspect-video w-full overflow-hidden rounded-card border border-unseen bg-[#0b1626]';

  // Captured — show the preview with a retake control.
  if (capture) {
    return (
      <div className="space-y-3">
        <div className={frameClasses}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={capture.url} alt={`${label} capture`} className="h-full w-full object-cover" />
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-xs font-semibold text-white">
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            {capture.live ? 'Captured live' : 'Added'}
          </span>
        </div>
        <Button variant="secondary" size="md" onClick={retake}>
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Retake photo
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className={frameClasses}>
        <video
          ref={videoRef}
          playsInline
          muted
          className={`h-full w-full object-cover ${status === 'live' ? '' : 'hidden'}`}
        />
        {status !== 'live' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-white/80">
            <Camera className="h-8 w-8" aria-hidden="true" />
            <span className="text-sm">{hint}</span>
          </div>
        ) : null}
      </div>

      {status === 'live' ? (
        <Button size="md" onClick={shoot}>
          <Camera className="h-4 w-4" aria-hidden="true" />
          Capture photo
        </Button>
      ) : status === 'error' ? (
        <>
          <p className="text-sm text-ink-muted">
            Camera unavailable — add a photo from your device instead.
          </p>
          <Button variant="secondary" size="md" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" aria-hidden="true" />
            Choose photo
          </Button>
        </>
      ) : (
        <div className="flex gap-3">
          <Button size="md" onClick={startCamera} disabled={status === 'starting'}>
            <Camera className="h-4 w-4" aria-hidden="true" />
            {status === 'starting' ? 'Opening camera…' : 'Open camera'}
          </Button>
          <Button variant="secondary" size="md" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" aria-hidden="true" />
            Upload
          </Button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onFile}
        className="hidden"
      />
    </div>
  );
}
