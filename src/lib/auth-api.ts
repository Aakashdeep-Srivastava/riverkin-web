/**
 * Adult-account auth (register / login / me) over the RiverKin API, plus local
 * token storage. Kids never use this — they enter via the passwordless demo
 * role picker (pseudonymous, PRD role model).
 */
import { apiFetch, ApiError, API_BASE_URL } from './api';

export type Role = 'keeper' | 'crew_lead' | 'researcher';

export interface AuthUser {
  id: number;
  email: string;
  role: Role;
  display_name: string;
  large_text: boolean;
}

interface AuthToken {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

const TOKEN_KEY = 'rk_token';
const USER_KEY = 'rk_user';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

/** The signed-in user's permanent River Score (GET /auth/score). */
export interface RiverScore {
  score: number;
  checks: number;
  verified: number;
  tier: string;
  next_tier: string | null;
  to_next: number;
}

/** Fetch the server-computed River Score; null for guests (401) or on error. */
export async function fetchScore(): Promise<RiverScore | null> {
  const { apiFetch } = await import('./api');
  try {
    return await apiFetch<RiverScore>('/api/v1/auth/score');
  } catch {
    return null;
  }
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function store(token: AuthToken): AuthUser {
  try {
    localStorage.setItem(TOKEN_KEY, token.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(token.user));
  } catch {
    /* storage unavailable */
  }
  return token.user;
}

export function signOut(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
}

/** Is Microsoft sign-in configured on the server? */
export async function isMicrosoftEnabled(): Promise<boolean> {
  try {
    const cfg = await apiFetch<{ microsoft: boolean }>('/api/v1/auth/config');
    return Boolean(cfg.microsoft);
  } catch {
    return false;
  }
}

/** Begin the Microsoft (Entra) sign-in redirect. */
export function signInWithMicrosoft(): void {
  if (typeof window !== 'undefined') {
    window.location.href = `${API_BASE_URL}/api/v1/auth/microsoft/login`;
  }
}

/** Finish sign-in from the token the OIDC callback put in the URL. */
export async function completeFromToken(token: string): Promise<AuthUser | null> {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* ignore */
  }
  try {
    const me = await apiFetch<{ authenticated: boolean; user?: AuthUser }>('/api/v1/auth/me');
    if (me.authenticated && me.user) {
      try {
        localStorage.setItem(USER_KEY, JSON.stringify(me.user));
      } catch {
        /* ignore */
      }
      return me.user;
    }
  } catch {
    /* ignore */
  }
  return null;
}

/** Human-readable message from an ApiError (falls back to a generic line). */
function messageFor(err: unknown, fallback: string): string {
  if (err instanceof ApiError) {
    if (err.status === 401) return 'Wrong email or password.';
    if (err.status === 409) return 'An account with this email already exists.';
    if (err.status === 422) return 'Check your details — password needs 8+ characters.';
    if (err.status === 0) return 'Cannot reach the server. Try again.';
  }
  return fallback;
}

export async function register(input: {
  email: string;
  password: string;
  displayName: string;
  role: Role;
}): Promise<{ user?: AuthUser; error?: string }> {
  try {
    const token = await apiFetch<AuthToken>('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: input.email,
        password: input.password,
        display_name: input.displayName,
        role: input.role,
      }),
    });
    return { user: store(token) };
  } catch (err) {
    return { error: messageFor(err, 'Could not create your account.') };
  }
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<{ user?: AuthUser; error?: string }> {
  try {
    const token = await apiFetch<AuthToken>('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: input.email, password: input.password }),
    });
    return { user: store(token) };
  } catch (err) {
    return { error: messageFor(err, 'Could not sign you in.') };
  }
}
