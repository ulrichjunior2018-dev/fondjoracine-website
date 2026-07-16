# `src/lib/api-client` — Typed API SDK

**Layer:** Infrastructure (shared client)
**May import:** `domain/*` (types), its own modules
**Must NOT:** import server-only code, Supabase, or `services/*`. This must be safe to run in a browser and reusable by a future React Native / external client.

## What this folder is for

The one sanctioned way to call the `/api/v{n}` contract. Web components and any future mobile app go through this SDK instead of raw `fetch`, so URL building, auth headers, the response envelope, and error normalization behave identically everywhere.

## What lives here

- **`client.ts`** — `ApiClient` class: builds URLs (`/api/{version}{path}`), attaches bearer token if provided, sends the request, unwraps `{ data }` / throws on `{ error }`.
- **`types.ts`** — transport contract: `ApiEnvelope`, `RequestOptions`, `ApiClientConfig`, HTTP method types.
- **`errors.ts`** — `ApiClientError` (mirrors the server error envelope: stable `code` + `status`).
- **`resources/`** — one file per resource of typed functions: `health.ts`, `catalog.ts` (`listProducts`, `getProduct`), `payments.ts` (`listPaymentMethods`), `account.ts` (profile/addresses/orders/notifications for the signed-in customer).
- **`instance.ts`** — `getApiClient()`, a browser singleton with no config (same-origin requests carry the Supabase session cookie automatically). Client components use this instead of constructing their own `ApiClient`.
- **`index.ts`** — barrel that re-exports the client + all resources.

## How to add a new resource

1. Confirm (or add) the matching `app/api/v1/<resource>/route.ts`.
2. Create `resources/<resource>.ts`: export functions `(client: ApiClient, …args) => client.get/post<T>(path, …)`. Type the return with `domain/*` types where possible.
3. Re-export it from `index.ts`.
4. Consumers call it with a configured `ApiClient` instance — never build the URL by hand.

## Rules & boundaries

- Framework-free & browser-safe (no Node/Supabase imports).
- Keep request/response types aligned with the domain schemas the API validates against.
- Auth is injected via `getAuthToken` in `ApiClientConfig` (cookies for web, bearer for mobile).

## Related

- `src/app/api/v1/*` — the endpoints this SDK consumes
- `src/lib/api/*` — the server side of the same envelope
- `src/domain/*` — shared response types
