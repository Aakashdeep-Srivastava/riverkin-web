'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Download, Bell, BellRing, X, Share } from 'lucide-react';
import { RiverMark } from '@/components/ui/logo';
import { enablePush, pushState, pushSupported, type PushState } from '@/lib/push-api';

const DISMISS_KEY = 'rk_install_dismissed';

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIos(): boolean {
  return typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent);
}

/** Registers the service worker so RiverKin is installable + offline-capable. */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
    const onLoad = () => navigator.serviceWorker.register('/sw.js').catch(() => {});
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);
  return null;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * "Install app" button — appears only when the browser offers installation
 * (beforeinstallprompt) and the app isn't already installed. Renders nothing
 * otherwise (e.g. iOS, where users install via the Share sheet).
 */
export function InstallButton({ className = '' }: { className?: string }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', () => setDeferred(null));
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  if (!deferred) return null;

  return (
    <button
      type="button"
      onClick={async () => {
        await deferred.prompt();
        await deferred.userChoice;
        setDeferred(null);
      }}
      className={
        className ||
        'flex w-full items-center justify-center gap-2 rounded-button bg-[var(--action)] px-4 py-3 font-semibold text-white transition-transform active:scale-[0.98]'
      }
    >
      <Download className="h-5 w-5" aria-hidden="true" />
      Install RiverKin
    </button>
  );
}

/**
 * Install banner — shown app-wide to first-time visitors so they can add RiverKin
 * to their home screen. Uses the native install prompt on Android/desktop Chrome;
 * shows an "Add to Home Screen" hint on iOS Safari. Dismissible + remembered,
 * and never shown once installed.
 */
export function InstallBanner() {
  const pathname = usePathname();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    try {
      if (localStorage.getItem(DISMISS_KEY) === '1') return;
    } catch {
      /* ignore */
    }
    if (isIos()) {
      setIos(true);
      setShow(true);
      return;
    }
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', () => setShow(false));
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  function dismiss() {
    setShow(false);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* ignore */
    }
  }

  // Keep the branded entry flow clean — the banner appears once in the app.
  if (!show || pathname === '/welcome' || pathname?.startsWith('/auth')) return null;

  return (
    <div className="rk-reveal fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+5rem)] z-40 mx-auto max-w-md rounded-2xl border border-unseen bg-surface p-3 shadow-[var(--rk-shadow-lift)] md:bottom-4">
      <div className="flex items-center gap-3">
        <RiverMark className="h-9 w-9 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">Install RiverKin</p>
          <p className="text-[12px] leading-snug text-ink-muted">
            {ios
              ? 'Tap Share, then “Add to Home Screen” for quick, offline access.'
              : 'Add it to your home screen for quick, offline access.'}
          </p>
        </div>
        {ios ? (
          <Share className="h-5 w-5 shrink-0 text-[var(--action)]" aria-hidden="true" />
        ) : (
          <button
            type="button"
            onClick={async () => {
              if (!deferred) return;
              await deferred.prompt();
              await deferred.userChoice;
              setShow(false);
            }}
            className="shrink-0 rounded-button bg-[var(--action)] px-3.5 py-2 text-sm font-semibold text-white"
          >
            Install
          </button>
        )}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="shrink-0 rounded-full p-1 text-ink-muted hover:text-ink"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

/**
 * River alerts — opt-in web push for after-rain / coverage nudges. Explicit
 * button (never auto-prompted), honest copy. Hidden where push isn't supported.
 */
export function AlertsButton() {
  const [state, setState] = useState<PushState>('unsupported');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (pushSupported()) void pushState().then(setState);
  }, []);

  if (state === 'unsupported') return null;

  if (state === 'subscribed') {
    return (
      <p className="flex items-center justify-center gap-2 rounded-button border border-unseen bg-surface px-4 py-3 text-sm font-semibold text-[var(--success)]">
        <BellRing className="h-5 w-5" aria-hidden="true" /> River alerts are on
      </p>
    );
  }

  return (
    <button
      type="button"
      disabled={busy || state === 'denied'}
      onClick={async () => {
        setBusy(true);
        const ok = await enablePush();
        setState(ok ? 'subscribed' : (await pushState()));
        setBusy(false);
      }}
      className="flex w-full items-center justify-center gap-2 rounded-button border border-unseen bg-surface px-4 py-3 font-semibold text-ink transition-transform active:scale-[0.98] disabled:opacity-60"
    >
      <Bell className="h-5 w-5" aria-hidden="true" />
      {state === 'denied' ? 'Alerts blocked in browser settings' : 'Get river alerts (after rain)'}
    </button>
  );
}
