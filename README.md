# Forge

The easiest workout tracker that thinks like an experienced gym partner. See [Forge.md](Forge.md) for the full product spec and design language, and [ROADMAP.md](ROADMAP.md) for what's built vs. planned.

## Stack

Vite + React 19 + TypeScript, Tailwind v4 (CSS-native theming, no `tailwind.config.*`), shadcn/ui on Base UI (`base-maia` style), hugeicons, React Router 8, Zustand, TanStack Query, Drizzle ORM + Neon Postgres, Vercel serverless functions under `/api`.

## Setup

```bash
npm install
cp .env.example .env   # add your Neon DATABASE_URL
npm run db:generate    # generate SQL migrations from src/db/schema.ts
npm run db:push        # apply schema to your Neon database
npm run db:seed        # seed exercise library + workout split templates
npm run dev
```

`npm run dev` works without `DATABASE_URL` set — every screen that hits `/api/*` degrades to a clear "connect your database" state instead of crashing. Once `DATABASE_URL` is set, restart the dev server to pick it up.

### API routing

All of `/api/*` is served by a single Vercel function, [`api/[...path].ts`](api/[...path].ts), which manually dispatches to handlers in `api/_handlers/` by matching path segments. This is deliberate: Vercel's Hobby plan caps a deployment at 12 Serverless Functions, and one file per route blew past that. `api/_handlers/*` and `api/_lib/*` are excluded from Vercel's automatic routing (leading underscore), so only the catch-all counts against the limit. Add a new endpoint by adding a handler file under `_handlers/` and registering it in the `routes` array in `api/[...path].ts` — don't add new top-level files directly under `api/`.

### Dev-only API emulation

Vite has no native concept of Vercel's `/api/*.ts` serverless functions. [`dev-api-plugin.ts`](dev-api-plugin.ts) is a dev-only Vite middleware that loads and executes `api/[...path].ts` under `npm run dev`, so local development matches production routing exactly — same catch-all, same route table, no separate list to keep in sync. Production deploys (Vercel) use their own native routing and don't touch this file.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server (Vite + emulated `/api`) |
| `npm run build` | Typecheck (`tsc -b`) then production build |
| `npm run typecheck` | Typecheck only, across app/api/node project references |
| `npm run lint` | ESLint |
| `npm run db:generate` | Generate SQL migrations from the Drizzle schema (no live DB needed) |
| `npm run db:push` | Push the schema to your Neon database |
| `npm run db:seed` | Seed exercises + workout templates (requires `DATABASE_URL`) |

## Adding shadcn components

```bash
npx shadcn@latest add <component>
```

Places primitives in `src/components/ui`. Domain-specific components (WorkoutCard, RecommendationPanel, CoachBubble, etc. — see Forge.md Section 10) live in `src/components/forge` instead; prefer those over generic `ui/*` primitives for anything workout-related.

## Project layout

- `src/pages` — route components, one folder per screen
- `src/components/forge` — domain components with their own silhouettes (never generic rounded-rectangle cards)
- `src/components/ui` — shadcn primitives
- `src/lib/recommendation-engine` — pure progressive-overload logic, no DB/UI dependency
- `src/store` — Zustand (active workout session state only; everything else is server state via TanStack Query)
- `src/db` — Drizzle schema, Neon client, seed script
- `api/[...path].ts` — the one Vercel function, routes to `api/_handlers/*`
- `api/_handlers` — one file per endpoint (excluded from Vercel's auto-routing)
- `api/_lib` — shared db client, error handling, zod schemas, recommendation/records helpers
