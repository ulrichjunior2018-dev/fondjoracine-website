# `src/lib/identity` — Auth method abstraction (system-wide)

**Layer:** Infrastructure  
**May import:** `config/public-env`, domain types  
**Must NOT:** import `features/*` UI, or hardcode provider branching in consumers.

## Why this exists

**Every** surface that cares about how someone signs in must stay stable when
product adds or removes methods (Google today; Apple, Facebook, phone later):

| Surface          | Consumer                                               |
| ---------------- | ------------------------------------------------------ |
| Login / signup   | `SocialAuthButtons` → `listSocialIdentityProviders()`  |
| Account Security | `listSecurityIdentityProviders()` + linked identities  |
| Account Settings | counts via `listConfiguredIdentityProviders()`         |
| Auth callback    | provider-agnostic name sync (`user-identities.ts`)     |
| Public API       | `GET /api/v1/identity-providers`                       |
| Typed SDK        | `listIdentityProviders(apiClient)`                     |
| Auth service     | `supabaseAuthService.listAvailableIdentityProviders()` |

Same pattern as `src/lib/payments` and `src/lib/notifications`: **add a module +
one registry line**, flip an env flag — no rewrite of pages or flows.

## What lives here

- **`types.ts`** — descriptor, ids, kinds, **surfaces** (`auth_gate` | `security` | `api`)
- **`registry.ts`** — list/get/filter by surface
- **`user-identities.ts`** — map Supabase `user.identities` → registry ids; OAuth name parsing
- **`providers/`** — `password`, `google`, `apple`, `facebook`, `phone`

## How to add a method (applies everywhere automatically)

1. Extend `IdentityProviderId` (and `IdentityOAuthSlug` if OAuth).
2. Create `providers/<id>.ts` with `surfaces`, `isConfigured`, etc.
3. Register it in `registry.ts`.
4. Add `NEXT_PUBLIC_AUTH_<NAME>_ENABLED` in `public-env.ts` + `.env.example`.
5. Configure the IdP in Supabase.
6. Set the flag to `"true"`.

Login, signup, Security, Settings, and `/api/v1/identity-providers` pick it up.

## How to remove or pause

Set the env flag to `"false"` — UI buttons and the API list drop it. Or remove the registry line.

## Rules

- No `if (provider === "google")` in pages or services.
- Use `listIdentityProvidersForSurface("auth_gate" | "security" | "api")`.
- Secrets stay in Supabase / IdP consoles; Next env only holds **enable flags**.

## Related

- `src/features/account/components/social-auth-buttons.tsx`
- `src/app/api/v1/identity-providers/route.ts`
- `src/lib/payments/README.md` — parallel payment registry
