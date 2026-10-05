/**
 * Community layer — the SOCIAL ledger, DB-backed via the RiverKin API and kept
 * separate from the scientific one. Challenges, participation, "community
 * credits" and referrals are real server state; only the pseudonymous guest id
 * (RK-XXXX) and the pending-referrer hint live on the device. Inviting friends
 * can never make an observation more trustworthy — that stays in the science
 * ledger. No email, no name, no public profile.
 */
import { apiFetch } from './api';

export type ChallengeKind = 'run' | 'check' | 'biodiversity' | 'pollution' | 'map';
export type ChallengeStatus = 'live' | 'upcoming' | 'past';

export interface Challenge {
  id: string;
  title: string;
  city: string | null;
  kind: ChallengeKind;
  meta: string;
  window: string;
  status: ChallengeStatus;
  daysLeft: number;
  joined: number;
  sites: number;
  blurb: string;
  credit: number;
  featured: boolean;
}

interface ApiChallenge {
  id: string;
  title: string;
  city: string | null;
  kind: string;
  meta: string;
  window: string;
  status: string;
  days_left: number;
  sites: number;
  blurb: string;
  credit: number;
  featured: boolean;
  joined: number;
}

function toChallenge(a: ApiChallenge): Challenge {
  return {
    id: a.id,
    title: a.title,
    city: a.city,
    kind: a.kind as ChallengeKind,
    meta: a.meta,
    window: a.window,
    status: a.status as ChallengeStatus,
    daysLeft: a.days_left,
    joined: a.joined,
    sites: a.sites,
    blurb: a.blurb,
    credit: a.credit,
    featured: a.featured,
  };
}

export interface CommunityProfile {
  key: string;
  credits: number;
  missions: number;
  checks: number;
  riversHelped: number;
  referrals: number;
  joinedIds: string[];
}

interface ApiProfile {
  key: string;
  credits: number;
  missions: number;
  checks: number;
  rivers_helped: number;
  referrals: number;
  joined_ids: string[];
}

function toProfile(a: ApiProfile): CommunityProfile {
  return {
    key: a.key,
    credits: a.credits,
    missions: a.missions,
    checks: a.checks,
    riversHelped: a.rivers_helped,
    referrals: a.referrals,
    joinedIds: a.joined_ids ?? [],
  };
}

// ---- Device-side pseudonymous identity ----

const GID = 'rk_guest_id';
const REF = 'rk_referrer';

function randomCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 4; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `RK-${s}`;
}

/** Stable pseudonymous id for this device (created on first read). */
export function guestId(): string {
  try {
    let id = localStorage.getItem(GID);
    if (!id) {
      id = randomCode();
      localStorage.setItem(GID, id);
    }
    return id;
  } catch {
    return 'RK-GUEST';
  }
}

export function joinLink(): string {
  const base = typeof window !== 'undefined' ? window.location.origin : 'https://riverkin.online';
  return `${base}/join/${guestId()}`;
}

function pendingReferrer(): string | null {
  try {
    return localStorage.getItem(REF);
  } catch {
    return null;
  }
}

// ---- API ----

export async function getChallenges(status?: ChallengeStatus): Promise<Challenge[]> {
  const q = status ? `?status=${status}` : '';
  const data = await apiFetch<ApiChallenge[]>(`/api/v1/challenges${q}`);
  return data.map(toChallenge);
}

export async function getChallengeById(id: string): Promise<Challenge | null> {
  try {
    return toChallenge(await apiFetch<ApiChallenge>(`/api/v1/challenges/${id}`));
  } catch {
    return null;
  }
}

export async function getProfile(): Promise<CommunityProfile | null> {
  try {
    return toProfile(await apiFetch<ApiProfile>(`/api/v1/community/profile?key=${guestId()}`));
  } catch {
    return null;
  }
}

export interface JoinResult {
  challenge: Challenge;
  profile: CommunityProfile;
}

/** Join a challenge (idempotent). Passes any pending referrer so the inviter is credited. */
export async function joinChallenge(id: string): Promise<JoinResult | null> {
  try {
    const body: Record<string, string> = { key: guestId() };
    const ref = pendingReferrer();
    if (ref) body.referrer = ref;
    const res = await apiFetch<{ challenge: ApiChallenge; profile: ApiProfile }>(
      `/api/v1/challenges/${id}/join`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    );
    return { challenge: toChallenge(res.challenge), profile: toProfile(res.profile) };
  } catch {
    return null;
  }
}

/** Record who referred this guest (from a /join/[code] link). Stored + sent to the API. */
export async function attachReferral(referrer: string): Promise<void> {
  if (!referrer || referrer === guestId()) return;
  try {
    if (!localStorage.getItem(REF)) localStorage.setItem(REF, referrer);
  } catch {
    /* ignore */
  }
  try {
    await apiFetch('/api/v1/referrals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referrer, referred: guestId() }),
    });
  } catch {
    /* best effort; the referrer is also passed on first join */
  }
}
