# FCinema – AI Agent Guide

> TL;DR: This Nx + pnpm monorepo hosts a single React-Vite frontend (`apps/fe-react-app`). The app talks to a Spring-Boot backend via auto-generated React-Query clients. Use **pnpm** commands (never npm/yarn) and Nx targets.

## Big Picture (read once)

1. **Frontend location** – all product code lives under `apps/fe-react-app/src`. Features are grouped in `feature/<domain>` (auth, booking, manager, …).
2. **Networking** – `src/utils/api.ts` exports `$api` (openapi-react-query). Domain-specific hooks in `src/services/**` wrap `$api` for components.
3. **Auth** – `AuthProvider` (cookie persistence) + `useAuth()` + `RoleRoute` enforce `ADMIN | STAFF | MEMBER` access rules.
4. **UI stack** – Tailwind + **Shadcn/ui**. Customized primitives reside in `src/components/Shadcn/` and `src/components/shared/`.
5. **Type safety** – the backend OpenAPI schema generates `schema-from-be.d.ts`; regenerate with `pnpm --filter fe-react-app generate-schema`.

## Daily Commands

```bash
# Start dev server with hot reload
pnpm nx dev fe-react-app --skip-nx-cache

# Typecheck / Build / Lint via Nx cache
pnpm nx typecheck fe-react-app --skip-nx-cache
pnpm nx build fe-react-app --skip-nx-cache
pnpm nx lint fe-react-app --skip-nx-cache

# Vitest tests
pnpm nx vitest fe-react-app --skip-nx-cache
```

Alway run in --skip-nx-cache mode
Alway run typecheck build lint successfully before give the user the respond

## Gotchas & Conventions

- Use the `@/` import alias instead of long relative paths (configured in `tsconfig.json` & `vite.config.js`).
- Keep **feature** code UI-only; put data access in **services**.
- Components = PascalCase; utilities = camelCase.
- When adding a Shadcn component, edit `components.json` then run `pnpm shadcn-ui add`.
- Regenerate OpenAPI types after _any_ backend contract change or CI will fail.
- Never call `fetch` directly – always go through `$api` or a service hook to keep React Query cache coherent.
- Protected pages must be wrapped by `RoleRoute`. Example: `src/feature/auth/RoleRoute.tsx`.

## Nx Tips

- Visualize the dependency graph: `pnpm nx graph` (or `--focus fe-react-app`).
- Prefer `pnpm nx <target> fe-react-app` over package.json scripts for deterministic, cached runs.
- CI leverages Nx remote cache (see `nx.json`).

## External Services

- Backend: `https://fcinema-spring-ujhbb.ondigitalocean.app/movie_theater`.
- Cloudflare R2 handles asset uploads (`src/utils/cloudflare.utils.ts`).

---

_Update this file when workflows or folder structures change._
