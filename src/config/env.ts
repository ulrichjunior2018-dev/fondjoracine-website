import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("Maison Fondjo"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://maisonfondjo.com"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional().or(z.literal("")),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional().or(z.literal("")),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().or(z.literal("")),
  RESEND_API_KEY: z.string().optional().or(z.literal("")),
  RESEND_FROM_EMAIL: z.string().email().optional().or(z.literal("")),
  STRIPE_SECRET_KEY: z.string().optional().or(z.literal("")),
  STRIPE_HAIR_ELIXIR_PRICE_ID: z.string().optional().or(z.literal("")),
  STRIPE_WEBHOOK_SECRET: z.string().optional().or(z.literal("")),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional().or(z.literal("")),
  NEXT_PUBLIC_STRIPE_PAYMENT_REQUEST_ENABLED: z.string().optional().or(z.literal("")),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().optional().or(z.literal("")),
  MTN_MOMO_NUMBER: z.string().optional().or(z.literal("")),
  ORANGE_MONEY_NUMBER: z.string().optional().or(z.literal("")),
  ADMIN_EMAIL: z.string().email().optional().or(z.literal("")),
  CLOUDINARY_API_KEY: z.string().optional().or(z.literal("")),
  CLOUDINARY_API_SECRET: z.string().optional().or(z.literal("")),
});

export const env = envSchema.parse(process.env);

export type AppEnv = z.infer<typeof envSchema>;
