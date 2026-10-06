'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Map as MaplibreMap,
  Marker,
  AttributionControl,
  type StyleSpecification,
  type RequestParameters,
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { apiFetch } from '@/lib/api';
import { attentionMeta } from '@/components/attention-status';
import { MapPlaceholder } from '@/components/map-placeholder';
import type { Site } from '@/lib/api-types';

/**
 * C1 — Attention map, rendered as a real MapLibre GL **globe** (v5) over Azure
 * Maps raster tiles. Tiles are authenticated with a short-lived token minted by
 * the RiverKin API (`/api/v1/maps/token`) — no Azure key ever reaches the
 * browser. The token lives in a ref and is refreshed shortly before it expires.
 *
 * If the token (or the API) is unavailable, the component falls back to the
 * ambient <MapPlaceholder /> (the WebGL fluid-orb) so the build and offline dev
 * never break and the user never sees a dead map or console errors. The
 * keyboard-reachable site list on the home screen is the accessible equivalent.
 *
 * This file touches `window`/maplibre only inside effects (client-only); it is
 * additionally loaded with `next/dynamic({ ssr: false })` so it never enters the
 * server bundle.
 */

/** Response of `GET ${NEXT_PUBLIC_API_URL}/api/v1/maps/token`. */
interface MapsToken {
  token: string;
  clientId: string;
  /** Unix seconds. */
  expiresOn: number;
}

/**
 * Azure Maps raster tiles (Render v2024-04-01). Satellite imagery as the base
 * for the "global earth" look, with transparent roads + labels layered on top.
 * Both tilesets are enabled on this account; swap `tilesetId` to change.
 */
const AZURE_IMAGERY_URL =
  'https://atlas.microsoft.com/map/tile?api-version=2024-04-01&tilesetId=microsoft.imagery&zoom={z}&x={x}&y={y}';
const AZURE_HYBRID_URL =
  'https://atlas.microsoft.com/map/tile?api-version=2024-04-01&tilesetId=microsoft.base.hybrid.road&zoom={z}&x={x}&y={y}';

/** Re-fetch the token once we are within this window (ms) of its expiry. */
const REFRESH_LEAD_MS = 120_000;

/**
 * Module-level token cache. Leaving and re-entering the Explore tab remounts this
 * component; without this the map would re-fetch a maps token every time. A token
 * that is still comfortably valid is reused so re-mounts skip the round-trip.
 */
let cachedToken: MapsToken | null = null;

async function fetchMapsToken(): Promise<MapsToken | null> {
  if (cachedToken && cachedToken.expiresOn * 1000 - Date.now() > REFRESH_LEAD_MS) {
    return cachedToken;
  }
  try {
    const data = await apiFetch<MapsToken>('/api/v1/maps/token');
    if (!data || typeof data.token !== 'string' || typeof data.clientId !== 'string') {
      return null;
    }
    cachedToken = data;
    return data;
  } catch {
    // 503 "maps token unavailable", network error, or NEXT_PUBLIC_API_URL unset.
    return null;
  }
}

/** Europe-wide default: the five OneAquaHealth cities span Oslo → Coimbra. */
const DEFAULT_VIEW: { center: [number, number]; zoom: number } = { center: [7, 48], zoom: 3.6 };

function _userLoc(): { lat: number; lng: number } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('rk_loc');
    const v = raw ? (JSON.parse(raw) as { lat: number; lng: number }) : null;
    return v && typeof v.lat === 'number' && typeof v.lng === 'number' ? v : null;
  } catch {
    return null;
  }
}

function _km(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const la1 = (aLat * Math.PI) / 180;
  const la2 = (bLat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Location-aware opening view: if the viewer has shared their location and a site
 * sits within ~1000 km, open centred on that nearest site (their region) at a
 * regional zoom; otherwise fall back to the Europe-wide default — so a viewer far
 * from any site (e.g. demoing from India) still sees a populated map, not ocean.
 */
function _initialView(sites: Site[], loc: { lat: number; lng: number } | null) {
  if (!loc) return DEFAULT_VIEW;
  let best = Infinity;
  let nearest: Site | null = null;
  for (const s of sites) {
    if (typeof s.lat !== 'number' || typeof s.lng !== 'number') continue;
    const d = _km(loc.lat, loc.lng, s.lat, s.lng);
    if (d < best) {
      best = d;
      nearest = s;
    }
  }
  if (nearest && best <= 1000) {
    return { center: [nearest.lng, nearest.lat] as [number, number], zoom: 8 };
  }
  return DEFAULT_VIEW;
}

export default function GlobeMap({ sites }: { sites?: Site[] }) {
  const [unavailable, setUnavailable] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const tokenRef = useRef<MapsToken | null>(null);
  // Latest sites from the parent's shared query cache. Kept in a ref so the
  // one-shot init effect can read the freshest list at map-load time without
  // re-running — and without the map issuing its own duplicate /sites request.
  const sitesRef = useRef<Site[] | undefined>(sites);
  sitesRef.current = sites;

  useEffect(() => {
    let cancelled = false;
    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    const markers: Marker[] = [];

    // When the viewer grants location mid-session (LocationPrompt), fly to their
    // region instead of waiting for a reload.
    const onLocation = (e: Event) => {
      const loc = (e as CustomEvent).detail as { lat: number; lng: number } | undefined;
      if (!loc || !mapRef.current) return;
      const v = _initialView(sitesRef.current ?? [], loc);
      if (v !== DEFAULT_VIEW) {
        mapRef.current.flyTo({ center: v.center, zoom: v.zoom, duration: 1200 });
      }
    };
    window.addEventListener('rk-location', onLocation);

    const scheduleRefresh = () => {
      const tok = tokenRef.current;
      if (!tok) return;
      const msUntilRefresh = tok.expiresOn * 1000 - Date.now() - REFRESH_LEAD_MS;
      refreshTimer = setTimeout(
        () => {
          void (async () => {
            const next = await fetchMapsToken();
            if (cancelled) return;
            if (next) {
              tokenRef.current = next;
              scheduleRefresh();
            } else {
              // Keep the current token; retry sooner rather than tearing down.
              refreshTimer = setTimeout(() => scheduleRefresh(), 30_000);
            }
          })();
        },
        Math.max(0, msUntilRefresh),
      );
    };

    const addSiteMarkers = async (map: MaplibreMap) => {
      // Prefer the sites the parent already loaded (shared React Query cache) so
      // we don't fire a second request for the same data. Only fall back to a
      // fetch if the parent passed nothing (e.g. the map is used standalone).
      let sites: Site[] = sitesRef.current ?? [];
      if (sites.length === 0) {
        try {
          sites = await apiFetch<Site[]>('/api/v1/sites');
        } catch {
          // No sites available → show the globe with no markers (don't crash).
          return;
        }
      }
      if (cancelled || !Array.isArray(sites)) return;
      for (const site of sites) {
        if (typeof site.lat !== 'number' || typeof site.lng !== 'number') continue;
        const el = document.createElement('div');
        el.className = 'rk-marker';
        // Markers are decorative here; the accessible site list is the
        // keyboard/screen-reader equivalent, so hide these from the a11y tree.
        el.setAttribute('aria-hidden', 'true');
        el.title = `${site.name} — ${attentionMeta[site.attention]?.label ?? 'Site'}`;
        markers.push(new Marker({ element: el }).setLngLat([site.lng, site.lat]).addTo(map));
      }
    };

    const init = async () => {
      const tok = await fetchMapsToken();
      if (cancelled) return;
      if (!tok) {
        // Single informational note; no error spam.
        console.warn('[RiverKin] Maps token unavailable — showing fallback visual.');
        setUnavailable(true);
        return;
      }
      tokenRef.current = tok;
      scheduleRefresh();

      const container = containerRef.current;
      if (!container) return;

      const style: StyleSpecification = {
        version: 8,
        projection: { type: 'globe' },
        sources: {
          'azure-imagery': {
            type: 'raster',
            tiles: [AZURE_IMAGERY_URL],
            tileSize: 256,
          },
          'azure-hybrid': {
            type: 'raster',
            tiles: [AZURE_HYBRID_URL],
            tileSize: 256,
          },
        },
        layers: [
          { id: 'background', type: 'background', paint: { 'background-color': '#0b1a2b' } },
          { id: 'azure-imagery', type: 'raster', source: 'azure-imagery' },
          // Transparent roads + place labels over the satellite base.
          { id: 'azure-hybrid', type: 'raster', source: 'azure-hybrid' },
        ],
      };

      // Open on the viewer's region when we know it and a site is nearby.
      const view = _initialView(sitesRef.current ?? [], _userLoc());
      const map = new MaplibreMap({
        container,
        style,
        center: view.center,
        zoom: view.zoom,
        attributionControl: false,
        // Always read the *current* (possibly refreshed) token from the ref.
        transformRequest: (url: string): RequestParameters | undefined => {
          const current = tokenRef.current;
          if (current && url.includes('atlas.microsoft.com')) {
            return {
              url,
              headers: {
                Authorization: `Bearer ${current.token}`,
                'x-ms-client-id': current.clientId,
              },
            };
          }
          return undefined;
        },
      });
      mapRef.current = map;

      map.addControl(
        new AttributionControl({
          compact: true,
          customAttribution: '© Azure Maps · © TomTom',
        }),
      );

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Gentle auto-rotate, paused while the user interacts. Skipped entirely
      // when the viewer prefers reduced motion.
      let userInteracting = false;
      const secondsPerRevolution = 180;
      // Only auto-rotate when zoomed right out (not at the Europe overview).
      const maxSpinZoom = 2;

      const spinGlobe = () => {
        if (prefersReducedMotion || userInteracting || !mapRef.current) return;
        if (map.getZoom() >= maxSpinZoom) return;
        const center = map.getCenter();
        center.lng -= 360 / secondsPerRevolution;
        map.easeTo({ center, duration: 1000, easing: (n) => n });
      };

      map.on('mousedown', () => {
        userInteracting = true;
      });
      map.on('touchstart', () => {
        userInteracting = true;
      });
      map.on('mouseup', () => {
        userInteracting = false;
        spinGlobe();
      });
      map.on('dragend', () => {
        userInteracting = false;
        spinGlobe();
      });
      map.on('moveend', () => {
        spinGlobe();
      });

      map.on('load', () => {
        if (cancelled) return;
        // Belt-and-braces: ensure globe even if style projection is ignored.
        map.setProjection({ type: 'globe' });
        void addSiteMarkers(map);
        spinGlobe();
      });

      // If the style/tiles blow up at runtime, degrade to the fallback quietly.
      map.on('error', () => {
        if (cancelled) return;
        console.warn('[RiverKin] Map tiles failed to load — showing fallback visual.');
        setUnavailable(true);
      });
    };

    void init();

    return () => {
      cancelled = true;
      window.removeEventListener('rk-location', onLocation);
      if (refreshTimer) clearTimeout(refreshTimer);
      for (const marker of markers) marker.remove();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  if (unavailable) {
    return <MapPlaceholder />;
  }

  return (
    <div className="relative h-full min-h-[14rem] w-full overflow-hidden">
      <div
        ref={containerRef}
        role="img"
        aria-label="Interactive globe of river sites. A text list of the same sites is below."
        className="h-full w-full"
      />
    </div>
  );
}
