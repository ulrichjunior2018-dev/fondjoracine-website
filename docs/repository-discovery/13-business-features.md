# 13 — Business Features

---

## 1. Premium one-product storefront (EN / FR)

| Field          | Detail                                                                                              |
| -------------- | --------------------------------------------------------------------------------------------------- |
| **Purpose**    | Brand storytelling and conversion for Sève Racine                                                   |
| **Pages**      | `/` (`src/app/page.tsx`), `/fr`, also `/faq`, `/how-to-use`, `/origin-story` via `LandingRoutePage` |
| **Components** | `PremiumStorefrontPage`, `CinematicHero`, elixir galleries/sections, WhatsApp CTAs                  |
| **Tables**     | `storefront_content` (read)                                                                         |
| **External**   | WhatsApp; optional Supabase                                                                         |
| **Validation** | `elixirContentSchema`                                                                               |

---

## 2. WhatsApp ordering (live primary checkout)

| Field          | Detail                                                 |
| -------------- | ------------------------------------------------------ |
| **Purpose**    | Human-assisted sales via WhatsApp                      |
| **Pages**      | All storefront + advisor + `FloatingWhatsApp` globally |
| **Components** | `whatsapp-cta`, hero CTAs, `FloatingWhatsApp`          |
| **Tables**     | None                                                   |
| **External**   | WhatsApp (`NEXT_PUBLIC_WHATSAPP_NUMBER`)               |
| **Validation** | Config presence; no server schema                      |

---

## 3. Structured one-product checkout (MoMo / Stripe / WhatsApp method)

| Field          | Detail                                                        |
| -------------- | ------------------------------------------------------------- |
| **Purpose**    | Capture order in DB with payment method + confirmation token  |
| **Pages**      | `/order-confirmation` (active); create UI **not mounted**     |
| **Components** | `OrderFlow` (orphaned), confirmation page                     |
| **Tables**     | `orders`, `order_items`, `payments`                           |
| **External**   | MoMo numbers, Resend, Stripe optional                         |
| **Validation** | `createOneProductOrderSchema`, `submitPaymentReferenceSchema` |

---

## 4. Advisor funnel

| Field          | Detail                                                                                 |
| -------------- | -------------------------------------------------------------------------------------- |
| **Purpose**    | Educational routes supporting brand and diagnostic lead-gen                            |
| **Pages**      | `/diagnostic`, `/botanique`, `/seve-racine`, `/sur-mesure`, `/histoire`, `/grossistes` |
| **Components** | `AdvisorShell`, `AdvisorRouteSections`, `DiagnosticQuiz`                               |
| **Tables**     | None for live quiz                                                                     |
| **External**   | WhatsApp                                                                               |
| **Validation** | None server-side for quiz                                                              |

---

## 5. Hair consultation agent (DB-backed)

| Field          | Detail                                                                                |
| -------------- | ------------------------------------------------------------------------------------- |
| **Purpose**    | Persist consultation answers + rules-based recommendation + WA tracking               |
| **Pages**      | None currently (component unmounted); `/hair-consultation` redirects to `/diagnostic` |
| **Components** | `HairConsultationAgent`                                                               |
| **Tables**     | `hair_consultations`                                                                  |
| **External**   | WhatsApp                                                                              |
| **Validation** | `createHairConsultationSchema`, answers schema                                        |

---

## 6. Admin command center

| Field          | Detail                                                                                                                                                     |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Purpose**    | Operate storefront CMS, verify MoMo, manage Inner Circle, view leads                                                                                       |
| **Pages**      | `/admin`, `/admin/orders`                                                                                                                                  |
| **Components** | `AdminDashboard`, `AdminOrdersTable`, `AdminLockedState`                                                                                                   |
| **Tables**     | `storefront_content`, `orders`, `payments`, `inner_circle_members`, `newsletter_signups`, `hair_consultations`, `customers`, `profiles`, admin role tables |
| **External**   | Supabase Auth                                                                                                                                              |
| **Validation** | Admin content/order/Inner Circle Zod schemas                                                                                                               |

---

## 7. CMS editable storefront

| Field          | Detail                                       |
| -------------- | -------------------------------------------- |
| **Purpose**    | Non-engineer edits to bilingual JSON content |
| **Pages**      | Consumed by storefront; edited in admin      |
| **Components** | `cms-editable-section`, admin editors        |
| **Tables**     | `storefront_content`                         |
| **External**   | Supabase                                     |
| **Validation** | `elixirContentSchema` + admin patch schemas  |

---

## 8. Newsletter

| Field          | Detail                                    |
| -------------- | ----------------------------------------- |
| **Purpose**    | Capture emails for launches               |
| **Pages**      | Form **not mounted**; admin lists signups |
| **Components** | `NewsletterForm`                          |
| **Tables**     | `newsletter_signups`                      |
| **External**   | None                                      |
| **Validation** | Inline email/source Zod in API            |

---

## 9. Contact

| Field          | Detail                               |
| -------------- | ------------------------------------ |
| **Purpose**    | Show WhatsApp, email, policy links   |
| **Pages**      | `/contact`                           |
| **Components** | Contact cards in page                |
| **Tables**     | None                                 |
| **External**   | WhatsApp, email mailto/`ADMIN_EMAIL` |
| **Validation** | N/A                                  |

---

## 10. Policies

| Field          | Detail                                       |
| -------------- | -------------------------------------------- |
| **Purpose**    | Legal / shipping / returns / privacy         |
| **Pages**      | `/policies/{terms,privacy,shipping,returns}` |
| **Components** | Typography + `publicCopy`                    |
| **Tables**     | None                                         |
| **Validation** | N/A                                          |

---

## 11. Inner Circle

| Field          | Detail                                    |
| -------------- | ----------------------------------------- |
| **Purpose**    | VIP / membership phone list for admin ops |
| **Pages**      | Admin only                                |
| **Components** | Admin dashboard section                   |
| **Tables**     | `inner_circle_members`                    |
| **Validation** | `innerCircleMemberSchema`                 |

---

## 12. Stripe card checkout + webhook

| Field          | Detail                                        |
| -------------- | --------------------------------------------- |
| **Purpose**    | Card payments for one-product orders          |
| **Pages**      | Requires OrderFlow or equivalent              |
| **Components** | Stripe deps + checkout button (orphaned/stub) |
| **Tables**     | `orders`, `payments`                          |
| **External**   | Stripe                                        |
| **Validation** | Order schema + webhook secret                 |

---

## 13. Legacy multi-product commerce

| Field          | Detail                           |
| -------------- | -------------------------------- |
| **Purpose**    | Historical cart/catalog/wishlist |
| **Pages**      | Redirect to `/seve-racine`       |
| **Components** | `features/commerce/components/*` |
| **Tables**     | Full ecommerce set from 000002   |
| **External**   | Supabase Auth for cart APIs      |
| **Validation** | cart/order/wishlist schemas      |

**Status:** Dead at page layer; APIs/services retained.

---

## 14. Customer export / analytics (admin)

| Field       | Detail                                                |
| ----------- | ----------------------------------------------------- |
| **Purpose** | Export customers; dashboard metrics                   |
| **Pages**   | `/admin`                                              |
| **APIs**    | `/api/admin/customers/export`, `/api/admin/analytics` |
| **Tables**  | `customers`, `orders`, related                        |
