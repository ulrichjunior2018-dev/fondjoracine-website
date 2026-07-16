# `src/features/elixir` — Sève Racine storefront (flagship feature)

**Layer:** Presentation (feature module)
**May import:** `components/*`, `services/*`, `domain/*`, `lib/*`, `config/*`, `i18n/*`
**Must NOT:** talk to Supabase directly (go through `services/*`) or be imported by `lib/`/`domain/`.

## What this folder is for

The premium one-product storefront for Sève Racine — the site's primary conversion surface. It owns the storefront UI, CMS-editable content, the order flow, and the hair-consultation experience.

## What lives here

- **`components/`** — `premium-storefront-page.tsx` (main composition), `landing-route-page.tsx`, `product-gallery.tsx`, `product-3d-scene.tsx`, `ingredient-gallery.tsx`, `texture-grid.tsx`, `image-compare-slider.tsx`, `luxury-card.tsx`, `guarantee-section.tsx`, `CheckoutTrustBar.tsx`, `checkout-button.tsx`, `order-flow.tsx`, `inquiry-form.tsx`, `whatsapp-cta.tsx`, `mobile-nav.tsx`, `cms-editable-section.tsx`, `hair-consultation-agent.tsx`.
- **`data/`** — `content.ts` (storefront content + `t()` localization helper) and `content-schema.ts` (its Zod schema).
- **`lib/`** — `cms.ts` (`getElixirContent`, `getWhatsAppUrl`) bridging content/CMS.

> Note: the live conversion path is the **WhatsApp CTA**; the structured `order-flow.tsx` UI is currently not mounted (kept behavior-preserving for when it's re-enabled).

## How to add something new

1. **New storefront section:** add a component in `components/`, feed it content from `data/content.ts`, and place it in `premium-storefront-page.tsx`. Wrap it in a `cms-editable-section` if it should be admin-editable.
2. **New editable content field:** extend `content-schema.ts` first, then `content.ts`, then read it via `cms.ts`.
3. **New order behavior:** put logic in `src/services/commerce/*` and call it; keep this layer presentational.
4. Respect reduced-motion for 3D/animation pieces.

## Rules & boundaries

- Product/ingredient facts are compliance-sensitive — mirror `src/content/formula.ts`; don't alter the 11-botanical list without a label/regulatory update.
- Data operations belong in services, not components.
- Don't reach into other features' internals.

## Related

- `src/services/commerce/one-product-order-service.ts` — order lifecycle
- `src/content/formula.ts` — verified formula facts
- `docs/repository-discovery/PRD-gsap-animations.md` — animation plans
