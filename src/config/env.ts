import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("Maison Fondjo"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://maisonfondjo.com"),
  NEXT_PUBLIC_GA4_MEASUREMENT_ID: z.string().optional().or(z.literal("")),
  NEXT_PUBLIC_GTM_CONTAINER_ID: z.string().optional().or(z.literal("")),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional().or(z.literal("")),
  UPTIMEROBOT_API_KEY: z.string().optional().or(z.literal("")),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional().or(z.literal("")),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional().or(z.literal("")),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().or(z.literal("")),
  RESEND_API_KEY: z.string().optional().or(z.literal("")),
  RESEND_FROM_EMAIL: z.string().email().optional().or(z.literal("")),
  STRIPE_SECRET_KEY: z.string().optional().or(z.literal("")),
  STRIPE_HAIR_ELIXIR_PRICE_ID: z.string().optional().or(z.literal("")),
  /** Recurring monthly "subscribe & save" Price ID (mode: "subscription"). Optional — subscribe option is hidden until set. */
  STRIPE_HAIR_ELIXIR_SUBSCRIPTION_PRICE_ID: z.string().optional().or(z.literal("")),
  STRIPE_WEBHOOK_SECRET: z.string().optional().or(z.literal("")),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional().or(z.literal("")),
  NEXT_PUBLIC_STRIPE_PAYMENT_REQUEST_ENABLED: z.string().optional().or(z.literal("")),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().optional().or(z.literal("")),
  /** Legacy display numbers — shown in manual-payment instructions copy. */
  MTN_MOMO_NUMBER: z.string().optional().or(z.literal("")),
  ORANGE_MONEY_NUMBER: z.string().optional().or(z.literal("")),
  /**
   * Fapshi (fapshi.com) — Cameroon payment aggregator fronting both MTN MoMo
   * and Orange Money behind one API + one hosted checkout link. From your
   * Fapshi dashboard: apiuser / apikey — check whether your dashboard issues
   * one pair shared across sandbox/live or a separate pair per environment,
   * and set FAPSHI_API_USER/KEY to the one matching FAPSHI_ENV below.
   */
  FAPSHI_API_USER: z.string().optional().or(z.literal("")),
  FAPSHI_API_KEY: z.string().optional().or(z.literal("")),
  FAPSHI_ENV: z.string().optional().or(z.literal("")),
  /** Defaults to the sandbox/live host (by FAPSHI_ENV) in the client if unset. */
  FAPSHI_BASE_URL: z.string().url().optional().or(z.literal("")),
  ADMIN_EMAIL: z.string().email().optional().or(z.literal("")),
  /**
   * Twilio — order-status SMS to customers (international, incl. Cameroon).
   * From the Twilio Console: Account SID + Auth Token (Account dashboard),
   * plus either a Messaging Service SID (preferred — supports sender pools /
   * geo-matching) or a single TWILIO_FROM_NUMBER. Leave all blank to disable
   * the channel; it self-isolates like every other notification channel.
   */
  TWILIO_ACCOUNT_SID: z.string().optional().or(z.literal("")),
  TWILIO_AUTH_TOKEN: z.string().optional().or(z.literal("")),
  TWILIO_MESSAGING_SERVICE_SID: z.string().optional().or(z.literal("")),
  TWILIO_FROM_NUMBER: z.string().optional().or(z.literal("")),
  /**
   * Admin-only WhatsApp order alerts — a stopgap for "notify me the moment
   * an order lands" while the SMS compliance profile is pending. Uses
   * Twilio's WhatsApp Sandbox (no compliance review needed, but shared
   * number + session expires ~24h after the admin last messaged it — not a
   * production channel). TWILIO_WHATSAPP_FROM is the sandbox number in
   * `whatsapp:+1...` form; TWILIO_WHATSAPP_TO is the admin's own WhatsApp
   * number in the same form, after they've joined the sandbox.
   */
  TWILIO_WHATSAPP_FROM: z.string().optional().or(z.literal("")),
  TWILIO_WHATSAPP_TO: z.string().optional().or(z.literal("")),
  CLOUDINARY_API_KEY: z.string().optional().or(z.literal("")),
  CLOUDINARY_API_SECRET: z.string().optional().or(z.literal("")),
  /**
   * Identity provider feature flags. Secrets live in the Supabase dashboard;
   * these only toggle whether each method appears in the UI. See
   * `src/lib/identity/README.md` for how to add/remove methods.
   */
  NEXT_PUBLIC_AUTH_GOOGLE_ENABLED: z.string().optional().or(z.literal("")),
  NEXT_PUBLIC_AUTH_APPLE_ENABLED: z.string().optional().or(z.literal("")),
  NEXT_PUBLIC_AUTH_FACEBOOK_ENABLED: z.string().optional().or(z.literal("")),
  NEXT_PUBLIC_AUTH_PHONE_ENABLED: z.string().optional().or(z.literal("")),
  /** Analytics / observability — optional; empty = disabled. */
  NEXT_PUBLIC_GTM_ID: z.string().optional().or(z.literal("")),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional().or(z.literal("")),
  /** Server-only DSN override (optional). Defaults to NEXT_PUBLIC_SENTRY_DSN. */
  SENTRY_DSN: z.string().optional().or(z.literal("")),
  NEXT_PUBLIC_ANALYTICS_DEBUG: z.string().optional().or(z.literal("")),
});

export const env = envSchema.parse(process.env);

export type AppEnv = z.infer<typeof envSchema>;
