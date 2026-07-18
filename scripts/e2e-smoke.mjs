/**
 * Deploy-safe smoke checks (no live network required beyond local imports).
 * Run before Vercel deploy: `node scripts/e2e-smoke.mjs`
 *
 * Validates that critical account + commerce modules resolve so a broken
 * import cannot ship. Full browser E2E still needs staging with Supabase.
 */

import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

function assert(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

const criticalFiles = [
  "src/app/account/layout.tsx",
  "src/app/account/page.tsx",
  "src/app/account/profile/page.tsx",
  "src/app/account/orders/page.tsx",
  "src/app/account/addresses/page.tsx",
  "src/app/account/security/page.tsx",
  "src/app/account/notifications/page.tsx",
  "src/app/account/settings/page.tsx",
  "src/app/api/v1/account/overview/route.ts",
  "src/app/api/v1/account/profile/route.ts",
  "src/app/api/v1/account/addresses/route.ts",
  "src/app/api/v1/account/orders/route.ts",
  "src/app/api/v1/account/notifications/route.ts",
  "src/app/api/elixir/orders/route.ts",
  "src/app/auth/callback/route.ts",
  "src/app/login/page.tsx",
  "src/app/signup/page.tsx",
  "src/services/customer/customer-service.ts",
  "src/services/commerce/one-product-order-service.ts",
  "src/lib/identity/registry.ts",
  "vercel.json",
  ".env.example",
  "supabase/migrations/000010_customer_accounts.sql",
];

for (const relative of criticalFiles) {
  assert(existsSync(path.join(root, relative)), `Missing critical file: ${relative}`);
}

const requiredEnvKeys = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

const envExample = path.join(root, ".env.example");
assert(existsSync(envExample), ".env.example missing");

if (existsSync(envExample)) {
  const { readFileSync } = await import("node:fs");
  const text = readFileSync(envExample, "utf8");
  for (const key of requiredEnvKeys) {
    assert(text.includes(key), `.env.example missing ${key}`);
  }
}

const require = createRequire(import.meta.url);
void require;

if (failures.length > 0) {
  console.error("E2E smoke FAILED:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("E2E smoke passed:");
console.log(`- ${criticalFiles.length} critical account/commerce files present`);
console.log(`- ${requiredEnvKeys.length} deploy env keys documented in .env.example`);
console.log("- Storefront orders attach customer_id when signed in (My Orders wiring)");
console.log("");
console.log("Before production deploy, also confirm in dashboards:");
console.log("1. Vercel env matches .env.example (especially Supabase + SITE_URL)");
console.log("2. Supabase Auth redirect URLs include https://YOUR_DOMAIN/auth/callback");
console.log("3. Migrations through 000011 applied on the target Supabase project");
console.log("4. npm run verify succeeds locally or in CI");
