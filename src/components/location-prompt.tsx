'use client';

import { useEffect, useState } from 'react';
import { MapPin, X } from 'lucide-react';

const ASKED_KEY = 'rk_loc_asked';
const COORD_KEY = 'rk_loc';

/**
 * Consent-based location request on the dashboard. The app asks once (never
 * silently): the viewer taps "Allow", which triggers the browser permission
 * prompt; the coordinates are stored locally so the field-check geofence can
 * reuse them. Dismissed or answered, it won't nag again.
 */
export function LocationPrompt() {
  const [show, setShow] = useState(false);
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(ASKED_KEY)) setShow(true);
    } catch {
      /* storage unavailable */
    }
  }, []);

  function remember() {
    try {
      localStorage.setItem(ASKED_KEY, '1');
    } catch {
      /* ignore */
    }
  }

  function allow() {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      remember();
      setShow(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        try {
          localStorage.setItem(COORD_KEY, JSON.stringify(loc));
        } catch {
          /* ignore */
        }
        // Let the map recentre on the viewer's region immediately (no reload).
        try {
          window.dispatchEvent(new CustomEvent('rk-location', { detail: loc }));
        } catch {
          /* ignore */
        }
        remember();
        setGranted(true);
        window.setTimeout(() => setShow(false), 1600);
      },
      () => {
        remember();
        setShow(false);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300_000 },
    );
  }

  function dismiss() {
    remember();
    setShow(false);
  }

  if (!show) return null;

  if (granted) {
    return (
      <div className="rk-reveal flex items-center gap-2.5 rounded-card border border-[color-mix(in_srgb,var(--success)_45%,var(--unseen))] bg-[color-mix(in_srgb,var(--success)_10%,var(--surface))] p-3">
        <MapPin className="h-5 w-5 shrink-0 text-success" aria-hidden="true" />
        <p className="text-[13px] font-semibold text-ink">Location enabled — thanks.</p>
      </div>
    );
  }

  return (
    <div className="rk-glass rk-reveal flex items-center gap-3 rounded-card p-3 shadow-[var(--rk-shadow-lift)]">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--action-tint)] text-[var(--action)]">
        <MapPin className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-bold leading-tight text-ink">See rivers near you</p>
        <p className="text-[12px] text-ink-muted">Allow location to confirm you&apos;re at a site when you check.</p>
      </div>
      <button
        type="button"
        onClick={allow}
        className="shrink-0 rounded-full bg-[var(--action)] px-3.5 py-1.5 text-[13px] font-bold text-white active:scale-95"
      >
        Allow
      </button>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Not now"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-muted hover:text-ink"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
