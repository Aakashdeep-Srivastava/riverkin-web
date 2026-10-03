/**
 * Live data layer for the observation write + status path (Perfect 6 #3 / #5).
 * Mirrors app/routers/observations.py. Every call returns null on any error so
 * C4/C6 can fall back to the bundled demo content when the API is unreachable.
 */
import { apiFetch } from './api';

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
