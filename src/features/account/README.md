# `src/features/account` — Customer auth & "My Account" dashboard

**Layer:** Presentation (feature)
**May import:** `components/*`, `domain/customer/*`, `lib/api-client/*`, `lib/supabase/browser.ts`, `config/env.ts`
**Must NOT:** call Supabase Postgres tables directly (that's `services/customer/customer-service.ts`) or read `process.env` directly (use `@/config/env`).

## What this feature is for

Everything a signed-in customer sees about their relationship with Maison Fondjo: signing in, and the account dashboard (orders, profile, addresses, security, notifications). Framed as a **hair care profile and brand relationship**, not just an order-history page — see `docs/repository-discovery/PRD-*` context and the nav comment below for where this grows.

## What lives here

- **`lib/auth-client.ts`** — browser-side Supabase auth calls (`signUp`, `signIn`, `signOut`, Google OAuth, password reset/update). Auth itself talks to Supabase directly from the client (the standard Next.js + Supabase pattern, so session cookies are set correctly); everything else (profile, addresses, orders, notification prefs) goes through `/api/v1/account/*` via the typed SDK (`lib/api-client/resources/account.ts`), never direct Supabase table access from components.
- **`lib/nav.ts`** — `accountNavGroups` (and flat `accountNavItems`), the single source of truth for the dashboard sidebar/drawer. Live items + `comingSoon` placeholders for deferred sections.
- **`components/auth-card.tsx`**, **`login-form.tsx`**, **`signup-form.tsx`**, **`forgot-password-form.tsx`**, **`reset-password-form.tsx`**, **`google-auth-button.tsx`** — auth UI, mounted by `app/login`, `app/signup`, `app/forgot-password`, `app/reset-password`.
- **`components/account-shell.tsx`** — mobile-first dashboard shell: hamburger on the right opens a slide-down feature menu; persistent sidebar on `lg+`. Light account palette (gray bg / near-black text / gold accents).
- **`components/profile-form.tsx`**, **`address-form.tsx`**, **`address-list.tsx`**, **`change-password-form.tsx`**, **`notification-preferences-form.tsx`**, **`sign-out-button.tsx`** — the essentials-tier dashboard pages' interactive pieces, mounted by `app/account/*/page.tsx`.

## Essentials shipped vs. deferred

Shipped (Version 1, per product direction): auth, dashboard home, orders (list + detail), profile, addresses, security (password + sessions), notifications (preference center).

Deferred by design — the DB/API layer is shaped so these are additive, not restructuring (see `supabase/migrations/000010_customer_accounts.sql` header):
Hair Profile, Consultation History (link to `hair_consultations`), Wishlist (table already exists), Reviews (table already exists), Billing (derive from `payments`), Support (tables already exist), Referral Program (`customers.referral_code` + `referrals` already exist), Loyalty Program, Saved Payment Methods (use provider tokenization, never store card data), Saved Hair Progress photos.

## How to add a new account section

1. Add the DB table (if needed) + RLS policy scoped by `customer_owns(customer_id)`.
2. Add functions to `services/customer/customer-service.ts` (or a new `services/customer/*-service.ts` if it's a large bounded context).
3. Add `app/api/v1/account/<section>/route.ts` + a resource file in `lib/api-client/resources/`.
4. Add a page under `app/account/<section>/page.tsx` and flip `comingSoon` off (or add a row) in `lib/nav.ts`.
5. Account pages inherit the light account palette from `account-shell` (token overrides). Prefer shared UI primitives (`components/ui/*`).

## Rules & boundaries

- Mobile-first: design for the hamburger slide-down menu first, then enhance at `lg:`.
- Never store raw payment card data — tokenize via the provider (see `src/lib/payments/README.md`).
- Google/Apple sign-in are feature-flagged (`NEXT_PUBLIC_AUTH_GOOGLE_ENABLED`) — the button renders `null` until enabled.

## Related

- `src/services/customer/customer-service.ts` — business logic backing this feature
- `src/app/api/v1/account/*` — the endpoints this feature calls
- `supabase/migrations/000010_customer_accounts.sql` — schema + future-feature rationale
