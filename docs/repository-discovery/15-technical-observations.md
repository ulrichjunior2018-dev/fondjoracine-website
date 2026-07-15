# 15 — Technical Observations

Observations only — **no change recommendations** in this document. Based on repository evidence.

---

## Architecture / product mismatch

1. **Dual product eras coexist:** Full multi-product ecommerce schema + APIs + UI, while pages permanently redirect to a one-product advisor/storefront. Live conversion is WhatsApp-first.
2. **Orphaned but complete features:** `OrderFlow`, `HairConsultationAgent`, `NewsletterForm`, inquiry/checkout helpers exist with APIs and DB tables but are not mounted on live pages.
3. **README routes outdated:** Lists `/product`, `/pre-order`, `/hair-consultation`, `/ingredients` as key routes; those redirect to `/seve-racine`, `/diagnostic`, `/botanique`.

---

## Large files / concentration of logic

Large source files (approx.):

| Size   | File                                                     |
| ------ | -------------------------------------------------------- |
| ~35 KB | `features/elixir/components/hair-consultation-agent.tsx` |
| ~33 KB | `features/elixir/components/premium-storefront-page.tsx` |
| ~27 KB | `features/elixir/data/content.ts`                        |
| ~24 KB | `content/copy.ts`                                        |
| ~23 KB | `features/admin/components/admin-dashboard.tsx`          |
| ~21 KB | `features/elixir/components/order-flow.tsx`              |

High concentration of UI + copy in few modules.

---

## Coupling / duplication

4. **Two hair consultation experiences:** Client-only `DiagnosticQuiz` (live) vs DB-backed `HairConsultationAgent` (unmounted) with overlapping domain intent.
5. **Two checkout concepts:** WhatsApp CTAs (live) vs structured elixir orders (+ stub `/api/checkout`).
6. **Config vs CMS vs env:** Pricing/payment/WhatsApp facts can come from `src/lib/config.ts`, CMS JSON, and env overrides — multiple sources of truth to reconcile mentally.
7. **Site URL default mismatch:** `env.ts` defaults to `maisonfondjo.com`; `.env.example` uses `fondjoracine.com`.

---

## Typing / stubs

8. **No generated Supabase types:** `Database.Tables` mapped to `never`; later tables omitted from `CommerceTable` union (`newsletter_signups`, `storefront_content`, `inner_circle_members`, `hair_consultations`).
9. **Auth service is interface-only** (`services/auth/auth-service.ts`).
10. **Browser Supabase client unused.**

---

## Auth / security surface (observations)

11. **No `middleware.ts`** — no edge session refresh or centralized route protection.
12. **No in-app login UI** — admin depends on external Auth session establishment (mechanism outside repo).
13. **Service role used on public write endpoints** (orders, newsletter, consultations) — correct for bypassing RLS but expands blast radius if handlers mis-validate.
14. **Hair consultation WhatsApp PATCH** appears gated by UUID knowledge only (no auth) — acceptable for token-like IDs, still a surface to be aware of.
15. **Newsletter insert policy** allows broad inserts (migration `with check (true)`).
16. **CSP is minimal** (`frame-ancestors 'none'` only) — not a full script CSP.

---

## Performance opportunities (observations)

17. Large client storefront + 3D/WebGL/howler pathways on marketing pages (capability gates exist).
18. No `loading.tsx` route-level skeletons.
19. Admin `force-dynamic` pages load broad dashboard datasets in one shot.

---

## Scalability / operability

20. Legacy carts/wishlists/catalog endpoints remain deployable surface area even when unused by pages.
21. Rate limiting exists for some POSTs; pattern not universal across all public writes.
22. Cloudinary adapter present but little/no call-site usage found — media pipeline partially prepared.
23. Stripe Payment Request flag defaults false; checkout stub hard-rejects — card path intentionally unfinished at UI edge.

---

## Tooling gaps

24. No Supabase `config.toml` / Edge Functions in repo.
25. No CI workflow discovered under `.github/` during audit (Husky local only).
26. `create-safe-context` utility unused.

---

## Documentation debt

27. Existing `docs/ARCHITECTURE.md` is accurate but thin relative to system size.
28. Public images README exists; deeper ops runbooks for MoMo verification / admin invite flow were not found in-repo.

---

These points are factual snapshots for planning — not an implementation backlog.
