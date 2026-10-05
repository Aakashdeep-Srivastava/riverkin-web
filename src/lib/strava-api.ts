/**
 * Strava linking over the RiverKin API. Connecting is a browser redirect
 * (/strava/connect?token=...), so it carries the app JWT in the URL because a
 * navigation can't send the Authorization header. Reading status/activities and
 * disconnecting go through apiFetch, which attaches the bearer token.
 */
import { apiFetch, API_BASE_URL } from './api';

export interface StravaStatus {
  enabled: boolean;
  connected: boolean;
  athlete_name: string | null;
}

export interface Patrol {
  id: number;
  name: string | null;
  type: string | null;
  distance_m: number | null;
  moving_time_s: number | null;
  start_date: string | null;
  polyline: string | null;
}

/** Is Strava linking configured on the server? */
export async function fetchStravaConfig(): Promise<boolean> {
  try {
    const cfg = await apiFetch<{ enabled: boolean }>('/api/v1/strava/config');
    return Boolean(cfg.enabled);
  } catch {
    return false;
  }
}

/** The signed-in user's link status; null if not signed in or on error. */
export async function fetchStravaStatus(): Promise<StravaStatus | null> {
  try {
    return await apiFetch<StravaStatus>('/api/v1/strava/status');
  } catch {
    return null;
  }
}

/** Recent runs/walks for the linked athlete (empty on error / not linked). */
export async function fetchPatrols(): Promise<Patrol[]> {
  try {
    const res = await apiFetch<{ patrols: Patrol[] }>('/api/v1/strava/activities');
    return res.patrols ?? [];
  } catch {
    return [];
  }
}

/** Unlink Strava from the account. */
export async function disconnectStrava(): Promise<void> {
  try {
    await apiFetch('/api/v1/strava/disconnect', { method: 'POST' });
  } catch {
    // 204 No Content has no JSON body (apiFetch throws parsing it) — the
    // disconnect still succeeded. Nothing to surface either way.
  }
}

/**
 * Start the Strava OAuth redirect. Fetches a short-lived, single-purpose connect
 * ticket (so the session JWT never rides in a URL), then navigates to /connect.
 * Returns false if a ticket couldn't be minted (e.g. not signed in).
 */
export async function beginStravaConnect(): Promise<boolean> {
  if (!API_BASE_URL || typeof window === 'undefined') return false;
  let ticket: string | null = null;
  try {
    const r = await apiFetch<{ ticket: string }>('/api/v1/strava/connect-ticket');
    ticket = r.ticket ?? null;
  } catch {
    return false;
  }
  if (!ticket) return false;
  window.location.href = `${API_BASE_URL}/api/v1/strava/connect?ticket=${encodeURIComponent(ticket)}`;
  return true;
}
