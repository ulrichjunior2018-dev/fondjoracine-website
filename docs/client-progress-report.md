# Maison Fondjo Website — Work Progress Report

**Prepared for:** Client review  
**Project:** Maison Fondjo / Sève Racine (`fondjoracine-website`)  
**Period covered:** 14–15 July 2026  
**Status:** Discovery completed · Account system built · Language UX improved

---

## 1. Executive summary

Work so far covers three main tracks:

1. **Full discovery & architecture audit** of the existing system (documentation only — no risk to the live site).
2. **Customer account area** built end to end: signup/login, dashboard, orders, profile, addresses, security, and notifications — designed as a long-term relationship with the brand, not only order history.
3. **Language UX** simplified: FR/EN toggles removed from navbars; the site detects the visitor’s browser language and offers a one-time switch prompt.

The live conversion path (WhatsApp-first storefront) was not rewritten. New work was layered on the existing Next.js + Supabase stack so the site stays stable while gaining real account capabilities.

---

## 2. Phase A — Repository discovery & architecture audit

### Goal

Understand the full system before changing it, so future work is informed and safe.

### What was delivered

A full set of internal technical documents under `docs/repository-discovery/`, including:

| Document area                   | What it covers                                       |
| ------------------------------- | ---------------------------------------------------- |
| Overview & summary              | What the product is, stack, how to navigate the docs |
| Project structure               | Folders, packages, conventions                       |
| Routing                         | Pages, redirects, App Router map                     |
| Frontend / backend architecture | Layers, patterns, where logic lives                  |
| Supabase                        | Auth clients, RLS, how the database is used          |
| Authentication                  | Auth model at the time of the audit                  |
| Data flow                       | How requests move through the system                 |
| Components, API, database       | Inventory of UI, endpoints, schema                   |
| Environment & deployment        | Config and Vercel deployment notes                   |
| Business features               | What is live vs half-wired vs stubbed                |
| Code conventions & observations | Risks, drift, technical debt notes                   |
| Folder guides                   | How teams should work inside each area               |

### Key findings

- The site is **Next.js 16 / React 19**, hosted on **Vercel**, with **Supabase** (Postgres + Auth).
- **Live sales today** are primarily **WhatsApp-based**, not full self-checkout.
- Much of the **e-commerce database** (catalog, orders, payments, reviews, wishlists, etc.) already exists — the platform was designed as a **brand platform**, not a single-product demo.
- Internal assessment: roughly **7/10 structure**, **5/10 future-readiness** — strong bones, some half-connected features, good foundation to build on.

### Related planning documents created

- **PRD — GSAP animations** (additive motion layer; no stack or palette swap).
- **PRD — Architecture & future readiness** (API-first, mobile-ready, reuse existing DB, module boundaries for a larger team).
- **Contributing / architecture notes** for how developers should extend the system.

**Client value:** A clear map of what already exists, what is live, and what can be activated later without rebuilding from scratch.

---

## 3. Phase B — Customer account system (major feature build)

### Goal

Give customers a personal space that reflects a **hair-care relationship with the brand**, starting with essentials, with structure ready for future modules (hair profile, loyalty, referrals, etc.).

### What was built

#### A. Authentication

- Email/password **sign up** and **log in**
- **Forgot password** / **reset password** flows
- OAuth **callback** route for Supabase (including Google when enabled)
- Google sign-in **gated by environment flag** (off by default until client credentials are ready)
- Sign out from the security / account UI

**Public pages added:**

- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`
- `/auth/callback`

#### B. Protected customer dashboard (`/account`)

Mobile-first account shell with navigation for:

| Section             | What customers can do                                   |
| ------------------- | ------------------------------------------------------- |
| **Home / overview** | Account snapshot, latest order, profile completion cues |
| **Orders**          | List orders and view order detail                       |
| **Profile**         | Update personal profile information                     |
| **Addresses**       | Add, edit, and delete addresses                         |
| **Security**        | Change password, session context, sign out              |
| **Notifications**   | Email / marketing preference controls                   |

Access is **guarded** (logged-in customers only). Unauthenticated visitors are directed through auth.

#### C. Backend / API (API-first, mobile-ready)

Versioned endpoints under `/api/v1/account/`:

- Overview
- Profile (read / update)
- Addresses (list / create / update / delete)
- Orders (list / detail)
- Notification preferences (read / update)

Plus:

- **Domain validation** (Zod schemas)
- **Customer service layer** (business logic)
- **Typed API client SDK** for account (same pattern the web app — and later mobile — can share)

#### D. Database

- Migration for customer account provisioning:
  - Auto-create **profile + customer** records on signup
  - **Notification preferences** table with row-level security
  - Policy so customers can create their own customer record when needed
- Types / schema updates so TypeScript stays aligned with the database

#### E. Documentation & ownership

- Feature README for the account area
- Updates to app / features / services / domain READMEs
- CODEOWNERS entries for account / customer paths

### Design approach (as agreed)

- Essentials first: auth, profile, addresses, orders, security, notifications
- Structure left ready for later: hair profile, consultation history, wishlist, reviews, billing, loyalty, referrals, saved progress, recommendations, etc.
- Uses the **existing brand color system**
- **Mobile-first** layout

**Client value:** Real customer accounts customers can use now; foundation ready for hair profile and loyalty without rebuilding the account shell.

---

## 4. Phase C — Language experience update

### Goal

Remove clutter from the header and make language feel automatic and helpful.

### What changed

- Removed **FR / EN toggle** from storefront and advisor / consultation navbars
- Removed the unused language-toggle component
- Improved the **language suggestion banner** so it works both ways:
  - Browser language French + site in English → offer French
  - Browser language English + site in French → offer English
- Remembers the visitor’s choice so the prompt is not shown every visit
- Fixed banner copy so messages match the direction of the suggestion

**Client value:** Cleaner header, smarter first visit, less friction for a bilingual Cameroon / international audience.

---

## 5. What was deliberately not broken or rewritten

To protect the live brand site, we:

- Did **not** replace the premium storefront or WhatsApp order flow
- Did **not** rewrite payments (Stripe / MoMo / Orange remain as previously designed)
- Did **not** force a tech-stack change
- Did **not** change the core brand palette as part of account work

Discovery and PRDs were documentation; account and language work were additive features.

---

## 6. Inventory summary (areas touched)

| Category              | Examples of what was touched                                                          |
| --------------------- | ------------------------------------------------------------------------------------- |
| **Docs / planning**   | Full `docs/repository-discovery/` set, GSAP PRD, architecture PRD, contributing notes |
| **Database**          | Customer accounts migration, notification preferences, security policies              |
| **Domain / services** | Customer schemas, types, customer service                                             |
| **APIs**              | `/api/v1/account/*`                                                                   |
| **SDK**               | Account API client resource                                                           |
| **Auth UI**           | Login, signup, forgot / reset password, Google button (gated)                         |
| **Account UI**        | Dashboard shell + six account sections                                                |
| **Config**            | Google auth environment flag and example env file                                     |
| **i18n UX**           | Banner logic, copy, navbar language controls removed                                  |
| **Icons / utilities** | Account icons, shared currency formatting helper                                      |

---

## 7. Status checklist

| Item                                                                              | Status                                                         |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| System discovery documented                                                       | Done                                                           |
| Architecture & GSAP planning PRDs                                                 | Done                                                           |
| Customer signup / login / password reset                                          | Built                                                          |
| Account dashboard (overview, orders, profile, addresses, security, notifications) | Built                                                          |
| Account APIs + service layer                                                      | Built                                                          |
| Database auto-provisioning for new customers                                      | Built (migration to apply in Supabase)                         |
| Google login                                                                      | Built but **off until credentials are enabled**                |
| Language prompt instead of FR/EN navbar                                           | Done                                                           |
| Hair profile / loyalty / wishlist UI                                              | Designed for later — **not built yet**                         |
| GSAP animation implementation                                                     | Planned only — **not implemented yet**                         |
| Full multi-product checkout go-live                                               | Architecture ready in DB/PRD — **not the focus of this phase** |

---

## 8. Recommended next steps

Before or right after go-live of accounts:

1. **Apply the new Supabase migration** in the project’s Supabase environment.
2. Configure Auth redirect URLs (login / callback / reset) for production.
3. Decide when to **turn on Google login** and supply OAuth credentials.
4. Smoke-test: create account → update profile → add address → place/view order path → notification preferences.
5. Choose the next product priority: for example **hair profile**, **consultation history**, or **GSAP motion polish** on the storefront.

---

## 9. Bottom line

We audited the Maison Fondjo platform end to end, documented how it works and how to grow it safely, then shipped a real **customer account area** (auth + dashboard + orders + profile + addresses + security + notifications) on an API-first design ready for mobile later. We also cleaned up **language switching** so the site detects the visitor’s language and politely offers the other language instead of showing FR/EN controls in the navbar. Planning documents for **stronger architecture** and **GSAP animations** are ready when those phases are prioritized next.

---

## 10. One-page summary (for email / quick brief)

**Maison Fondjo — progress to date (July 2026)**

- **Mapped the system:** full architecture and feature discovery docs so we know what is live, what exists in the database, and what is safe to build next.
- **Planned ahead:** written PRDs for future-ready architecture (web + future mobile) and optional GSAP animations without changing brand colors or core stack.
- **Built customer accounts:** signup, login, password reset, and a mobile-first `/account` area with overview, orders, profile, addresses, security, and notification preferences — plus matching APIs and database provisioning.
- **Improved language UX:** removed FR/EN from the navbars; the site now detects browser language and asks once if the visitor wants to switch.
- **Protected the live site:** did not rewrite the WhatsApp-first storefront or payment providers; new work is additive.
- **Next for launch:** apply the database migration, set production auth URLs, optionally enable Google login, then smoke-test the account flows.

---

_Document location: `docs/client-progress-report.md`_  
_Supporting technical detail: `docs/repository-discovery/`_
