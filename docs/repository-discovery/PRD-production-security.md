# PRD — Production Security Architecture

**Status:** Active — phased delivery  
**Type:** Security / Platform foundation  
**Owner:** Platform / Engineering  
**Brand:** Maison Fondjo  
**Companion docs:** [`PRD-architecture-future-readiness.md`](./PRD-architecture-future-readiness.md), [`06-authentication.md`](./06-authentication.md), [`05-supabase.md`](./05-supabase.md), [`11-environment.md`](./11-environment.md)

---

## 1. Vision

> Security is part of Maison Fondjo’s architecture from day one—not an afterthought. We protect customer accounts, payments, and business data with **production-grade** controls while keeping the storefront easy to use.

We do not need military-grade security. We need a clear permission model, server-side trust boundaries, and defenses that scale to multiple countries, mobile apps, and future products **without rewriting the security model**.

---

## 2. Guiding Principles

1. **Permissions over pages.** Authorize by role/permission (`customer`, `admin` + fine-grained admin permissions; future `support` / `owner` as first-class app concepts), not only by “is logged in.”
2. **Never trust the frontend.** Prices, totals, order ownership, and identity are verified on the server.
3. **Defense in depth.** Auth → middleware/route guards → server validation → RLS → webhook verification.
4. **Secrets stay server-side.** Only genuine public values use `NEXT_PUBLIC_*`.
5. **Payment truth comes from the provider.** Orders become paid only after verified webhooks (or explicit admin verification for manual MoMo).
6. **Reuse before rebuild.** Prefer Supabase Auth, existing RBAC (`has_admin_permission`), Zod schemas, and the `audit_logs` table.

---

## 3. Overall Security Flow

```text
Visitor
  ↓
HTTPS (Vercel)
  ↓
Next.js (security headers + middleware session refresh)
  ↓
Supabase Auth (JWT / cookies)
  ↓
Route protection (public | customer | admin + permission)
  ↓
Server-side validation (Zod) + origin checks
  ↓
Supabase Database (RLS)
  ↓
Payments (Stripe today · KPay / MoMo later)
  ↓
Webhook signature verification
  ↓
Order updated + audit log
```

---

## 4. Requirements

### 4.1 Authentication (P0)

| ID     | Requirement                                          | Acceptance criteria                                                      |
| ------ | ---------------------------------------------------- | ------------------------------------------------------------------------ |
| AUTH-1 | Use Supabase Auth; never store passwords in app code | Email/password via Supabase only                                         |
| AUTH-2 | Google Sign-In                                       | Enabled via `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED` + Supabase provider config |
| AUTH-3 | Future providers (Apple, Facebook, phone)            | Identity registry stubs; flags default off                               |
| AUTH-4 | Password reset + email verification                  | Supabase flows + `/auth/callback` open-redirect guard                    |

### 4.2 Access levels & route protection (P0)

| Surface                                                          | Access                                                                                     |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Homepage, Shop, Product, Story, FAQs, Contact, Learn, Diagnostic | **Public**                                                                                 |
| Account, Orders, Addresses, Wishlist (future)                    | **Customer** (authenticated)                                                               |
| Checkout                                                         | **Public guest checkout allowed** (intentional); signed-in users get `customer_id` linkage |
| Admin dashboard & `/api/admin/*`                                 | **Admin** + `has_admin_permission(...)`                                                    |

| ID      | Requirement                                                   | Acceptance criteria                            |
| ------- | ------------------------------------------------------------- | ---------------------------------------------- |
| ROUTE-1 | Edge middleware refreshes Supabase session cookies            | `src/middleware.ts`                            |
| ROUTE-2 | Unauthenticated `/account/**` → login                         | Middleware + layout double-check               |
| ROUTE-3 | Unauthenticated `/admin/**` → login                           | Middleware; non-admins see locked UI / API 403 |
| ROUTE-4 | Every sensitive API verifies session / permission before data | `requireApiUser` / `requireAdminPermission`    |

### 4.3 Row Level Security (P0)

| ID    | Requirement                                                     | Acceptance criteria                                  |
| ----- | --------------------------------------------------------------- | ---------------------------------------------------- |
| RLS-1 | Customers read/update only their own profile, addresses, orders | Existing RLS helpers (`customer_owns`, `order_owns`) |
| RLS-2 | Customers cannot escalate `profiles.role`                       | Trigger / policy hardening (migration)               |
| RLS-3 | Admin data gated by permission RPCs                             | `is_admin`, `has_admin_permission`                   |

### 4.4 Never trust the frontend (P0)

| ID      | Requirement                                                                 | Acceptance criteria                             |
| ------- | --------------------------------------------------------------------------- | ----------------------------------------------- |
| TRUST-1 | Order totals computed server-side from catalog/CMS                          | No client-supplied total in create-order schema |
| TRUST-2 | Stripe fulfillment checks `payment_status` and amount when currencies align | Reject unpaid / overcharge sessions             |
| TRUST-3 | Order ownership enforced on account APIs                                    | Session + RLS / service filters                 |

### 4.5 Environment variables (P0)

| Public (`NEXT_PUBLIC_*`)                                                                     | Server-only                                                                                                    |
| -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Site URL, Supabase URL/anon, Stripe publishable, Cloudinary cloud name, auth flags, WhatsApp | Service role, Stripe secret + webhook secret, Resend, Cloudinary API secret, admin email, MoMo display numbers |

### 4.6 Payment webhooks (P0 Stripe · P1 KPay)

| ID    | Requirement                                            | Acceptance criteria                                              |
| ----- | ------------------------------------------------------ | ---------------------------------------------------------------- |
| PAY-1 | Stripe webhook signature verified before fulfill       | `constructEvent` + `STRIPE_WEBHOOK_SECRET`                       |
| PAY-2 | Never mark paid solely because browser hit success URL | Confirmation page is display-only; DB updated by webhook / admin |
| PAY-3 | Future KPay / MoMo provider webhooks                   | Same pattern when providers go live                              |

### 4.7 Rate limiting (P1)

| ID     | Requirement                                                       | Notes                                              |
| ------ | ----------------------------------------------------------------- | -------------------------------------------------- |
| RATE-1 | Limit order creation & consultation spam                          | In-memory today (per instance)                     |
| RATE-2 | Distributed limiter (Upstash/Redis) for production multi-instance | Phase 2                                            |
| RATE-3 | Auth brute-force                                                  | Rely on Supabase Auth limits; optional proxy later |

### 4.8 Input validation (P0)

All mutating APIs validate with Zod (`parseJsonBody` / domain schemas): email, phone, address, quantities, admin payloads.

### 4.9 HTTPS (P0)

Production on Vercel with HTTPS. App assumes `https://` site URLs. HSTS header set in `next.config.ts`.

### 4.10 Security headers (P0 / P1)

| Header                                                                                                  | Priority                                          |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors` | P0 (shipped)                                      |
| `Strict-Transport-Security`                                                                             | P0                                                |
| Full CSP (`script-src` / `connect-src` allowlists for Stripe, Supabase, Cloudinary)                     | P1 (ship pragmatic baseline; tighten iteratively) |

### 4.11 CSRF (P1)

Cookie sessions via `@supabase/ssr` (SameSite). Mutating storefront/admin APIs assert same-origin `Origin`/`Referer` where browsers send them. Webhooks exempt (signature auth).

### 4.12 Audit logging (P0 foundation · P1 coverage)

| Event                                       | Priority                                      |
| ------------------------------------------- | --------------------------------------------- |
| Order placed                                | P0                                            |
| Payment confirmed (Stripe / admin)          | P0                                            |
| Admin order status changes                  | P0                                            |
| User registration / login / password change | P1 (Supabase Auth logs + optional app mirror) |
| Admin catalog/content mutations             | P1                                            |

Use existing `audit_logs` table; write from server with service role.

### 4.13 Admin security (P0)

- Role + permission matrix (Owner / Commerce Manager / Support Specialist seeded).
- Admin APIs hard-fail without permission.
- Future: MFA for admins (P2).

### 4.14 File upload security (P2)

No binary upload pipeline yet. When added: MIME allowlist, size limits, Supabase Storage or signed Cloudinary uploads, no arbitrary public ACL.

### 4.15 Dependency maintenance (ongoing)

Keep dependencies updated; monitor advisories (`npm audit`, Dependabot/GitHub). `eslint-plugin-security` remains in the toolchain.

---

## 5. Capability audit (codebase vs this PRD)

**Legend:** ✅ Met · 🟡 Partial · 🔴 Gap (addressed in delivery plan)

| Area                                            | Status | Notes                                                   |
| ----------------------------------------------- | ------ | ------------------------------------------------------- |
| 1. Supabase Auth (email, Google, reset, verify) | ✅     | Apple/Facebook stubs only                               |
| 2. Route protection                             | 🟡→✅  | Was layout/API only; middleware added                   |
| 3. RLS                                          | 🟡→✅  | Broad RLS existed; profile `role` escalation locked     |
| 4. Server-side pricing                          | ✅     | Elixir order path; Stripe amount check hardened         |
| 5. Env split                                    | ✅     | Zod-validated `env.ts`                                  |
| 6. Stripe webhooks                              | ✅     | KPay 🔴 (deferred until provider live)                  |
| 7. Rate limiting                                | 🟡     | In-memory on order/consultation; not distributed        |
| 8. Zod validation                               | ✅     | Most mutating routes                                    |
| 9. HTTPS                                        | ✅     | Vercel + HSTS                                           |
| 10. Security headers                            | 🟡→✅  | HSTS + stronger CSP baseline                            |
| 11. CSRF                                        | 🟡→✅  | SameSite + origin assertion helper                      |
| 12. Audit logging                               | 🔴→🟡  | Table existed; writers wired for orders/payments/admin  |
| 13. Admin RBAC                                  | ✅     | Permission strings + RPC                                |
| 14. File uploads                                | 🔴     | N/A until upload feature                                |
| 15. Permission model                            | ✅     | Design around permissions; expand roles without rewrite |

---

## 6. Delivery plan

### Phase 0 — Immediate hardening (this change set)

1. Security PRD (this document).
2. Migration: prevent non–service-role `profiles.role` changes.
3. `middleware.ts`: session refresh + `/account` / `/admin` gate.
4. HSTS + CSP baseline in `next.config.ts`.
5. Audit log writer + order/payment/admin events.
6. Same-origin checks on sensitive mutating APIs.
7. Stripe fulfill: require `paid` + reject overcharge when currency matches.

### Phase 1 — Production hardening

1. Distributed rate limiting.
2. Broader audit coverage + admin audit UI (`audit.read`).
3. Tighten CSP after monitoring (remove unsafe-eval if unused).
4. Origin checks on remaining mutating routes.
5. Stripe ↔ order amount reconciliation for promo codes (explicit discount metadata).

### Phase 2 — Expansion

1. KPay / MoMo webhook verification when providers ship.
2. Admin MFA.
3. File upload pipeline security.
4. First-class `support` / `owner` app roles if needed beyond SQL role names.
5. Auth proxy endpoints if app-level auth rate limits are required.

---

## 7. Non-goals

- Building a custom password store.
- Blocking guest checkout (business decision: guests may purchase).
- Full WAF / bot management (can add via Vercel later).
- Replacing Supabase RLS with app-only authorization.

---

## 8. Success metrics

- No customer can read another customer’s orders/addresses via API or direct PostgREST.
- No authenticated customer can set `profiles.role = 'admin'`.
- Unpaid Stripe sessions never confirm orders.
- Secrets never appear in client bundles (`NEXT_PUBLIC_` audit passes).
- Security events for orders/payments appear in `audit_logs`.

---

## 9. Open decisions

| Topic                            | Decision                                                                    |
| -------------------------------- | --------------------------------------------------------------------------- |
| Guest checkout                   | **Allowed** — security uses confirmation tokens + server pricing + webhooks |
| Admin soft lock vs hard redirect | Soft lock UI for wrong role; hard redirect if no session                    |
| Full CSP                         | Baseline now; iterative tighten in Phase 1                                  |
| Distributed rate limits          | Phase 1 (Upstash or equivalent)                                             |
