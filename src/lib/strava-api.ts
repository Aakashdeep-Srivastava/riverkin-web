/**
 * Strava linking over the RiverKin API. Connecting is a browser redirect
 * (/strava/connect?token=...), so it carries the app JWT in the URL because a
 * navigation can't send the Authorization header. Reading status/activities and
 * disconnecting go through apiFetch, which attaches the bearer token.
 */
import { apiFetch, API_BASE_URL } from './api';
import { getToken } from './auth-api';

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

/** Absolute URL that starts the Strava OAuth redirect, or null for guests. */
export function stravaConnectUrl(): string | null {
  const token = getToken();
  if (!token || !API_BASE_URL) return null;
  return `${API_BASE_URL}/api/v1/strava/connect?token=${encodeURIComponent(token)}`;
}
