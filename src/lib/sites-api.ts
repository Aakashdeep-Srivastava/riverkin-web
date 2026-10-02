/**
 * Live data layer over the RiverKin API (GET /api/v1/sites). Every call falls
 * back to null on any error so the UI can use the bundled mock data when the
 * API is unreachable (e.g. local dev with no backend).
 */
import { apiFetch } from './api';
import type { AttentionLevel, Site } from './api-types';
import type { GapLevel, SiteDetail } from './mock-data';

/** Shape of app/schemas.py::SiteOut. */
export interface ApiSite {
  id: string;
  name: string;
  waterbody: string | null;
  city: string | null;
  country: string | null;
  lat: number | null;
  lng: number | null;
  days_unseen: number;
  rain_48h_mm: number;
  need_score: number;
  attention: string;
  color: string;
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

export interface SiteView {
  site: Site;
  detail: SiteDetail;
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
    return { site: toSite(a), detail };
  } catch {
    return null;
  }
}
