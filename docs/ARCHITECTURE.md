# FONDJO Architecture

FONDJO uses Next.js App Router with strict TypeScript and clean architectural boundaries.

## Layers

- `src/app`: route handlers, metadata routes, layouts, and route-level states.
- `src/components`: reusable presentational UI and feedback primitives.
- `src/domain`: framework-independent business entities and domain types.
- `src/services`: application service and repository contracts.
- `src/lib`: infrastructure adapters **and capability registries** (payments, identity, notifications, shipping, order-status, media, …).
- `src/hooks`: reusable client hooks.
- `src/state`: reusable state primitives.
- `src/config`: validated runtime configuration.

## Extensibility (add / remove / update without rewrites)

Volatile boundaries — anything we may swap or grow (payments, signup methods, notification channels, shipping zones, media backends, order-status presentation) — use a **descriptor + registry** in `src/lib/<capability>/`.

- **Add** a method → new module + registry line (+ env flag).
- **Remove / pause** → flip `isConfigured` / env, or drop the registry entry.
- **Consumers** read capabilities from the registry; they never hardcode vendor names.

Full pattern, checklists, and anti-patterns: **[`docs/EXTENSIBILITY.md`](./EXTENSIBILITY.md)**.  
Agent rule: `.cursor/rules/extensibility-registry.mdc`.

## Rules

- Server Components are the default for route UI.
- Service SDKs are initialized lazily inside getter functions.
- Authorization must be validated in server components, server actions, or route handlers, not only request interception.
- Environment access must go through `src/config/env.ts` (or `public-env.ts` for client-safe `NEXT_PUBLIC_*`).
- Domain types must not import framework or infrastructure modules.
- Do not scatter `if (provider === "…")` across features — extend the registry instead.
