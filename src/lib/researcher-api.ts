/**
 * Live data layer for the R1 researcher dashboard (Perfect 6 #6). Mirrors
 * app/routers/metrics.py, expert.py and fhir.py. Returns null on failure so the
 * dashboard can fall back to bundled context when the API is unreachable.
 */
import { apiFetch } from './api';

export interface ApiMetrics {
  sites_total: number;
  sites_needing_attention: number;
  verified_this_month: number;
  open_expert_reviews: number;
  coverage_fresh_pct: number;
  ai_human_agreement_pct: number | null;
  ai_human_agreement_n: number;
  median_verify_seconds: number | null;
  verify_votes_n: number;
  revisit_rate_pct: number | null;
  revisit_eligible_n: number;
  simulated: boolean;
}

export interface ApiExpertItem {
  observation_id: number;
  site_name: string;
  status: string;
  reason: string;
  pipe_flag: boolean;
  trust: number | null;
  verifier_count: number;
  answers: Record<string, string>;
}

export async function fetchMetrics(): Promise<ApiMetrics | null> {
  try {
    return await apiFetch<ApiMetrics>('/api/v1/metrics');
  } catch {
    return null;
  }
}

export async function fetchExpertQueue(): Promise<ApiExpertItem[] | null> {
  try {
    const data = await apiFetch<{ items: ApiExpertItem[] }>('/api/v1/expert/queue');
    return Array.isArray(data.items) ? data.items : null;
  } catch {
    return null;
  }
}

export async function fetchFhirBundle(observationId: number): Promise<unknown | null> {
  try {
    const data = await apiFetch<{ bundle: unknown }>(
      `/api/v1/fhir/observations/${observationId}`,
    );
    return data.bundle ?? null;
  } catch {
    return null;
  }
}
