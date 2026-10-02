'use client';

import dynamic from 'next/dynamic';
import { MapPlaceholder } from '@/components/map-placeholder';

/**
 * Client boundary for the C1 attention map.
 *
 * The real MapLibre globe pulls in `maplibre-gl` (a browser-only, WebGL
 * library), so we load it with `next/dynamic({ ssr: false })` to keep it out of
 * the server bundle entirely — the production build never needs a live API or a
 * maps token. While the chunk loads, the ambient fluid-orb placeholder stands in.
 *
 * `ssr: false` is only allowed inside a Client Component, which is why this thin
 * wrapper exists (the home page is a Server Component).
 */
const GlobeMap = dynamic(() => import('@/components/globe-map'), {
  ssr: false,
  loading: () => <MapPlaceholder />,
});

export function AttentionMap() {
  return <GlobeMap />;
}
