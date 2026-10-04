/**
 * Live data layer over the RiverKin API (GET /api/v1/sites). Every call falls
 * back to null on any error so the UI can use the bundled mock data when the
 * API is unreachable (e.g. local dev with no backend).
 */
import { apiFetch } from './api';
import type { AttentionLevel, Site } from './api-types';
import type { GapLevel, SiteDetail } from './mock-data';

/** Real OneAquaHealth ecology baseline (app/oah.py::ecology_status). */
export interface EcologyElement {
  element: string;
  quality: string | null;
  richness: number | null;
}
export interface Ecology {
  status: string | null;
  color: string;
  worst_element: string | null;
  elements: EcologyElement[];
  nitrate: number | null;
  date: string | null;
}
/** Real OAH One Health risk (app/oah.py::health_risk_band). */
export interface HealthRisk {
  score: number;
  band: string;
  color: string;
  pathogen: number | null;
  fecal: number | null;
  arg: number | null;
  date: string | null;
}

/** Shape of app/schemas.py::SiteOut. */
export interface ApiSite {
  id: string;
  name: string;
  waterbody: string | null;
  city: string | null;
  country: string | null;
  lat: number | null;
  lng: number | null;
  altitude_m: number | null;
  days_unseen: number;
  rain_48h_mm: number;
  need_score: number;
  attention: string;
  color: string;
  ecology: Ecology | null;
  health_risk: HealthRisk | null;
  recency_simulated: boolean;
  data_attribution: string | null;
  simulated: boolean;
}

function toSite(a: ApiSite): Site {
  return {
    id: a.id,
    name: a.name,
    waterbody: a.waterbody ?? 'River',
    daysUnseen: a.days_unseen,
    attention: a.attention as AttentionLevel,
    lat: a.lat ?? 0,
    lng: a.lng ?? 0,
  };
}

function gapFromNeed(need: number): GapLevel {
  if (need >= 0.6) return 'high';
  if (need >= 0.35) return 'medium';
  return 'low';
}

function reasonFor(a: ApiSite): string {
  if (a.rain_48h_mm >= 20) {
    return `No verified observation since ${Math.round(a.rain_48h_mm)} mm of rain. A quick bank-side check keeps this OneAquaHealth site current.`;
  }
  if (a.days_unseen >= 30) {
    return `Unseen for ${a.days_unseen} days — an orphan-site mission. Any look revives the record.`;
  }
  if (a.days_unseen <= 1) {
    return 'Recently seen and healthy. Shown for coverage context.';
  }
  return 'Due for a check on its 14-day cadence. Keeps the time series consistent.';
}

/** All sites (mapped to the front-end Site shape), or null on failure. */
export async function fetchSites(): Promise<Site[] | null> {
  try {
    const data = await apiFetch<ApiSite[]>('/api/v1/sites');
    return Array.isArray(data) ? data.map(toSite) : null;
  } catch {
    return null;
  }
}

export interface TimelineEntry {
  kind: string;
  label: string;
  at: string;
}

/** Site timeline (C7), newest first — or null on failure. */
export async function fetchTimeline(id: string): Promise<TimelineEntry[] | null> {
  try {
    const data = await apiFetch<{ entries: TimelineEntry[] }>(
      `/api/v1/sites/${encodeURIComponent(id)}/timeline`,
    );
    return Array.isArray(data.entries) ? data.entries : null;
  } catch {
    return null;
  }
}

export interface SiteView {
  site: Site;
  detail: SiteDetail;
  ecology: Ecology | null;
  healthRisk: HealthRisk | null;
  attribution: string | null;
  altitudeM: number | null;
}

/** One site + derived detail (for C2/C3/receipt), or null on failure. */
export async function fetchSiteView(id: string): Promise<SiteView | null> {
  try {
    const a = await apiFetch<ApiSite>(`/api/v1/sites/${encodeURIComponent(id)}`);
    const detail: SiteDetail = {
      city: a.city ?? '',
      country: a.country ?? '',
      rain48h: Math.round(a.rain_48h_mm),
      gapLevel: gapFromNeed(a.need_score),
      reason: reasonFor(a),
      lastCheckLabel: a.days_unseen === 0 ? 'today' : `${a.days_unseen} days ago`,
      photoCount: 3,
    };
    return {
      site: toSite(a),
      detail,
      ecology: a.ecology ?? null,
      healthRisk: a.health_risk ?? null,
      attribution: a.data_attribution ?? null,
      altitudeM: a.altitude_m ?? null,
    };
  } catch {
    return null;
  }
}
