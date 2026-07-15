# 07 — Data Flow

This document traces major features end-to-end. Where UI is not mounted, the **backend path** is still documented.

---

## 1. Premium storefront CMS content (`/`, `/fr`)

```
UI (PremiumStorefrontPage sections)
  ↑ props
Server page / LandingRoutePage
  → getElixirContent() (features/elixir/lib/cms.ts)
  → anon Supabase select storefront_content (key fondjo-racine-seve, published)
  → merge with local defaults (features/elixir/data/content.ts)
  → Zod elixirContentSchema
  → env overrides (prices, MoMo numbers, WhatsApp)
  → Response to RSC → client render
```

**Live conversion:** CTAs call `buildWaLink` / WhatsApp URLs — **no order API** on the live premium page path.

---

## 2. WhatsApp order (live conversion)

```
UI CTA (hero / sticky / FloatingWhatsApp)
  → Validation: none server-side
  → Business logic: config builds wa.me URL with product intent text
  → Database: none
  → External: WhatsApp
  → UI: open chat (new tab / app)
```

---

## 3. One-product structured order (backend ready; OrderFlow not mounted)

Intended flow from `order-flow.tsx` + APIs:

```
UI OrderFlow (RHF + createOneProductOrderSchema)
  ↓ POST JSON
/api/elixir/orders  (rate limit 8/15m, honeypot)
  ↓ parseJsonBody
one-product-order-service.createOneProductOrder
  ↓ service-role Supabase
insert orders + order_items (+ payments stub as needed)
  ↓
queueOrderNotifications (Resend admin email; Stripe skip path)
  ↓
If stripe → Stripe Checkout session URL
Else → confirmationUrl /order-confirmation?token=…
  ↓
UI redirect / status
```

### MoMo payment reference

```
UI confirmation page / client
  ↓ PATCH
/api/elixir/orders/[token]/payment-reference
  ↓ submitPaymentReferenceSchema
update order status → payment_submitted
insert payments
email admin
  ↓
Admin verifies → PATCH /api/admin/orders/[id] → confirmed
```

### Order confirmation page (mounted)

```
GET /order-confirmation?token=
  → force-dynamic RSC
  → admin client loads order by confirmation_token
  → render status + payment instructions
```

---

## 4. Hair diagnostic quiz (live on `/diagnostic`)

```
UI DiagnosticQuiz (local state)
  ↓ no API
Build recommendation copy
  ↓
WhatsApp deep link (diagnostic or consultation intent)
  ↓
No database write
```

---

## 5. DB-backed hair consultation (API ready; agent not mounted)

```
UI HairConsultationAgent
  ↓ POST /api/hair-consultation
createHairConsultationSchema
  ↓
generateHairConsultationRecommendation (rules)
  ↓ service role insert hair_consultations
Response: consultation + whatsappUrl
  ↓
Optional PATCH /api/hair-consultation/[id]/whatsapp → clicked
```

Admin dashboard reads `hair_consultations` when permitted.

---

## 6. Admin CMS update

```
UI AdminDashboard form
  ↓ PATCH /api/admin/content (or images/stock/testimonials)
requireAdminPermission(contentWrite / …)
  ↓
admin-dashboard-service merges into storefront_content.content jsonb
  ↓
UI toast / refresh local state
```

---

## 7. Newsletter (API ready; form not mounted on pages)

```
UI NewsletterForm
  ↓ POST /api/newsletter
inline Zod: email + source
  ↓ service-role upsert newsletter_signups
Response ok
```

Admin lists recent signups on `/admin`.

---

## 8. Stripe webhook (dormant until Stripe orders exist)

```
Stripe → POST /api/webhooks/stripe
  → verify signature (STRIPE_WEBHOOK_SECRET)
  → checkout.session.completed
  → fulfillStripeOrder (one-product-order-service)
  → update orders/payments
```

---

## 9. Legacy cart (API exists; pages redirect)

```
Would: CartView → /api/cart → cart-service → carts/cart_items (requireApiUser)
Actual: /cart redirects to /seve-racine
```

---

## Feature × flow matrix

| Feature                 | UI mounted? | Writes DB? | External           |
| ----------------------- | ----------- | ---------- | ------------------ |
| Storefront storytelling | Yes         | Read CMS   | Optional WA        |
| WhatsApp order          | Yes         | No         | WhatsApp           |
| Elixir order form       | **No**      | Yes (API)  | Resend/Stripe/MoMo |
| Diagnostic quiz         | Yes         | No         | WhatsApp           |
| Consultation agent      | **No**      | Yes (API)  | WhatsApp           |
| Newsletter form         | **No**      | Yes (API)  | —                  |
| Admin dashboard         | Yes         | Yes        | —                  |
| Stripe webhook          | N/A         | Yes        | Stripe             |
