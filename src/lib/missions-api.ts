/**
 * Live data layer over the RiverKin missions engine (GET /api/v1/missions and
 * /api/v1/missions/{id}). Every call falls back to null on any error so the UI
 * can use bundled mock briefs when the API is unreachable (local dev, offline).
 */
import { apiFetch } from './api';
import type { AttentionLevel } from './api-types';
import type { MissionBrief } from './mock-data';

/** Shape of app/schemas.py::MissionOut. */
export interface ApiMission {
  id: string;
  site_id: string;
  site_name: string;
  waterbody: string | null;
  city: string | null;
  title: string;
  summary: string;
  attention: string;
  color: string;
  need_score: number;
  days_unseen: number;
  distance_km: number | null;
  simulated: boolean;
}

/** Shape of app/schemas.py::MissionBriefOut. */
export interface ApiMissionBrief {
  id: string;
  site_id: string;
  site_name: string;
  waterbody: string | null;
  city: string | null;
  name: string;
  window_label: string;
  est_minutes: string;
  safety_line: string;
  steps: string[];
  attention: string;
  color: string;
  need_score: number;
  days_unseen: number;
  rain_48h_mm: number;
  distance_km: number | null;
  simulated: boolean;
}

/** A suggested mission, normalised for the Missions tab list. */
export interface MissionListItem {
  id: string;
  siteId: string;
  title: string;
  siteName: string;
  waterbody: string;
  summary: string;
  attention: AttentionLevel;
  estMinutes: string;
}

function toListItem(m: ApiMission): MissionListItem {
  return {
    id: m.id,
    siteId: m.site_id,
    title: m.title,
    siteName: m.site_name,
    waterbody: m.waterbody ?? 'River',
    summary: m.summary,
    attention: m.attention as AttentionLevel,
    estMinutes: '3–5 min',
  };
}

function toBrief(b: ApiMissionBrief): MissionBrief {
  return {
    id: b.id,
    siteId: b.site_id,
    name: b.name,
    windowLabel: b.window_label,
    estMinutes: b.est_minutes,
    distanceKm: b.distance_km ?? 1.5,
    safetyLine: b.safety_line,
    steps: b.steps,
  };
}

/** Suggested missions, most-urgent first — or null on failure. */
export async function fetchMissions(city?: string): Promise<MissionListItem[] | null> {
  try {
    const qs = city ? `?city=${encodeURIComponent(city)}` : '';
    const data = await apiFetch<ApiMission[]>(`/api/v1/missions${qs}`);
    return Array.isArray(data) ? data.map(toListItem) : null;
  } catch {
    return null;
  }
}

/** The C3 mission brief for one site — or null on failure. */
export async function fetchMissionBrief(id: string): Promise<MissionBrief | null> {
  try {
    const b = await apiFetch<ApiMissionBrief>(`/api/v1/missions/${encodeURIComponent(id)}`);
    return toBrief(b);
  } catch {
    return null;
  }
}
