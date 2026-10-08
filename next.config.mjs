import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */

// Content-Security-Policy tuned for RiverKin: self + the API + Azure Maps
// (MapLibre globe tiles/token) + inline styles and blob workers that MapLibre
// and Next need. Camera + geolocation are allowed for self (field check +
// geofence); everything else is denied. EU/OWASP hardening.
//
// Dev needs 'unsafe-eval' (react-refresh) + ws + the localhost API; production
// is locked to the Azure API host and drops eval + upgrades to HTTPS.
const isDev = process.env.NODE_ENV !== 'production';
const connectSrc = isDev
  ? "connect-src 'self' data: blob: http://localhost:8000 http://127.0.0.1:8000 ws://localhost:3000 https://atlas.microsoft.com https://*.atlas.microsoft.com"
  : "connect-src 'self' data: blob: https://*.azurecontainerapps.io https://atlas.microsoft.com https://*.atlas.microsoft.com";
const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
  : "script-src 'self' 'unsafe-inline'";

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "worker-src 'self' blob:",
  connectSrc,
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(self), geolocation=(self), microphone=(), payment=(), usb=()' },
];

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  // Consolidate www → apex with a 301 so search engines see one canonical host
  // (both hostnames are bound to the container app and otherwise serve 200).
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.riverkin.online' }],
        destination: 'https://riverkin.online/:path*',
        permanent: true,
      },
    ];
  },
};

// next-intl (App Router, cookie-based locale — see src/i18n/request.ts).
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(nextConfig);
