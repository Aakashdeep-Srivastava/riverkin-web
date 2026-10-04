/**
 * Behavioral analytics — pseudonymous funnel events (NOTICE→…→RETURN). A random
 * per-browser session id (no PII); events are batched and flushed with
 * keepalive so they survive navigation. Real product metrics (see /events/funnel).
 */
import { API_BASE_URL } from './api';

const SID_KEY = 'rk_sid';

type Evt = { session_id: string; name: string; route: string; meta?: Record<string, unknown> };

let buffer: Evt[] = [];
let timer: number | null = null;
let startedThisSession = false;

function sessionId(): string {
  if (typeof window === 'undefined') return 'ssr';
  try {
    let id = localStorage.getItem(SID_KEY);
    if (!id) {
      id = (crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`).slice(0, 64);
      localStorage.setItem(SID_KEY, id);
    }
    return id;
  } catch {
    return 'nostorage';
  }
}

function flush() {
  if (typeof window === 'undefined' || buffer.length === 0 || !API_BASE_URL) return;
  const events = buffer;
  buffer = [];
  try {
    void fetch(`${API_BASE_URL}/api/v1/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}

/** Record a funnel event. First call of a session also emits session_started. */
export function track(name: string, meta?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  const route = window.location?.pathname ?? '';
  if (!startedThisSession && name !== 'session_started') {
    startedThisSession = true;
    buffer.push({ session_id: sessionId(), name: 'session_started', route });
  }
  if (name === 'session_started') startedThisSession = true;
  buffer.push({ session_id: sessionId(), name, route, meta });
  if (timer) window.clearTimeout(timer);
  timer = window.setTimeout(flush, 1500);
}

let endedThisSession = false;
if (typeof window !== 'undefined') {
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      if (!endedThisSession && startedThisSession) {
        endedThisSession = true;
        buffer.push({ session_id: sessionId(), name: 'session_ended', route: window.location.pathname });
      }
      flush();
    }
  });
}
