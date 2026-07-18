# Extensibility — add / remove / update without rewrites

**Status:** Canonical  
**Applies to:** entire codebase (web, API, services, future mobile)  
**Companions:** [`ARCHITECTURE.md`](./ARCHITECTURE.md), [`repository-discovery/PRD-architecture-future-readiness.md`](./repository-discovery/PRD-architecture-future-readiness.md)

---

## 1. Goal

When product wants a new payment method, signup method, notification channel, shipping zone, media backend, or account section, engineers should:

1. Add a small module
2. Register it
3. Optionally flip an env flag

They should **not** rewrite checkout, login, order services, or half the UI.

---

## 2. The pattern (descriptor + registry)

```
src/lib/<capability>/
  types.ts           # interface + shared option DTOs
  registry.ts        # list / get / filter by config
  README.md          # how to add/remove
  providers/         # OR channels/ OR zones/ — one file per option
    foo.ts
    bar.ts
```

**Consumers** (services, pages, API routes) call:

- `getX(id)` / `listAvailableX()`
- and branch on **capabilities** (`kind`, `requiresY`), never on `"stripe"` / `"google"` strings.

**Optional public API** (for web + future mobile):

- `GET /api/v1/<capability>`
- `src/lib/api-client/resources/<capability>.ts`

This matches payments today (`/api/v1/payment-methods`) and identity (`/api/v1/identity-providers`).

---

## 3. Registries in this repo

| Capability    | Module                  | Purpose                                  |
| ------------- | ----------------------- | ---------------------------------------- |
| Payments      | `src/lib/payments`      | WhatsApp, MoMo, Orange, Stripe, …        |
| Identity      | `src/lib/identity`      | Password, Google, Apple, Facebook, phone |
| Notifications | `src/lib/notifications` | Admin email → SMS / push / Slack later   |
| Shipping      | `src/lib/shipping`      | Zones / geo rules for delivery messaging |
| Order status  | `src/lib/order-status`  | Labels/tones for customer + admin UI     |
| Media         | `src/lib/media`         | Cloudinary today → others later          |

Account **nav** (`src/features/account/lib/nav.ts`) is a lighter “feature list” registry: add a row + page when a section ships (`comingSoon`).

---

## 4. Layer rules (unchanged)

| Layer       | Role                                        |
| ----------- | ------------------------------------------- |
| `app/`      | Routes, compose features, call services/API |
| `features/` | UI; no vendor branching                     |
| `services/` | Business verbs; resolve registries          |
| `domain/`   | Pure types/schemas                          |
| `lib/`      | Adapters + **registries**                   |
| `config/`   | Env only                                    |

Dependencies point inward. Presentation never owns provider lists.

---

## 5. Checklist — “Should this be a registry?”

**Yes**, if any of these are true:

- We might add a second vendor/method next quarter
- Mobile/API must discover availability
- Multiple surfaces show the same list (login + security + settings)
- Env flags turn options on/off

**No**, if:

- It’s a one-off screen or static marketing copy
- It’s a single CMS document field
- Abstraction would be bigger than the feature

---

## 6. Anti-patterns (avoid)

```ts
// BAD — hardcoding in a page or service
if (method === "mtn_momo") { ... }
else if (method === "stripe") { ... }

// GOOD — capability from registry
const provider = getPaymentProvider(method);
if (provider.requiresTransactionReference) { ... }
```

```ts
// BAD — Google-only button component forever
<GoogleAuthButton />

// GOOD — render whatever is configured
<SocialAuthButtons /> // listSocialIdentityProviders()
```

---

## 7. How teams add work safely

1. Open the capability’s `README.md` under `src/lib/<capability>/`
2. Copy an existing provider module
3. Register it
4. Add env keys to `public-env` / `env` / `.env.example` if needed
5. Confirm UI/API pick it up with **zero** edits to unrelated features

If a capability registry does not exist yet, **create it** in `src/lib/<name>/` before scattering `if` branches.

---

## 8. Related

- Cursor rule: `.cursor/rules/extensibility-registry.mdc` (always on)
- PRD: future-readiness — “abstraction at every volatile boundary”
