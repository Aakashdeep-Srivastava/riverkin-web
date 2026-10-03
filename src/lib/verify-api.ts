/**
 * Live data layer for verify rounds (Perfect 6 #4). Mirrors
 * app/routers/verify.py. Returns null on failure so C5 can fall back to the
 * bundled demo queue when the API is unreachable.
 */
import { apiFetch } from './api';

/** Shape of app/schemas.py::VerifyCard. */
export interface ApiVerifyCard {
  item_id: number;
  observation_id: number;
  site_name: string;
  field_code: string;
  question: string;
  ai_box: string | null;
}

/** Normalised card the C5 UI renders (live or mock share this shape). */
export interface VerifyCardUI {
  id: string;
  itemId: number | null;
  siteName: string;
  prompt: string;
  aiBox: string;
}

function toUI(c: ApiVerifyCard): VerifyCardUI {
  return {
    id: `item-${c.item_id}`,
    itemId: c.item_id,
    siteName: c.site_name,
    prompt: c.question,
    aiBox: c.ai_box ?? 'RiverKin AI drafted this check. Humans decide.',
  };
}

/** A stable per-browser verifier id (no account; matches the pseudonymous model). */
export function getVoterId(): string {
  try {
    const existing = localStorage.getItem('rk_voter_id');
    if (existing) return existing;
    const id = `v-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem('rk_voter_id', id);
    return id;
  } catch {
    return 'demo-keeper';
  }
}

/** GET the next verify cards, or null on failure. */
export async function fetchVerifyNext(voterId: string, n = 5): Promise<VerifyCardUI[] | null> {
  try {
    const data = await apiFetch<{ cards: ApiVerifyCard[] }>(
      `/api/v1/verify/next?n=${n}&voter_id=${encodeURIComponent(voterId)}`,
    );
    return Array.isArray(data.cards) ? data.cards.map(toUI) : null;
  } catch {
    return null;
  }
}

/** POST a vote. Best-effort — never throws into the UI. */
export async function castVote(
  itemId: number,
  answer: 'yes' | 'no' | 'cant_tell',
  msTaken: number,
  voterId: string,
): Promise<void> {
  try {
    await apiFetch(`/api/v1/verify/${itemId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer, ms_taken: msTaken, voter_id: voterId, voter_kind: 'keeper' }),
    });
  } catch {
    /* offline — the round still proceeds for the demo */
  }
}
