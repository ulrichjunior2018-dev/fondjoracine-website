import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("Maison Fondjo"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://fondjoracine.com"),
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
   * MTN MoMo Collection API (push "Request to Pay"). From the MTN MoMo
   * Developer Portal (momodeveloper.mtn.com): Subscription Key is the
   * Collection product's Ocp-Apim-Subscription-Key; API User / API Key are
   * created once against that subscription key (see src/lib/payments/README.md).
   */
  MTN_MOMO_SUBSCRIPTION_KEY: z.string().optional().or(z.literal("")),
  MTN_MOMO_API_USER: z.string().optional().or(z.literal("")),
  MTN_MOMO_API_KEY: z.string().optional().or(z.literal("")),
  /** "sandbox" in test, the MTN-assigned production target (e.g. "mtncameroon") once live. */
  MTN_MOMO_TARGET_ENVIRONMENT: z.string().optional().or(z.literal("")),
  /** Defaults to the sandbox host in the client if unset. */
  MTN_MOMO_BASE_URL: z.string().url().optional().or(z.literal("")),
  /**
   * Orange Money Web Payment API. From the Orange Developer Center
   * (developer.orange.com): OAuth client credentials + the merchant key
   * issued for the Orange Money merchant account.
   */
  ORANGE_MONEY_CLIENT_ID: z.string().optional().or(z.literal("")),
  ORANGE_MONEY_CLIENT_SECRET: z.string().optional().or(z.literal("")),
  ORANGE_MONEY_MERCHANT_KEY: z.string().optional().or(z.literal("")),
  /** Defaults to https://api.orange.com in the client if unset. */
  ORANGE_MONEY_API_BASE_URL: z.string().url().optional().or(z.literal("")),
  ADMIN_EMAIL: z.string().email().optional().or(z.literal("")),
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
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional().or(z.literal("")),
  SENTRY_DSN: z.string().optional().or(z.literal("")),
  NEXT_PUBLIC_ANALYTICS_DEBUG: z.string().optional().or(z.literal("")),
});

export const env = envSchema.parse(process.env);

export type AppEnv = z.infer<typeof envSchema>;
