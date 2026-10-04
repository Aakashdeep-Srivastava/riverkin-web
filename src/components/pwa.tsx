'use client';

import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

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
