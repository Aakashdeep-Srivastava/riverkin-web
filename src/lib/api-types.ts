/**
 * API types.
 *
 * This file is a PLACEHOLDER. It is regenerated from the backend OpenAPI schema:
 *
 *   npm run gen:api
 *   # => npx openapi-typescript "$NEXT_PUBLIC_API_URL/openapi.json" -o src/lib/api-types.ts
 *
 * Do not hand-edit the generated output. Until the backend is wired up, the
 * domain types below are local stubs so the app shell type-checks and builds.
 *
 * TODO(PRD): replace these stubs with generated `paths` / `components` types once
 * the riverkin-api OpenAPI schema is available.
 */

/** A monitored river site (source: OneAquaHealth). */
export interface Site {
  id: string;
  name: string;
  waterbody: string;
  /** Days since the site was last observed. */
  daysUnseen: number;
  /** Attention tier drives icon + label (never colour alone). */
  attention: AttentionLevel;
  lat: number;
  lng: number;
}

export type AttentionLevel = 'urgent' | 'attention' | 'monitoring' | 'ok';

/** A field mission derived from a site needing attention. */
export interface Mission {
  id: string;
  siteId: string;
  siteName: string;
  title: string;
  summary: string;
  distanceKm: number;
  attention: AttentionLevel;
}

/** A verification card shown in the verify round. */
export interface VerifyCard {
  id: string;
  prompt: string;
  photoAlt: string;
}

export type VerifyAnswer = 'yes' | 'no' | 'unsure';
