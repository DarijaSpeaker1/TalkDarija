# TalkDarija

TalkDarija is a playful Moroccan Darija learning app with personalized placement, interactive lessons, vocabulary review, and local progress tracking.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/talkdarija/src/App.tsx` — app routing, onboarding flow, learning shell, and page composition
- `artifacts/talkdarija/src/data/content.ts` — placement questions, course curriculum, lesson exercises, vocabulary, and achievements
- `artifacts/talkdarija/src/hooks/use-local-app.ts` — safe localStorage-backed learner state and progress actions
- `artifacts/talkdarija/src/index.css` — TalkDarija visual theme, responsive layout utilities, light/dark modes, and motion
- `artifacts/talkdarija` — deployable frontend artifact

## Architecture decisions

- The first version is intentionally frontend-only and stores learner progress on the current device using safe localStorage parsing and defaults.
- Placement results are calculated from categorized question performance and determine the recommended starting unit; self-assessment is only a signal.
- Lesson content is kept outside the main React component so the curriculum can grow without turning the UI into one large file.
- The app uses a coastal-souk visual language with indigo, sun-gold, terracotta, and parchment tones rather than copying another language app's branding.

## Product

TalkDarija guides a learner through welcome onboarding, a 12-question placement test, personalized course entry, a 10-unit course path, mixed-format lesson exercises, hearts, XP, streaks, daily goals, diamonds, vocabulary review, achievements, profile, and theme/settings controls.

## User preferences

No additional preferences recorded.

## Gotchas

- The frontend workflow supplies `PORT` and `BASE_PATH`; use the managed artifact workflow rather than starting Vite directly for preview checks.
- Resetting progress and retaking placement are intentionally separate actions and require deliberate user interaction.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
