# 08 — Components

Categorization of UI across `src/components` and `src/features/*/components`. Paths are under `src/`.

---

## Layout

| Component                         | Path                          | Purpose                              |
| --------------------------------- | ----------------------------- | ------------------------------------ |
| AdvisorShell                      | `components/AdvisorShell.tsx` | Sticky nav/footer for advisor routes |
| Root layout                       | `app/layout.tsx`              | HTML shell, fonts, providers         |
| Container / SectionWrapper / Grid | `components/ui/*`             | Page structure primitives            |

---

## UI (design system)

All under `components/ui/`: `button`, `input`, `checkbox`, `radio-group`, `card`, `badge`, `modal`, `dropdown`, `tabs`, `accordion`, `table`, `pagination`, `breadcrumb`, `skeleton`, `loader`, `toast`, `typography`, `container`, `grid`, `SectionWrapper`, `Eyebrow`, `GoldLine`, `LanguageToggle`, `LanguageSuggestionBanner`, `LanguageBottle`, `text-reveal`, `magnetic-button`, `custom-cursor`, `micro-interactions`.

---

## Forms

| Component      | Path                                           | Notes                                  |
| -------------- | ---------------------------------------------- | -------------------------------------- |
| OrderFlow      | `features/elixir/components/order-flow.tsx`    | RHF+Zod; **not mounted** on live pages |
| InquiryForm    | `features/elixir/components/inquiry-form.tsx`  | WhatsApp inquiry; unused               |
| NewsletterForm | `features/home/components/newsletter-form.tsx` | Unused on pages                        |
| ReviewForm     | `features/commerce/components/review-form.tsx` | Legacy                                 |
| Admin forms    | Inside `admin-dashboard.tsx`                   | CMS/stock/Inner Circle edits           |

---

## Product

| Component                                                        | Path                                                     | Purpose                   |
| ---------------------------------------------------------------- | -------------------------------------------------------- | ------------------------- |
| PremiumStorefrontPage + sections                                 | `features/elixir/components/premium-storefront-page.tsx` | Main product storytelling |
| ProductGallery (elixir)                                          | `features/elixir/components/product-gallery.tsx`         | Elixir images/price       |
| Product3DScene                                                   | `features/elixir/components/product-3d-scene.tsx`        | Scroll 3D showcase        |
| IngredientGallery                                                | `features/elixir/components/ingredient-gallery.tsx`      | Ingredient cards          |
| TextureGrid / ImageCompareSlider                                 | elixir components                                        | Ritual/visual             |
| SeveRacineRouteSection                                           | `components/AdvisorRouteSections.tsx`                    | Advisor product section   |
| ProductCard / ProductGrid / shop ProductGallery / ProductActions | `features/commerce/components/*`                         | Legacy catalog UI         |

---

## Admin

| Component        | Path                                               | Purpose               |
| ---------------- | -------------------------------------------------- | --------------------- |
| AdminDashboard   | `features/admin/components/admin-dashboard.tsx`    | Tabbed command center |
| AdminOrdersTable | `features/admin/components/admin-orders-table.tsx` | Orders + status       |
| AdminLockedState | `features/admin/components/admin-locked-state.tsx` | Unauthorized UI       |

---

## Checkout

| Component               | Path                                              | Purpose                         |
| ----------------------- | ------------------------------------------------- | ------------------------------- |
| OrderFlow               | `features/elixir/components/order-flow.tsx`       | Full checkout wizard (orphaned) |
| CheckoutButton          | `features/elixir/components/checkout-button.tsx`  | Hits stub `/api/checkout`       |
| CheckoutTrustBar        | `features/elixir/components/CheckoutTrustBar.tsx` | Trust signals                   |
| CartView                | `features/commerce/components/cart-view.tsx`      | Legacy cart                     |
| Order confirmation page | `app/order-confirmation/page.tsx`                 | Post-order status UI            |

---

## Shared / marketing

| Component                                               | Path                                                | Purpose                 |
| ------------------------------------------------------- | --------------------------------------------------- | ----------------------- |
| CinematicHero                                           | `components/CinematicHero.tsx`                      | Homepage hero           |
| HeroVideoBackground                                     | `components/HeroVideoBackground.tsx`                | Background media        |
| HairTexturePanels                                       | `components/HairTexturePanels.tsx`                  | Texture panels          |
| FloatingWhatsApp                                        | `components/FloatingWhatsApp.tsx`                   | Global FAB              |
| DiagnosticQuiz                                          | `components/DiagnosticQuiz.tsx`                     | Advisor quiz            |
| AdvisorRouteSections                                    | `components/AdvisorRouteSections.tsx`               | Static advisor sections |
| WhatsAppCTA                                             | `features/elixir/components/whatsapp-cta.tsx`       | WA links                |
| LandingRoutePage                                        | `features/elixir/components/landing-route-page.tsx` | Server page composer    |
| Reveal / HeroMedia                                      | `features/home/components/*`                        | Motion + media          |
| LuxuryCard / CmsEditableSection / Guarantee / MobileNav | elixir components                                   | Storefront chrome       |

---

## Utility / feedback / SEO / icons

| Category | Paths                                                                              |
| -------- | ---------------------------------------------------------------------------------- |
| Feedback | `components/feedback/empty-state.tsx`, `error-state.tsx`, `page-loading-state.tsx` |
| SEO      | `components/seo/document-language.tsx`                                             |
| Icons    | `components/icons/icons.tsx`                                                       |
| Hooks    | `hooks/use-mounted.ts`, `useScrollProgress.ts`, `useParallax.ts`                   |

---

## 3D / WebGL

| Component              | Path                                         |
| ---------------------- | -------------------------------------------- |
| SceneGate              | `components/three/SceneGate.tsx`             |
| RootLineScene          | `components/three/RootLineScene.tsx`         |
| RootLineFallback       | `components/three/RootLineFallback.tsx`      |
| use-root-line-progress | `components/three/use-root-line-progress.ts` |
| WebGLHeroEnhancement   | `components/WebGLHeroEnhancement.tsx`        |
| MaisonFondjoWebGLScene | `components/MaisonFondjoWebGLScene.tsx`      |

---

## Unused / orphaned (present but not wired to live pages)

Evidence from import analysis during discovery:

- `OrderFlow`, `InquiryForm`, `CheckoutButton` (checkout path)
- `HairConsultationAgent`
- `NewsletterForm`
- Commerce shop/cart/wishlist views (pages redirect)

These remain valuable for reactivation but are not part of the current public UX.
