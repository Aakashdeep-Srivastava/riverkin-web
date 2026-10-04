/**
 * Live community data (GET /api/v1/community/*). City standings and derived
 * field challenges, computed server-side from real OAH sites + observations.
 * Null on failure so the UI can show a calm empty state.
 */
import { apiFetch } from './api';

export interface CityStanding {
  city: string;
  country: string | null;
  sites_total: number;
  sites_fresh: number;
  coverage_pct: number;
  gaps_closed: number;
  checks_7d: number;
  rank: number;
}

export interface Challenge {
  id: string;
  city: string | null;
  title: string;
  detail: string;
  target: number;
  progress: number;
  kind: 'after-rain' | 'orphan' | 'coverage';
}

export async function fetchStandings(): Promise<CityStanding[] | null> {
  try {
    const data = await apiFetch<CityStanding[]>('/api/v1/community/standings');
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

export async function fetchChallenges(city?: string): Promise<Challenge[] | null> {
  try {
    const q = city ? `?city=${encodeURIComponent(city)}` : '';
    const data = await apiFetch<Challenge[]>(`/api/v1/community/challenges${q}`);
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}
