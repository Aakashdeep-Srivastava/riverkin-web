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
import { SimulatedBadge } from '@/components/simulated-badge';
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

async function fetchMapsToken(): Promise<MapsToken | null> {
  try {
    const data = await apiFetch<MapsToken>('/api/v1/maps/token');
    if (!data || typeof data.token !== 'string' || typeof data.clientId !== 'string') {
      return null;
    }
    return data;
  } catch {
    // 503 "maps token unavailable", network error, or NEXT_PUBLIC_API_URL unset.
    return null;
  }
}

export default function GlobeMap() {
  const [unavailable, setUnavailable] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const tokenRef = useRef<MapsToken | null>(null);

  useEffect(() => {
    let cancelled = false;
    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    const markers: Marker[] = [];

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
      let sites: Site[] = [];
      try {
        sites = await apiFetch<Site[]>('/api/v1/sites');
      } catch {
        // No sites available → show the globe with no markers (don't crash).
        return;
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

      const map = new MaplibreMap({
        container,
        style,
        center: [10, 48],
        zoom: 2.2,
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
      const maxSpinZoom = 4;

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
    <div className="relative h-56 w-full overflow-hidden rounded-card border border-unseen md:h-72">
      <div
        ref={containerRef}
        role="img"
        aria-label="Interactive globe of river sites. A text list of the same sites is below."
        className="h-full w-full"
      />
      {/* The base map is real; the site markers/data are simulated. */}
      <div className="pointer-events-none absolute right-2 top-2 z-10">
        <SimulatedBadge />
      </div>
    </div>
  );
}
