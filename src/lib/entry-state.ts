/**
 * "Remembered" entry gate. The app opens on the globe/login screen only on the
 * first visit; after the viewer continues, we go straight to the map next time.
 * Stored locally (no account, no server) — matches the PRD's pseudonymous model.
 */
const KEY = 'rk_entered';
const ROLE_KEY = 'rk_role';

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
