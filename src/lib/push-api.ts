/**
 * Web Push subscription (reactivation). Fetches the VAPID key, subscribes the
 * browser, and registers the subscription with the API. All best-effort — any
 * failure leaves the user exactly where they were (no nagging).
 */
import { apiFetch } from './api';

export type PushState = 'unsupported' | 'default' | 'denied' | 'subscribed';

export function pushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

export async function pushState(): Promise<PushState> {
  if (!pushSupported()) return 'unsupported';
  if (Notification.permission === 'denied') return 'denied';
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) return 'subscribed';
  } catch {
    /* ignore */
  }
  return Notification.permission === 'granted' ? 'default' : 'default';
}

function urlB64ToUint8Array(base64: string): Uint8Array {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(b64);
  const out = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

/** Ask permission + subscribe + register with the API. Returns true on success. */
export async function enablePush(): Promise<boolean> {
  if (!pushSupported()) return false;
  try {
    const { key } = await apiFetch<{ key: string }>('/api/v1/push/vapid-public');
    if (!key) return false; // push disabled server-side
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return false;
    const reg = await navigator.serviceWorker.ready;
    const sub =
      (await reg.pushManager.getSubscription()) ??
      (await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(key) as BufferSource,
      }));
    const json = sub.toJSON() as { endpoint?: string; keys?: { p256dh: string; auth: string } };
    await apiFetch('/api/v1/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint: json.endpoint, keys: json.keys }),
    });
    return true;
  } catch {
    return false;
  }
}
