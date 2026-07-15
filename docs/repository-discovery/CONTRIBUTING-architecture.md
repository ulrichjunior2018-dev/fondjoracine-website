# Contributing — Architecture & Module Boundaries

This guide keeps the codebase safe for **10+ developers working in parallel** and enforces **separation of concerns** (no mixed code). It operationalizes [`PRD-architecture-future-readiness.md`](./PRD-architecture-future-readiness.md).

> Non-negotiable inherited constraints: do **not** change the tech stack, color palette, or typography, and do **not** break the live site.

---

## 1. The layers (dependencies point downward only)

```
presentation  →  api  →  services  →  domain
                                   ↘  lib (adapters)
```

| Layer                                   | Path                                                 | May import                                       | Must NOT import                                                              |
| --------------------------------------- | ---------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------- |
| Presentation (UI)                       | `src/app/**`, `src/features/**`, `src/components/**` | `lib/api-client`, `components`, `domain` (types) | `services/**`, `lib/supabase`, `lib/database`, direct DB                     |
| API (HTTP contract)                     | `src/app/api/v1/**`                                  | `services/**`, `domain`, `lib/api`, `lib/auth`   | `features/**`, `components/**`                                               |
| Services (business logic + data access) | `src/services/**`                                    | `domain`, `lib/**`                               | `app/**`, `features/**`, `components/**`                                     |
| Domain (pure)                           | `src/domain/**`                                      | `zod`, other `domain`                            | anything framework/infra (`next`, `react`, `@supabase/*`, `features`, `lib`) |
| Lib (adapters)                          | `src/lib/**`                                         | `config`, `domain`, external SDKs                | `features/**`, `app/**`                                                      |

**Golden rules**

1. **No business logic in UI or route handlers.** Handlers validate input (Zod) and delegate to a service. Components render and call the API client.
2. **One service owns each table's writes.** Need another context's data? Call its service — don't query its tables directly.
3. **One responsibility per file.** No "god" modules mixing multiple contexts.
4. **The API is the only public contract.** Web, admin, and future mobile all consume `/api/v1` through `src/lib/api-client`.

---

## 2. Bounded contexts & owners

Ownership is declared in [`.github/CODEOWNERS`](../../.github/CODEOWNERS). Contexts:

`platform` · `identity` · `catalog` · `orders` (cart+orders) · `payments` · `shipping` · `pricing/promotions` · `inventory` · `reviews` · `consultations` · `notifications` · `analytics` · `content/cms` · `admin` · `storefront` (UI) · `design-system` · `architecture` (docs).

A change touching another team's context requires that team's review.

---

## 3. Adding a new API endpoint (the standard recipe)

1. **Domain**: add/extend Zod schema + types in `src/domain/<context>/`.
2. **Service**: implement logic in `src/services/<context>/` (accept a `SupabaseClient` argument — dependency injection).
3. **Handler**: create `src/app/api/v1/<context>/route.ts` — thin: `parseJsonBody` → service → `ok()/fail()`.
4. **SDK**: add a typed resource in `src/lib/api-client/resources/<context>.ts` and export it from `index.ts`.
5. **Consume**: UI/features call the resource via `apiClient` — never `fetch` a raw URL, never import a service into a component.

### Example (shape to copy)

```ts
// src/lib/api-client/resources/catalog.ts
import type { ApiClient } from "../client";

export type ProductSummary = { id: string; slug: string; title: string; priceCents: number };

export function listProducts(client: ApiClient): Promise<ProductSummary[]> {
  return client.get<ProductSummary[]>("/products");
}
```

```ts
// src/app/api/v1/products/route.ts
import { ok, fail } from "@/lib/api/responses";
import { listActiveProducts } from "@/services/commerce/catalog-service";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    return ok(await listActiveProducts(supabase));
  } catch (error) {
    return fail(error);
  }
}
```

---

## 4. Versioning & backward compatibility

- New contract lives under `/api/v1`. Existing `/api/*` routes stay until clients migrate (strangler pattern).
- Never break a shipped `/v1` response shape; add fields, don't remove/rename. A breaking change means `/v2`.
- The response envelope is always `{ data }` on success and `{ error: { code, message } }` on failure.

---

## 5. Database changes

- **Additive migrations only** (new tables / columns / enum values). Never drop or repurpose a live column in the same migration.
- Reuse the existing schema — most of the platform already exists (see `PRD-architecture-future-readiness.md` §4). Do not recreate catalog, orders, payments, etc.
- After schema changes, regenerate types: `npm run db:types` (requires Supabase credentials; see §7).

---

## 6. Definition of Done (every PR)

- [ ] Domain types/Zod updated where inputs changed
- [ ] Business logic isolated in a service (not in UI/handler)
- [ ] Thin `/api/v1` handler
- [ ] API client resource + types updated
- [ ] No cross-layer imports (see §1 table)
- [ ] `npm run typecheck` and `npm run lint` pass
- [ ] No palette / typography / tech-stack change
- [ ] Backward compatible (or a documented `/v2`)

---

## 7. Type generation (setup)

Once Supabase credentials are available, generate typed DB bindings:

```bash
# requires SUPABASE_PROJECT_ID and a logged-in Supabase CLI
npm run db:types
```

This writes `src/lib/database/types.generated.ts`; clients should then be typed as `SupabaseClient<Database>`. Until then the current stub in `src/lib/database/schema.ts` remains, but new code should import from the generated file when present.
