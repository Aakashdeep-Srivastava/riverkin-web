/**
 * "Remembered" entry gate. The app opens on the splash/onboarding/sign-in flow
 * only until the viewer continues; after that we go straight to the map. Stored
 * locally (no account needed for the demo) — matches the PRD's pseudonymous model.
 */
const KEY = 'rk_entered';
const ROLE_KEY = 'rk_role';
const ONBOARDED_KEY = 'rk_onboarded';

export function hasEntered(): boolean {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export function markEntered(role: string): void {
  try {
    localStorage.setItem(KEY, '1');
    localStorage.setItem(ROLE_KEY, role);
  } catch {
    /* storage unavailable (private mode) — proceed without remembering */
  }
}

/** True once the viewer has seen the first-run onboarding slides. */
export function hasOnboarded(): boolean {
  try {
    return localStorage.getItem(ONBOARDED_KEY) === '1';
  } catch {
    return false;
  }
}

export function markOnboarded(): void {
  try {
    localStorage.setItem(ONBOARDED_KEY, '1');
  } catch {
    /* storage unavailable */
  }
}
