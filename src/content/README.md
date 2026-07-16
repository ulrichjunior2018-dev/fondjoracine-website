# `src/content` — Static marketing copy

**Layer:** Content (data)
**May import:** nothing framework-specific (plain TS data + types)
**Must NOT:** contain components or fetch logic.

## What this folder is for

Hardcoded, editorial copy and product facts that are part of the codebase (as opposed to CMS-editable content, which lives in the elixir feature/DB). Keeping copy here centralizes wording and makes it reviewable.

## What lives here

- **`copy.ts`** — general marketing/site copy.
- **`advisor-copy.ts`** — copy for the advisor/consultation surfaces.
- **`formula.ts`** — the verified 11-botanical formula and product facts. **Regulated content** — do not alter ingredient lists/labels without a corresponding label/DPML/regulatory update.

## How to add something new

1. Add a typed export to the relevant file (or a new module for a new surface).
2. If the copy is user-visible in multiple languages, prefer the locale dictionaries in `src/i18n` instead of hardcoding one language here.
3. Reference it from a component/feature — never inline duplicate strings.

## Rules & boundaries

- Product/ingredient facts are compliance-sensitive; treat `formula.ts` as source-controlled truth.
- For translatable UI strings, use `src/i18n`; for CMS-managed storefront content, use the elixir CMS.

## Related

- `src/i18n` — multilingual dictionaries
- `src/features/elixir/data` — CMS-editable storefront content
