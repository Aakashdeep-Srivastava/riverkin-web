/**
 * Notifications: live nudges from GET /api/v1/notifications, merged with
 * personal, on-device ones (identity progress). Read-state is kept in
 * localStorage by id so the unread badge is honest across visits. Everything is
 * derived from real state — never spam.
 */
import { apiFetch } from './api';
import { listChecks } from './offline-queue';
import { identityFor } from './identity';

export interface AppNotification {
  id: string;
  kind: string;
  icon: string;
  title: string;
  body: string;
  href: string;
  accent: string;
  at: string;
}

const READ_KEY = 'rk_notifs_read';

function readSet(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    return new Set(JSON.parse(window.localStorage.getItem(READ_KEY) ?? '[]'));
  } catch {
    return new Set();
  }
}

export function isUnread(id: string): boolean {
  return !readSet().has(id);
}

export function markRead(ids: string[]): void {
  if (typeof window === 'undefined') return;
  const set = readSet();
  ids.forEach((i) => set.add(i));
  try {
    window.localStorage.setItem(READ_KEY, JSON.stringify([...set]));
  } catch {
    /* storage unavailable */
  }
}

/** Personal, on-device nudge: how your standing is growing (identity, not points). */
async function personal(): Promise<AppNotification[]> {
  const checks = await listChecks();
  const score = checks.reduce((acc, c) => acc + (c.points ?? 0), 0);
  const id = identityFor(score);
  if (checks.length === 0) {
    return [
      {
        id: 'welcome',
        kind: 'identity',
        icon: 'compass',
        title: 'Welcome, Observer 🌊',
        body: 'Make your first check count and start your journey to River Keeper.',
        href: '/missions',
        accent: '#0052FF',
        at: new Date().toISOString(),
      },
    ];
  }
  if (id.next) {
    return [
      {
        id: `tier-${id.tier.key}-${score}`,
        kind: 'identity',
        icon: 'compass',
        title: `You're a ${id.tier.name} ✨`,
        body: `${id.toNext} more ${id.toNext === 1 ? 'point' : 'points'} to ${id.next.name}. Keep going!`,
        href: '/impact',
        accent: '#0052FF',
        at: new Date().toISOString(),
      },
    ];
  }
  return [];
}

/** All notifications (personal first), newest/most-relevant first. */
export async function fetchNotifications(city?: string): Promise<AppNotification[]> {
  const mine = await personal();
  try {
    const q = city ? `?city=${encodeURIComponent(city)}` : '';
    const live = await apiFetch<AppNotification[]>(`/api/v1/notifications${q}`);
    return [...mine, ...(Array.isArray(live) ? live : [])];
  } catch {
    return mine;
  }
}
