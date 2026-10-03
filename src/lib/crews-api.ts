/**
 * Live data layer for crews (later layer: L1 view + L2 setup). Mirrors
 * app/routers/crews.py. Non-fetch helpers return the parsed body or throw; the
 * read helpers return null on failure for graceful fallback.
 */
import { apiFetch } from './api';

export interface CrewMember {
  id: number;
  handle: string;
  role_this_week: string | null;
}

export interface AdoptedSite {
  site_code: string;
  name: string;
  days_unseen: number;
  attention: string;
  fresh: boolean;
}

export interface CrewView {
  id: number;
  name: string;
  city: string | null;
  is_minor_crew: boolean;
  members: CrewMember[];
  adopted: AdoptedSite[];
  coverage_pct: number;
  streak_windows: number;
  checkin_active: boolean;
  simulated: boolean;
}

export async function createCrew(name: string, city: string, isMinor: boolean): Promise<number> {
  const data = await apiFetch<{ id: number }>('/api/v1/crews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, city, is_minor_crew: isMinor }),
  });
  return data.id;
}

export async function addMember(crewId: number, handle: string, role?: string): Promise<void> {
  await apiFetch(`/api/v1/crews/${crewId}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle, role_this_week: role ?? null }),
  });
}

export async function adoptSite(crewId: number, siteCode: string): Promise<void> {
  await apiFetch(`/api/v1/crews/${crewId}/adoptions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ site_code: siteCode }),
  });
}

export async function crewCheckin(crewId: number): Promise<void> {
  await apiFetch(`/api/v1/crews/${crewId}/checkins`, { method: 'POST' });
}

export async function fetchCrew(crewId: number): Promise<CrewView | null> {
  try {
    return await apiFetch<CrewView>(`/api/v1/crews/${crewId}`);
  } catch {
    return null;
  }
}

/** Remember the Crew Lead's crew id locally (no account in the MVP). */
export function rememberCrewId(id: number): void {
  try {
    localStorage.setItem('rk_crew_id', String(id));
  } catch {
    /* storage unavailable */
  }
}

export function getRememberedCrewId(): number | null {
  try {
    const v = localStorage.getItem('rk_crew_id');
    return v ? Number(v) : null;
  } catch {
    return null;
  }
}
