# FONDJO Architecture

FONDJO uses Next.js App Router with strict TypeScript and clean architectural boundaries.

## Layers

- `src/app`: route handlers, metadata routes, layouts, and route-level states.
- `src/components`: reusable presentational UI and feedback primitives.
- `src/domain`: framework-independent business entities and domain types.
- `src/services`: application service and repository contracts.
- `src/lib`: infrastructure adapters for Supabase, Stripe, Resend, Cloudinary, SEO, logging, and API responses.
- `src/hooks`: reusable client hooks.
- `src/state`: reusable state primitives.
- `src/config`: validated runtime configuration.

## Rules

- Server Components are the default for route UI.
- Service SDKs are initialized lazily inside getter functions.
- Authorization must be validated in server components, server actions, or route handlers, not only request interception.
- Environment access must go through `src/config/env.ts`.
- Domain types must not import framework or infrastructure modules.
