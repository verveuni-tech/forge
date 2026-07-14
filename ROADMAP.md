# Roadmap

## Built (Foundation + MVP loop)

- Design Token System (`src/index.css`, `src/styles/geometry.css`) — Forge color/type/shadow/motion tokens, per-component silhouettes
- Drizzle schema + Neon client + seed data (24 exercises, 5 workout splits)
- Vercel serverless API (`/api/*`) covering exercises, templates, sessions, sets, records, recommendations
- Progressive Overload Engine v1 (`src/lib/recommendation-engine`) — increase weight / stay / increase reps / plateau-deload, verified against forge.md's three worked examples
- Routing skeleton for all 15 forge.md screens (full or stub)
- Core loop: Home → Start Workout → Focus Mode (recommendation, weight/rep selectors, inline set logging, auto rest timer, exercise timeline) → Finish → Summary
- PWA setup (manifest, service worker via vite-plugin-pwa)
- Records screen wired to real data; Settings theme toggle; Onboarding proves the RHF+Zod pattern

## Not built yet (roadmap)

Deliberately deferred — see Forge.md for full spec of each:

- **Deep analytics** — strength progress charts, weekly volume by muscle group, exercise progression, monthly comparison (needs Recharts)
- **Recovery system** — per-muscle recovery scoring and readiness indicators
- **Muscle volume balance** — sets-per-muscle-group vs. target ranges
- **PR timeline** — historical view beyond the current Records list
- **Weekly Coach report** — automated weekly summary/suggestions
- **Body weight & progress photos**
- **Create Custom Workout** screen (Screen 14)
- **Search Overlay** (Screen 15)
- **Exercise Library / Exercise Detail** — currently stub screens; need search, filtering, per-exercise charts
- **History** — currently a stub; needs the calendar view from Screen 8
- **Coach** screen — currently a stub; needs a running feed of recommendations, not just the Home teaser
- Real spring-physics motion (current motion uses CSS `cubic-bezier` easing, not a physics engine)
- Auth / multi-user (intentionally out of scope — personal app)
