'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, Upload, Check, MapPin, ShieldCheck, Sparkles, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { analyzePhoto, type PhotoAnalysis } from '@/lib/observations-api';
import { cueScanStart, cueAnalysisDone, haptic } from '@/lib/feedback';

type Status = 'idle' | 'starting' | 'live' | 'error' | 'captured';
type Phase = 'none' | 'scanning' | 'done' | 'retake';

export interface Capture {
  file: File;
  url: string;
  live: boolean;
}

export interface Geo {
  lat: number;
  lng: number;
}

const AI_FLAG = 0.6; // ai_generated_likelihood at/above this = "possibly AI-generated"

// The model reliably tags off-topic photos (a laptop, a room, a screen) with
// these; the numeric `relevance` is noisy, the tags are not. If any appears the
// photo is not of a river/stream and must be retaken.
const NEG_TAGS = new Set([
  'not_river', 'not_stream', 'not_water', 'unrelated', 'off_topic', 'offtopic',
  'indoor', 'screen', 'person', 'selfie',
]);

/** Does the analysis read as an actual river/stream scene (not a laptop, room, …)? */
function isRiverRelevant(a: PhotoAnalysis): boolean {
  const tags = (a.tags ?? []).map((t) => t.toLowerCase().trim());
  return !tags.some((t) => NEG_TAGS.has(t));
}

/** Corner HUD brackets + a sweeping scan line, shown while the model reads the photo. */
function ScanOverlay() {
  const corner = 'absolute h-5 w-5 border-white/85';
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="rk-scan-grid absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      <div
        className="rk-scan-line absolute inset-x-0 top-0"
        style={{
          background:
            'linear-gradient(180deg, transparent, color-mix(in srgb, var(--water) 60%, transparent) 50%, transparent)',
          boxShadow: '0 0 14px color-mix(in srgb, var(--water) 70%, transparent)',
        }}
      />
      <span className={`${corner} left-2 top-2 border-l-2 border-t-2`} />
      <span className={`${corner} right-2 top-2 border-r-2 border-t-2`} />
      <span className={`${corner} bottom-2 left-2 border-b-2 border-l-2`} />
      <span className={`${corner} bottom-2 right-2 border-b-2 border-r-2`} />
      <span className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2 text-xs font-semibold text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        Analyzing water…
      </span>
    </div>
  );
}

/** The real vision read, revealed after the scan. */
function ResultCard({ a }: { a: PhotoAnalysis }) {
  const ai = a.ai_generated_likelihood ?? 0;
  const aiFlag = ai >= AI_FLAG;
  const relevant = isRiverRelevant(a);
  const auth = a.authenticity ?? null;
  const tags = (a.tags ?? []).slice(0, 4);

  // Verdict priority: is it a river at all? → is it a real photo? → all good.
  const bad = !relevant || aiFlag;
  const title = !relevant
    ? 'Not a river or stream photo'
    : aiFlag
      ? 'Possible AI-generated image'
      : 'Looks like a genuine river photo';
  const note = !relevant ? 'Point the camera at the water and bank, then retake.' : null;

  return (
    <div className="rk-reveal space-y-3 rounded-card border border-unseen bg-surface p-3.5">
      <div className="flex items-center gap-2">
        {bad ? (
          <AlertTriangle className="h-5 w-5 shrink-0 text-[var(--urgent)]" aria-hidden="true" />
        ) : (
          <ShieldCheck className="h-5 w-5 shrink-0 text-success" aria-hidden="true" />
        )}
        <p className="text-[14px] font-bold" style={{ color: bad ? 'var(--urgent)' : 'var(--ink)' }}>
          {title}
        </p>
      </div>

      {note ? <p className="text-[13px] font-medium text-[var(--urgent)]">{note}</p> : null}
      {a.summary ? <p className="text-[13px] leading-relaxed text-ink-muted">{a.summary}</p> : null}

      {tags.length ? (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 rounded-full bg-[var(--action-tint)] px-2.5 py-1 text-[12px] font-medium text-[var(--action)]"
            >
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              {t}
            </span>
          ))}
        </div>
      ) : null}

      {auth !== null ? (
        <div>
          <div className="flex items-center justify-between text-[12px]">
            <span className="font-semibold uppercase tracking-wide text-ink-muted">Capture authenticity</span>
            <span className="font-bold tabular-nums text-ink">{auth}%</span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--unseen)_55%,transparent)]">
            <div
              className="rk-meter-fill h-full rounded-full"
              style={{
                width: `${auth}%`,
                background: bad ? 'var(--urgent)' : 'var(--success)',
              }}
            />
          </div>
        </div>
      ) : null}

      <p className="text-[11px] text-ink-muted">
        {a.used_model ? `Analysed by ${a.model ?? 'the vision model'}` : 'Heuristic analysis (model offline)'} ·
        AI asks, humans decide.
      </p>
    </div>
  );
}

/** Optional, consent-based GPS capture. */
function LocationRow({ geo, onAdd }: { geo: Geo | null; onAdd: () => void }) {
  if (geo) {
    return (
      <p className="flex items-center gap-1.5 text-[13px] font-medium text-success">
        <MapPin className="h-4 w-4" aria-hidden="true" />
        Location added (optional)
      </p>
    );
  }
  return (
    <Button variant="secondary" size="md" onClick={onAdd}>
      <MapPin className="h-4 w-4" aria-hidden="true" />
      Add GPS location (optional)
    </Button>
  );
}

/**
 * One photo step. Opens a live rear-camera preview (getUserMedia) with a shutter;
 * if the camera is unavailable or blocked it falls back to the native file picker.
 * The instant a photo is captured it runs a REAL vision scan (pollution signals +
 * AI-generation + authenticity) with a scanning animation, sound and haptic, then
 * reveals the result. GPS capture is a separate, optional, consent-based button.
 */
export function CameraCapture({
  label,
  hint,
  capture,
  onCapture,
  onRetake,
  geo = null,
  onAddLocation,
  onVerdict,
}: {
  label: string;
  hint: string;
  capture: Capture | null;
  onCapture: (c: Capture) => void;
  onRetake: () => void;
  geo?: Geo | null;
  onAddLocation?: () => void;
  /** Called with whether the captured photo is a usable river photo. false =
   *  off-topic/blurry (parent should block advancing); true = ok or unknown. */
  onVerdict?: (ok: boolean) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const analyzedRef = useRef<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [phase, setPhase] = useState<Phase>('none');
  const [analysis, setAnalysis] = useState<PhotoAnalysis | null>(null);

  function stop() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  // Track mount so an in-flight analysis never setState after unmount. A
  // persistent ref (not a per-effect flag) keeps the result applying correctly
  // even under React StrictMode's dev double-invoke. Also stops the camera stream.
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stop();
    };
  }, []);

  // Run the real scan the moment a photo is captured (once per capture.url).
  useEffect(() => {
    if (!capture) {
      analyzedRef.current = null;
      setPhase('none');
      setAnalysis(null);
      return;
    }
    if (analyzedRef.current === capture.url) return;
    analyzedRef.current = capture.url;
    const url = capture.url;
    setAnalysis(null);
    setPhase('scanning');
    cueScanStart();
    haptic(12);
    void analyzePhoto(capture.file, capture.live).then((res) => {
      // Ignore if unmounted or the capture changed (retake) while in flight.
      if (!mountedRef.current || analyzedRef.current !== url) return;
      if (!res) {
        // Analysis unavailable (offline / slow / API down) — keep the photo and
        // skip the result card; the check stays submittable (can't tell).
        setPhase('done');
        setAnalysis(null);
        onVerdict?.(true);
        return;
      }
      setAnalysis(res);
      if (res.ok === false) {
        // Blurry / unreadable — must retake.
        setPhase('retake');
        cueAnalysisDone(false);
        haptic([20, 40, 20]);
        onVerdict?.(false);
        return;
      }
      setPhase('done');
      const relevant = isRiverRelevant(res);
      const aiFlag = (res.ai_generated_likelihood ?? 0) >= AI_FLAG;
      const good = relevant && !aiFlag;
      cueAnalysisDone(good);
      haptic(good ? 16 : [20, 40, 20]);
      // Block advancing on an off-topic photo (a laptop, a room…); an AI-flag is
      // a warning the verifiers handle, so it doesn't hard-block.
      onVerdict?.(relevant);
    });
    // onVerdict is an inline prop; adding it would re-run analysis every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capture]);

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
      void import('@/lib/analytics').then((m) => m.track('camera_opened'));
    } catch {
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
        void import('@/lib/analytics').then((m) => m.track('photo_captured', { live: true }));
        onCapture({ file, url: URL.createObjectURL(blob), live: true });
      },
      'image/jpeg',
      0.85,
    );
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    stop();
    setStatus('captured');
    onCapture({ file, url: URL.createObjectURL(file), live: false });
  }

  function retake() {
    // Free the previous capture's object URL before discarding it (no leak).
    if (capture) {
      try {
        URL.revokeObjectURL(capture.url);
      } catch {
        /* already revoked */
      }
    }
    setStatus('idle');
    onRetake();
  }

  const frameClasses =
    'relative aspect-[4/5] w-full overflow-hidden rounded-card border border-unseen bg-[#0b1626]';

  // Captured — preview + live scan/result, retake, and the optional GPS control.
  if (capture) {
    const aiFlagged = (analysis?.ai_generated_likelihood ?? 0) >= AI_FLAG;
    return (
      <div className="space-y-3">
        {/* Screen-reader status for the scan (the overlay/result are visual). */}
        <p role="status" aria-live="polite" className="sr-only">
          {phase === 'scanning'
            ? 'Analyzing photo…'
            : phase === 'retake'
              ? analysis?.message ?? 'Photo needs retaking'
              : phase === 'done' && analysis && analysis.ok !== false
                ? `Analysis complete. ${aiFlagged ? 'Possible AI-generated image' : 'Looks genuine'}. Authenticity ${analysis.authenticity ?? 0} percent.`
                : ''}
        </p>
        <div className={frameClasses}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={capture.url} alt={`${label} capture`} className="h-full w-full object-cover" />
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-xs font-semibold text-white">
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            {capture.live ? 'Captured live' : 'Added'}
          </span>
          {phase === 'scanning' ? <ScanOverlay /> : null}
        </div>

        {phase === 'done' && analysis && analysis.ok !== false ? <ResultCard a={analysis} /> : null}

        {phase === 'retake' ? (
          <p className="flex items-start gap-2 rounded-card bg-[color-mix(in_srgb,var(--urgent)_10%,var(--surface))] px-3.5 py-2.5 text-[13px] text-[var(--urgent)]">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {analysis?.message ?? 'Photo looks blurry — retake it.'}
          </p>
        ) : null}

        <Button variant="secondary" size="md" onClick={retake}>
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Retake photo
        </Button>

        {onAddLocation ? <LocationRow geo={geo} onAdd={onAddLocation} /> : null}
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

      {onAddLocation ? <LocationRow geo={geo} onAdd={onAddLocation} /> : null}

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
