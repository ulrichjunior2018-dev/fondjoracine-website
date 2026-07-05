import { env } from "@/config/env";
import { config } from "@/lib/config";

export const siteConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  tagline: "Enracinée dans la nature. Faite pour durer.",
  url: config.env === "production" ? "https://maisonfondjo.com" : env.NEXT_PUBLIC_SITE_URL,
  description:
    "Maison Fondjo présente Sève Racine, huile capillaire botanique 100ml née à Buea avec 11 botaniques et livraison au Cameroun.",
  locale: "fr_FR",
  twitterHandle: "@fondjoracine",
} as const;
