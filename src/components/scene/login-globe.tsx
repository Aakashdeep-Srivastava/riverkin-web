'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Map as MaplibreMap,
  Marker,
  type StyleSpecification,
  type RequestParameters,
  type GeoJSONSource,
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { apiFetch } from '@/lib/api';
import { MapPlaceholder } from '@/components/map-placeholder';
import type { Site } from '@/lib/api-types';

/**
 * LoginGlobe — the opt-in live-geography base for the welcome screen (?live=globe).
 *
 * A non-interactive MapLibre v5 globe over Azure Maps satellite tiles (same
 * token-auth pattern as the home map), with a glowing, *flowing* network drawn
 * between the real monitoring sites — the live counterpart of the glowing web
 * in the hero artwork. Flow is produced with MapLibre's animated line-dasharray
 * (a proven, GPU-backed technique), not a bespoke GLSL layer, so it is robust
 * and degrades gracefully.
 *
 * Honesty: the satellite base is real; the connecting network is illustrative
 * (the dataset has site points, not river courses), so a visible
 * "Simulated network" label is shown. If the token/tiles are unavailable the
 * whole thing falls back to the ambient <MapPlaceholder /> orb — never a dead
 * map. Kept entirely separate from the home-map component so that critical
 * screen is untouched. All motion is disabled under prefers-reduced-motion.
 */

interface MapsToken {
  token: string;
  clientId: string;
  expiresOn: number;
}

const AZURE_IMAGERY_URL =
  'https://atlas.microsoft.com/map/tile?api-version=2024-04-01&tilesetId=microsoft.imagery&zoom={z}&x={x}&y={y}';
const AZURE_HYBRID_URL =
  'https://atlas.microsoft.com/map/tile?api-version=2024-04-01&tilesetId=microsoft.base.hybrid.road&zoom={z}&x={x}&y={y}';

const REFRESH_LEAD_MS = 120_000;

async function fetchMapsToken(): Promise<MapsToken | null> {
  try {
    const data = await apiFetch<MapsToken>('/api/v1/maps/token');
    if (!data || typeof data.token !== 'string' || typeof data.clientId !== 'string') return null;
    return data;
  } catch {
    return null;
  }
}

/** Connect each site to its 2 nearest neighbours → a web of LineStrings. */
function buildFlowNetwork(sites: Site[]): GeoJSON.FeatureCollection {
  const pts = sites.filter((s) => typeof s.lat === 'number' && typeof s.lng === 'number');
  const edges = new Set<string>();
  const features: GeoJSON.Feature[] = [];

  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const nearest = pts
      .map((b, j) => ({ j, d: (a.lng - b.lng) ** 2 + (a.lat - b.lat) ** 2 }))
      .filter((x) => x.j !== i)
      .sort((x, y) => x.d - y.d)
      .slice(0, 2);
    for (const { j } of nearest) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (edges.has(key)) continue;
      edges.add(key);
      const b = pts[j];
      features.push({
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: [[a.lng, a.lat], [b.lng, b.lat]] },
      });
    }
  }
  return { type: 'FeatureCollection', features };
}

/** Marching-dash patterns → the illusion of flow along each line. */
const DASH_SEQUENCE: number[][] = [
  [0, 4, 3],
  [0.5, 4, 2.5],
  [1, 4, 2],
  [1.5, 4, 1.5],
  [2, 4, 1],
  [2.5, 4, 0.5],
  [3, 4, 0],
  [0, 0.5, 3, 3.5],
  [0, 1, 3, 3],
  [0, 1.5, 3, 2.5],
  [0, 2, 3, 2],
  [0, 2.5, 3, 1.5],
  [0, 3, 3, 1],
  [0, 3.5, 3, 0.5],
];

export function LoginGlobe() {
  const [unavailable, setUnavailable] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const tokenRef = useRef<MapsToken | null>(null);

  useEffect(() => {
    let cancelled = false;
    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    let flowRaf: number | undefined;
    const markers: Marker[] = [];

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scheduleRefresh = () => {
      const tok = tokenRef.current;
      if (!tok) return;
      const ms = tok.expiresOn * 1000 - Date.now() - REFRESH_LEAD_MS;
      refreshTimer = setTimeout(() => {
        void (async () => {
          const next = await fetchMapsToken();
          if (cancelled) return;
          if (next) {
            tokenRef.current = next;
            scheduleRefresh();
          } else {
            refreshTimer = setTimeout(() => scheduleRefresh(), 30_000);
          }
        })();
      }, Math.max(0, ms));
    };

    const addFlow = async (map: MaplibreMap) => {
      let sites: Site[] = [];
      try {
        sites = await apiFetch<Site[]>('/api/v1/sites');
      } catch {
        return;
      }
      if (cancelled || !Array.isArray(sites) || !sites.length) return;

      const network = buildFlowNetwork(sites);
      if (!map.getSource('flow')) {
        map.addSource('flow', { type: 'geojson', data: network });
        // Soft outer glow.
        map.addLayer({
          id: 'flow-glow',
          type: 'line',
          source: 'flow',
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: {
            'line-color': '#4FD8FF',
            'line-width': 5,
            'line-blur': 6,
            'line-opacity': 0.28,
          },
        });
        // Bright flowing core (animated dash).
        map.addLayer({
          id: 'flow-core',
          type: 'line',
          source: 'flow',
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: {
            'line-color': '#dff4ff',
            'line-width': 1.6,
            'line-opacity': 0.9,
            'line-dasharray': [0, 4, 3],
          },
        });
      }

      // Pulsing site nodes (decorative; the home screen has the a11y list).
      for (const site of sites) {
        if (typeof site.lat !== 'number' || typeof site.lng !== 'number') continue;
        const el = document.createElement('div');
        el.className = 'rk-marker';
        el.setAttribute('aria-hidden', 'true');
        markers.push(new Marker({ element: el }).setLngLat([site.lng, site.lat]).addTo(map));
      }

      // Animate the dash to simulate downstream flow (skipped if reduced motion).
      if (!prefersReducedMotion) {
        let step = 0;
        let last = 0;
        const animate = (time: number) => {
          if (cancelled || !mapRef.current) return;
          if (time - last > 70) {
            last = time;
            step = (step + 1) % DASH_SEQUENCE.length;
            const layer = map.getLayer('flow-core');
            if (layer) map.setPaintProperty('flow-core', 'line-dasharray', DASH_SEQUENCE[step]);
          }
          flowRaf = requestAnimationFrame(animate);
        };
        flowRaf = requestAnimationFrame(animate);
      }
    };

    const init = async () => {
      const tok = await fetchMapsToken();
      if (cancelled) return;
      if (!tok) {
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
          'azure-imagery': { type: 'raster', tiles: [AZURE_IMAGERY_URL], tileSize: 256 },
          'azure-hybrid': { type: 'raster', tiles: [AZURE_HYBRID_URL], tileSize: 256 },
        },
        layers: [
          { id: 'background', type: 'background', paint: { 'background-color': '#081628' } },
          { id: 'azure-imagery', type: 'raster', source: 'azure-imagery' },
          { id: 'azure-hybrid', type: 'raster', source: 'azure-hybrid', paint: { 'raster-opacity': 0.9 } },
        ],
      };

      const map = new MaplibreMap({
        container,
        style,
        center: [9, 47],
        zoom: 3.3,
        attributionControl: false,
        interactive: false,
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

      // Gentle continuous drift (never when reduced motion is requested).
      const secondsPerRevolution = 240;
      const spin = () => {
        if (prefersReducedMotion || cancelled || !mapRef.current) return;
        const c = map.getCenter();
        c.lng -= 360 / secondsPerRevolution;
        map.easeTo({ center: c, duration: 1000, easing: (n) => n });
      };
      map.on('moveend', spin);

      map.on('load', () => {
        if (cancelled) return;
        map.setProjection({ type: 'globe' });
        void addFlow(map);
        spin();
      });

      map.on('error', () => {
        if (cancelled) return;
        setUnavailable(true);
      });
    };

    void init();

    return () => {
      cancelled = true;
      if (refreshTimer) clearTimeout(refreshTimer);
      if (flowRaf) cancelAnimationFrame(flowRaf);
      for (const marker of markers) marker.remove();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  if (unavailable) return <MapPlaceholder />;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        ref={containerRef}
        role="img"
        aria-label="Live globe of Europe with the river-monitoring network. An accessible site list is available after entering."
        className="h-full w-full"
      />
      {/* Honesty: real satellite base, illustrative connecting network. */}
      <div className="pointer-events-none absolute bottom-2 left-2 z-10 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-medium text-white/85 backdrop-blur">
        Live satellite · simulated network
      </div>
    </div>
  );
}

export default LoginGlobe;
