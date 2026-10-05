/**
 * Tiny sound + haptic feedback, synthesized with the Web Audio API so we ship no
 * audio files. Used for the photo-analysis scan: a soft blip when the scan starts
 * and a short rising chime (or a lower "heads-up" pair) when it completes. The
 * AudioContext is created lazily on first use — always triggered by a tap, so
 * autoplay policies are satisfied. All of this is best-effort and silently no-ops
 * where unsupported.
 */

let ctx: AudioContext | null = null;

function audioCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, startAt: number, dur: number, gain = 0.05): void {
  const ac = audioCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const vol = ac.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  // Gentle attack + exponential release so it reads as a soft chime, not a beep.
  vol.gain.setValueAtTime(0.0001, ac.currentTime + startAt);
  vol.gain.exponentialRampToValueAtTime(gain, ac.currentTime + startAt + 0.02);
  vol.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + startAt + dur);
  osc.connect(vol).connect(ac.destination);
  osc.start(ac.currentTime + startAt);
  osc.stop(ac.currentTime + startAt + dur + 0.02);
}

/** Short low blip as the scan begins. */
export function cueScanStart(): void {
  tone(420, 0, 0.14, 0.035);
}

/**
 * Completion cue. positive → a bright rising two-note (clean/authentic result);
 * otherwise a lower, flatter pair (a heads-up: possible AI image / needs a look).
 */
export function cueAnalysisDone(positive: boolean): void {
  if (positive) {
    tone(660, 0, 0.12, 0.05);
    tone(880, 0.1, 0.18, 0.05);
  } else {
    tone(360, 0, 0.16, 0.045);
    tone(300, 0.14, 0.22, 0.045);
  }
}

function reducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Best-effort haptic (phones only); skipped under reduced-motion. */
export function haptic(pattern: number | number[]): void {
  if (reducedMotion()) return;
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* unsupported */
  }
}
