# `src/i18n` — Locale dictionaries

**Layer:** Content / localization
**May import:** plain TS (types only)
**Must NOT:** contain components or logic beyond dictionary lookup.

## What this folder is for

Translated UI strings, keyed and grouped, for the supported languages. This is the home for anything a user reads that must exist in more than one language.

## What lives here

- **`dictionaries/en.ts`**, **`fr.ts`**, **`es.ts`** — per-locale string maps.
- **`dictionaries/index.ts`** — aggregates and exposes the dictionaries (and the locale type).

> Note: a second, context-based i18n mechanism also exists (`src/lib/i18n-context.tsx`). When adding strings, follow whichever system the target surface already uses, and prefer consolidating over introducing a third path.

## How to add something new

**A new string:**

1. Add the key to **every** locale file (`en`, `fr`, `es`) so no language is left with a missing key.
2. Keep the key structure parallel across locales.
3. Reference it through the dictionary accessor rather than hardcoding text in components.

**A new locale:**

1. Add `dictionaries/<locale>.ts` mirroring the full key set of `en.ts`.
2. Register it in `dictionaries/index.ts` and the locale type.
3. Check routing/language-switch UI (`components/ui/Language*`) handles the new option.

## Rules & boundaries

- Never ship a partial locale (missing keys).
- Compliance-sensitive product copy still follows `src/content/formula.ts` rules.

## Related

- `src/lib/locale.ts`, `src/lib/i18n-context.tsx` — locale resolution
- `src/content/*` — non-translated editorial copy
