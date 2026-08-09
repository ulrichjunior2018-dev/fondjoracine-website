/**
 * Client-safe public environment access.
 *
 * IMPORTANT: Next.js only inlines a `NEXT_PUBLIC_*` variable into the browser
 * bundle when it appears as a *static* `process.env.NEXT_PUBLIC_FOO` member
 * expression. The `env` object in `@/config/env` is built with
 * `envSchema.parse(process.env)`, which passes the whole `process.env` object
 * and therefore CANNOT be statically analyzed — so those values come out empty
 * in the browser. Any code that runs on the client must read public vars from
 * here (or reference `process.env.NEXT_PUBLIC_*` directly) instead of `env`.
 *
 * These references work on the server too (Node populates `process.env` at
 * runtime), so this module is safe to import from server or client code.
 */
export const publicEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  cloudinaryCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "",
  /** Identity provider enable flags — read only by `src/lib/identity/providers/*`. */
  authGoogleEnabled: process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "true",
  authAppleEnabled: process.env.NEXT_PUBLIC_AUTH_APPLE_ENABLED === "true",
  authFacebookEnabled: process.env.NEXT_PUBLIC_AUTH_FACEBOOK_ENABLED === "true",
  authPhoneEnabled: process.env.NEXT_PUBLIC_AUTH_PHONE_ENABLED === "true",
  /** Google Tag Manager container (GTM-XXXX). Preferred path for GA4 / Meta / TikTok. */
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "",
  /** Optional GA4 measurement ID when GTM is not used (G-XXXX). Prefer GTM in production. */
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "",
  /** Sentry browser DSN (also works server-side if SENTRY_DSN is unset). */
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN ?? "",
  /** Force load GTM/gtag outside production for TAG debugging. */
  analyticsDebug: process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true",
  isProduction: process.env.NODE_ENV === "production",
} as const;

export function hasSupabasePublicConfig(): boolean {
  return Boolean(publicEnv.supabaseUrl && publicEnv.supabaseAnonKey);
}
