# `src/state` — Client state helpers

**Layer:** Presentation (state utilities)
**May import:** React
**Must NOT:** hold server/data-access logic.

## What this folder is for

Small, reusable primitives for building typed client state/context. Keeps context creation consistent instead of hand-rolling `createContext` + null checks everywhere.

## What lives here

- **`create-safe-context.tsx`** — factory that creates a typed React context plus a hook that throws a clear error when used outside its provider (no silent `undefined`).

## How to add something new

1. For a new shared context, use `create-safe-context` rather than raw `createContext`.
2. Keep the state shape minimal and typed; colocate the provider with the feature that owns it (or in `src/providers` if it's app-wide).
3. Put derived/business logic in hooks or services, not in the context value itself.

## Rules & boundaries

- Utilities only — no domain rules here.
- Prefer local/feature state; reach for shared context only when multiple distant components need it.

## Related

- `src/providers/*` — app-wide providers
- `src/hooks/*` — client logic
