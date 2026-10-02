# riverkin-web

Frontend for **RiverKin** — our Track 5 entry for the IEEE OneAquaHealth Global Hackathon 2026.

RiverKin is mission control for river keepers: spot sites that have gone unseen, run a quick
bank-side field check, and verify what others found. This repo is the **frontend only**. The
backend lives in a separate repo: https://github.com/Aakashdeep-Srivastava/riverkin-api

> Note: this is a working app shell. Screens that need full product detail show a visible
> "Simulated, illustrative" label and carry `TODO(PRD)` comments where the PRD unblocks the rest.

## Stack

Next.js 14 (App Router) · TypeScript (strict) · Tailwind with CSS-variable tokens · Radix
primitives · Lucide icons · Framer Motion · MapLibre GL (globe) + Azure Maps tiles · TanStack Query ·
`idb` for the offline check queue.

## Local development

```bash
npm install
cp .env.example .env.local   # then edit values
npm run dev
```

Open http://localhost:3000. The app works at 390px wide and on desktop, and is keyboard accessible.

## Environment variables

See `.env.example`.

- `NEXT_PUBLIC_API_URL` — base URL of the RiverKin API. Baked into the client bundle at build
  time (set per environment in CI as a build arg).
- `NEXT_PUBLIC_MAP_STYLE_URL` — optional MapLibre style JSON (OSM-based).

`NEXT_PUBLIC_*` values are visible in the browser — **never put secrets in them**. `.env.local`
is git-ignored.

## Generated API types

API types are generated from the backend OpenAPI schema, never hand-written:

```bash
npm run gen:api
# => npx openapi-typescript "$NEXT_PUBLIC_API_URL/openapi.json" -o src/lib/api-types.ts
```

Until the backend is wired up, `src/lib/api-types.ts` holds local stub types so the app builds.

## Scripts

| Script            | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Start the dev server                          |
| `npm run build`   | Production build (`output: 'standalone'`)     |
| `npm run start`   | Serve the production build                    |
| `npm run lint`    | ESLint (`next/core-web-vitals`)               |
| `npm run gen:api` | Regenerate API types from the backend schema  |

## Docker

```bash
docker build --build-arg NEXT_PUBLIC_API_URL=https://api.example.com -t riverkin-web .
docker run -p 3000:3000 riverkin-web
```

Multi-stage build on `node:20-alpine`, runs as a non-root user, serves the Next.js standalone
output on port 3000.

## Credits

- River sites — [OneAquaHealth](https://oneaquahealth.eu/)
- Weather — [Open-Meteo](https://open-meteo.com/)
- Map tiles — [Azure Maps](https://azure.microsoft.com/products/azure-maps), data © [TomTom](https://www.tomtom.com/)
