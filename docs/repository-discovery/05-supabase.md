# 05 — Supabase Integration

## Role in the application

Supabase provides:

1. **Postgres database** (schema via SQL migrations)
2. **Auth** (cookie sessions for admin / legacy authenticated APIs)
3. **RLS policies** and SQL helpers (`is_admin`, `has_admin_permission`, ownership checks)

It does **not** (in this repo) provide Storage buckets, Edge Functions, Realtime subscriptions, or generated TypeScript DB types.

## Client setup

| Client          | File                             | Mechanism                                    |
| --------------- | -------------------------------- | -------------------------------------------- |
| Browser         | `src/lib/supabase/browser.ts`    | `createBrowserClient` + anon key             |
| Server (user)   | `src/lib/supabase/server.ts`     | `createServerClient` + Next `cookies()`      |
| Admin / service | `src/lib/database/admin.ts`      | `createClient` + `SUPABASE_SERVICE_ROLE_KEY` |
| Public CMS anon | `src/features/elixir/lib/cms.ts` | Singleton anon client, no session            |

**Note:** `createSupabaseBrowserClient` is defined but **not imported** elsewhere in `src/` (scaffolding).

Env keys (optional with degradation): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — validated in `src/config/env.ts`.

## Authentication

See [06-authentication.md](./06-authentication.md).

- App code uses `supabase.auth.getUser()` only.
- No `signIn` / `signUp` / `signOut` / `getSession` usage in `src/`.
- Admin pages/APIs rely on an existing Auth session + profile role permissions.

## Tables

Full schema inventory: [10-database.md](./10-database.md).

Headline groups:

- Identity: `profiles`, `admin_roles`, `admin_user_roles`
- Catalog: `products`, variants, images, categories, collections
- Commerce: carts, orders, payments, shipments, wishlists, reviews
- One-product ops: extended `orders` columns, `storefront_content`, `newsletter_signups`, `inner_circle_members`, `hair_consultations`

## Relationships (summary)

`auth.users` → `profiles` → `customers` / `admin_user_roles`  
`products` → `product_variants` → `cart_items` / `order_items`  
`orders` → `order_items`, `payments`, `shipments`  
CMS and lead tables are largely standalone JSON/document style.

## Storage

**Not used.** Images are local `public/images` URLs and/or remote URLs (CMS). Next `images.remotePatterns` allows `res.cloudinary.com`. No `storage.from` usage found.

## Policies (RLS)

Pattern from migrations:

- Public read for active catalog / approved reviews / published CMS
- Customer ownership via security-definer helpers
- Admin via `has_admin_permission('resource.read|write')`
- Service role for consultation inserts; open insert for newsletter (with check true)

## Edge Functions

**None.** No `supabase/functions/` directory.

## Migrations

Located in `supabase/migrations/`:

| File                                           | Purpose                                    |
| ---------------------------------------------- | ------------------------------------------ |
| `000001_initial_foundation.sql`                | `profiles`                                 |
| `000002_ecommerce_backend.sql`                 | Full ecommerce schema, enums, RLS, helpers |
| `000003_newsletter_signups.sql`                | Newsletter                                 |
| `000004_one_product_storefront_cms.sql`        | `storefront_content` + seed                |
| `000005_growth_activation_elixir_homepage.sql` | CMS content seed merges                    |
| `000006_elixir_cms_editable_content.sql`       | Inventory/testimonials/social CMS merges   |
| `000007_one_product_order_flow.sql`            | Manual payment columns + status values     |
| `000008_admin_dashboard.sql`                   | `inner_circle_members`                     |
| `000009_hair_consultations.sql`                | Consultation leads                         |

No `supabase/config.toml` in repo — local Supabase CLI project config could not be determined from files.

## Realtime

**Not used** in application code (no channels/subscriptions). `@supabase/realtime-js` is transitive via supabase-js.

## How queries are made

```
Route / RSC
  → createSupabaseServerClient() OR createAdminClient() OR CMS anon
  → services/*.ts
  → client.from('table').select|insert|update|...
  → optional .rpc('has_admin_permission')
```

Types: hand stub `src/lib/database/schema.ts` (`Tables: Record<CommerceTable, never>`). Column-level typing is **not** generated.
