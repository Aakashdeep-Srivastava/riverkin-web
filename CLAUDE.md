# RiverKin Web — instructions for Claude Code

RiverKin is our Track 5 entry for the IEEE OneAquaHealth Global Hackathon 2026.
Deadline: Oct 4, 2026, 21:00 PDT (Oct 5, 09:30 IST). A polished, working loop beats extra screens.

The full product spec is in `docs/PRD.md`. This repo is the **frontend only**.
Backend lives in a separate repo: https://github.com/Aakashdeep-Srivastava/riverkin-api

## Read these PRD sections before any work
Audience and personas, Design system, Screens, Core user flows, Functional requirements,
Non-functional requirements, Metrics/demo script. The PRD is the source of truth; ask before deviating.

## Scope: the "Perfect 6" (build in this order)
1. C1 Attention map (full-screen MapLibre, pulsing sites by need) + list view
2. C2 Site attention card + C3 Mission brief
3. C4 Field check (one question per screen, camera steps, offline queue)
4. C5 Verify round (20 s cards, Yes / No / Can't tell)
5. C6 Status + impact receipt ("19 days → 0 · Monitoring gap closed")
6. R1 Researcher view: expert queue + FHIR Bundle viewer/download
Only after these work end to end: C7 timeline, L1 crew, L2 crew lead setup.
Demo persona is an adult Keeper ("Kari"). School crew mode is a later layer.

## Stack
Next.js 14+ App Router, TypeScript (strict), Tailwind with CSS-variable tokens, Radix primitives,
Lucide icons, Framer Motion (respect `prefers-reduced-motion`), MapLibre GL + OSM tiles,
TanStack Query for data, `idb` for the offline check queue, a service worker for the app shell.
API types are generated, never hand-written:
`npx openapi-typescript "$NEXT_PUBLIC_API_URL/openapi.json" -o src/lib/api-types.ts` (script: `npm run gen:api`).

## Design system (from the PRD — follow exactly)
- Mission control with game mechanics, not a game. Hierarchy: River → Attention → Mission → Human → Verification → Impact.
- Tokens on `:root` with dark-mode overrides: `--bg #F7F5F0`, `--surface #FFFFFF`, `--ink #12192B`,
  `--ink-muted #5B6475`, `--water #12A4D9`, `--attention #F2A93B`, `--urgent #E5484D` (unresolved flags only),
  `--unseen #C9CED8` outline, `--success #2FA36B`. Dark values are in the PRD table.
- Inter, tabular numbers; hero numbers 56–72 px / 700; body 16 px; labels 13 px uppercase.
- 8 px grid, card radius 20, button radius 16, tap targets ≥ 48 px, primary CTA 56 px full width.
- Bottom nav: Map, Missions, Crew, Me. Researcher view uses a left rail on desktop.
- AI identity = small radar glyph + status text only. No chatbot avatar, no mascots in core UI.
- No points counters, XP, badges or leaderboards in the MVP.
- WCAG 2.2 AA: status never by colour alone (colour + icon + label); map sites also in an accessible list.

## Environment variables
`NEXT_PUBLIC_API_URL` (baked in at build time — set per environment in CI as a build arg),
`NEXT_PUBLIC_MAP_STYLE_URL` (optional). Keep `.env.example` updated; `.env.local` is git-ignored.
Never put secrets in `NEXT_PUBLIC_*` variables; they are visible in the browser.

## Hard rules
- Copy is short, concrete and respectful of teens and adults ("19 days unseen", not "the river is lonely").
- Safety copy appears on every mission brief ("Photo from the bank only").
- Anything simulated shows a visible "Simulated, illustrative" label.
- Credit OneAquaHealth (sites), Open-Meteo (weather) and OpenStreetMap (tiles) in the UI footer and README.

## Docker
`next.config` uses `output: 'standalone'`. Multi-stage `Dockerfile` on `node:20-alpine`, non-root user,
port 3000, accepts `ARG NEXT_PUBLIC_API_URL` at build time.

## CI/CD (`.github/workflows/ci-cd.yml`, already provided)
PR: lint, typecheck, unit tests, production build. Push to main: build image in Azure Container Registry with
the production API URL, update the Container App, smoke-test the home page.
Keep OIDC auth (`azure/login`); never add cloud passwords as secrets.

## Definition of done for a screen
Matches the PRD layout and tokens, works at 390 px wide and on desktop, keyboard accessible,
loading/empty/error states handled, no console errors.
