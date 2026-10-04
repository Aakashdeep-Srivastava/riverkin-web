import type { MetadataRoute } from 'next';

/**
 * PWA manifest — makes RiverKin installable ("Add to Home Screen" / browser
 * install). Icons are generated from public/logo.png. Standalone display so it
 * launches like a native app on the field.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RiverKin — healthy urban rivers',
    short_name: 'RiverKin',
    description:
      'Find where the river needs you. Run a 5-minute stream check, have peers verify it, and keep Europe’s urban rivers healthy.',
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    display_override: ['standalone', 'minimal-ui'],
    lang: 'en',
    dir: 'ltr',
    orientation: 'portrait',
    background_color: '#f7f5f0',
    theme_color: '#0052ff',
    categories: ['education', 'utilities', 'lifestyle'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
