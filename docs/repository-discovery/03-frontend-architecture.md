# 03 — Frontend Architecture

## Rendering model

- **Default:** React Server Components for route pages (`src/app/**/page.tsx`).
- **Client islands:** Components marked `"use client"` for interactivity (forms, motion, 3D, admin tabs, shells).
- **Composition pattern:** Server page fetches data (CMS, admin dashboard) → passes props into large client surfaces (e.g. `PremiumStorefrontPage`, `AdminDashboard`).
- **No Server Actions** (`'use server'` not found). Mutations use `fetch` to Route Handlers.

## Component hierarchy (typical storefront)

```
RootLayout (RSC)
└── AppProviders (client)
    ├── ThemeProvider (dark locked)
    ├── I18nProvider
    ├── SmoothScrollProvider (Lenis)
    ├── CustomCursor / FloatingWhatsApp / LanguageSuggestionBanner / ToastProvider
    └── page (RSC)
        └── PremiumStorefrontPage or AdvisorShell (client)
            └── sections / CTAs / quiz / forms
```

## Shared UI

Located in `src/components/ui/`: Button, Input/Textarea/Field, Checkbox, Radio, Card, Badge, Modal, Dropdown, Tabs, Accordion, Table, Pagination, Breadcrumb, Skeleton, Loader, Toast, Typography, Container, Grid, SectionWrapper, Eyebrow, GoldLine, LanguageToggle, LanguageSuggestionBanner, LanguageBottle, TextReveal, MagneticButton, CustomCursor, micro-interactions.

Built on **Radix UI** + Tailwind; handmade system (no shadcn `components.json`).

## Client vs Server Components

| Pattern                   | Examples                                                                                 |
| ------------------------- | ---------------------------------------------------------------------------------------- |
| Server pages              | Almost all `page.tsx` files                                                              |
| Async server composers    | `LandingRoutePage`, `hero-media`                                                         |
| Client features           | `premium-storefront-page`, `order-flow`, `admin-dashboard`, cart/wishlist views, quizzes |
| Client providers / chrome | `app-providers`, `AdvisorShell`, `FloatingWhatsApp`                                      |

## State management

| Approach                           | Usage                                            |
| ---------------------------------- | ------------------------------------------------ |
| React Context                      | `I18nProvider`, `ToastProvider`                  |
| Local `useState` / `useTransition` | Forms, quizzes, admin UI, cart views             |
| Server props                       | CMS content, admin dashboard payload             |
| localStorage / sessionStorage      | Locale preference; ambient sound preference      |
| Global store libraries             | **None** (no Zustand/Redux/Jotai/TanStack Query) |
| `create-safe-context`              | Defined in `src/state/` but unused elsewhere     |

## Forms & validation

| UI pattern            | Where                                                                        |
| --------------------- | ---------------------------------------------------------------------------- |
| RHF + `zodResolver`   | `order-flow.tsx`, `inquiry-form.tsx`                                         |
| Controlled + fetch    | `newsletter-form.tsx`                                                        |
| FormData + transition | `review-form.tsx`                                                            |
| API Zod               | `src/lib/api/request.ts`, `src/domain/commerce/schemas.ts`, newsletter route |

## Animations

- Framer Motion variants in `src/lib/design-system/animations.ts`
- Reveal wrappers (`features/home/components/reveal.tsx`, `text-reveal.tsx`)
- Scroll hooks: `useScrollProgress`, `useParallax`
- Lenis smooth scroll (disabled for coarse pointer / reduced motion / slow network)
- CSS keyframes in `globals.css`
- Three.js / R3F scenes with capability gating (`SceneGate`)

## Styling strategy

- **Tailwind CSS v4** via `@import "tailwindcss"` in `src/styles/globals.css`
- Brand CSS variables (`--fr-*`, `--obsidian`, `--gold`, semantic tokens)
- `@theme inline` maps tokens to utilities
- TypeScript helpers: `src/lib/design-system/tokens.ts`
- `clsx` + `tailwind-merge` (`cn`)
- Theme: **dark luxury** locked (`next-themes`, `enableSystem={false}`)
- Display font: **Fraunces** via `next/font` in root layout (Fontsource Cormorant/Inter remain dependencies)

## Reusable marketing / product surfaces

| Area              | Key files                                                 |
| ----------------- | --------------------------------------------------------- |
| Hero              | `CinematicHero`, `HeroVideoBackground`, WebGL enhancement |
| Advisor           | `AdvisorShell`, `AdvisorRouteSections`, `DiagnosticQuiz`  |
| Elixir storefront | `premium-storefront-page` (many section exports)          |
| 3D                | `three/*`, `MaisonFondjoWebGLScene`, `product-3d-scene`   |
| Feedback          | `empty-state`, `error-state`, `page-loading-state`        |

## i18n

- EN/FR primary (storefront + advisor); dictionaries also include `es` under `src/i18n/`
- Locale toggle + suggestion banner; document `lang` sync via `DocumentLanguage`
