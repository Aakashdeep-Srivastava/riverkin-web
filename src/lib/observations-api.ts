/**
 * Live data layer for the observation write + status path (Perfect 6 #3 / #5).
 * Mirrors app/routers/observations.py. Every call returns null on any error so
 * C4/C6 can fall back to the bundled demo content when the API is unreachable.
 */
import { apiFetch, API_BASE_URL } from './api';

/** Shape of app/schemas.py::ReceiptPhotoOut. */
export interface ApiReceiptPhoto {
  url: string;
  summary: string;
  tags: string[];
  model: string;
  used_model: boolean;
  ai_generated_likelihood: number;
  authenticity: number;
  authenticity_reason: string;
  captured_live: boolean;
  geotag_label: string | null;
  lat: number | null;
  lng: number | null;
  relevance: number | null;
  correlation: PhotoFieldCheck[];
  escalated: boolean;
  photos_count: number;
  evidence_region: { x: number; y: number; w: number; h: number } | null;
  focus_field: string | null;
}

/** One field cross-checked: the citizen's answer vs the model's read of the photo. */
export interface PhotoFieldCheck {
  field: string;
  citizen: string;
  photo: string;
  confidence: number;
  agrees: boolean | null;
}

/** Shape of app/schemas.py::ReceiptOut. */
export interface ApiReceipt {
  site_name: string;
  waterbody: string;
  city: string;
  gap_before: number;
  gap_after: number;
  rain_context: string;
  verifier_count: number;
  fhir_id: string | null;
  sentinel_line: string;
  state: string;
  date_label: string;
  points: number;
  geo_ok: boolean;
  photo: ApiReceiptPhoto | null;
}

export interface PhotoUploadResult {
  ok: boolean;
  reason?: 'retake_photo' | 'duplicate_photo' | 'unreadable_image' | 'error';
  message?: string;
}

/**
 * Upload one captured photo to an observation. Runs the server-side blur/dedup
 * gates + vision analysis + authenticity score. Returns a typed result so the
 * check flow can prompt a retake (422) or flag a duplicate (409).
 */
export async function uploadObservationPhoto(
  observationId: number | string,
  file: File,
  kind: string,
  capturedLive: boolean,
): Promise<PhotoUploadResult> {
  if (!API_BASE_URL) return { ok: false, reason: 'error' };
  const form = new FormData();
  form.append('file', file, file.name || `${kind}.jpg`);
  form.append('kind', kind);
  form.append('captured_live', String(capturedLive));
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/observations/${observationId}/photos`, {
      method: 'POST',
      body: form,
    });
    if (res.ok) return { ok: true };
    let reason: PhotoUploadResult['reason'] = 'error';
    let message: string | undefined;
    try {
      const detail = (await res.json())?.detail;
      if (detail?.reason) reason = detail.reason;
      message = detail?.message;
    } catch {
      /* non-JSON error body */
    }
    void import('./analytics').then((m) => m.track('photo_rejected', { reason }));
    return { ok: false, reason, message };
  } catch {
    return { ok: false, reason: 'error' };
  }
}

/** A real, stateless vision read for the live camera scan (no observation yet). */
export interface PhotoAnalysis {
  ok: boolean;
  reason?: string;
  message?: string;
  summary?: string;
  tags?: string[];
  relevance?: number;
  ai_generated_likelihood?: number;
  authenticity?: number; // 0–100
  authenticity_reason?: string;
  evidence_region?: { x: number; y: number; w: number; h: number } | null;
  used_model?: boolean;
  model?: string;
}

/**
 * Analyse one photo without creating an observation — drives the camera-step scan
 * overlay with the *real* model read (pollution tags, AI-generation likelihood,
 * authenticity). The authoritative score still runs on submit.
 */
export async function analyzePhoto(file: File, capturedLive: boolean): Promise<PhotoAnalysis | null> {
  if (!API_BASE_URL) return null;
  const form = new FormData();
  form.append('file', file, file.name || 'scan.jpg');
  form.append('captured_live', String(capturedLive));
  // Never let the scan overlay hang on a cold/slow model — abort after 10s and
  // let the caller fall back (keep the photo, skip the result card).
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10_000);
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/observations/analyze`, {
      method: 'POST',
      body: form,
      signal: ctrl.signal,
    });
    if (!res.ok) return null;
    return (await res.json()) as PhotoAnalysis;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Absolute URL for a receipt photo path returned by the API. */
export function photoUrl(path: string): string {
  return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
}

/** Shape of app/schemas.py::ObservationCreated. */
export interface ApiObservationCreated {
  id: number;
  status: string;
  verify_item_count: number;
  receipt: ApiReceipt;
  simulated: boolean;
}

/** Shape of app/schemas.py::ObservationStatusOut. */
export interface ApiObservationStatus {
  id: number;
  status: string;
  trust: number | null;
  verifier_count: number;
  receipt: ApiReceipt;
  simulated: boolean;
}

export interface SubmitObservationInput {
  siteCode: string;
  answers: Record<string, string>;
  feeling?: string;
  photoCount: number;
  lat?: number;
  lng?: number;
}

/** POST a field check. Returns the created observation, or null on failure. */
export async function submitObservation(
  input: SubmitObservationInput,
): Promise<ApiObservationCreated | null> {
  try {
    return await apiFetch<ApiObservationCreated>('/api/v1/observations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        site_code: input.siteCode,
        answers: input.answers,
        feeling: input.feeling ?? null,
        photo_count: input.photoCount,
        lat: input.lat ?? null,
        lng: input.lng ?? null,
      }),
    });
  } catch {
    return null;
  }
}

/** GET live status + receipt for an observation, or null on failure. */
export async function fetchObservationStatus(
  id: string | number,
): Promise<ApiObservationStatus | null> {
  try {
    return await apiFetch<ApiObservationStatus>(
      `/api/v1/observations/${encodeURIComponent(String(id))}/status`,
    );
  } catch {
    return null;
  }
}
