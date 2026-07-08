import { env } from "@/config/env";
import { config } from "@/lib/config";

export const siteConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  tagline: "Enracinée dans la nature. Faite pour durer.",
  url: config.env === "production" ? "https://maisonfondjo.com" : env.NEXT_PUBLIC_SITE_URL,
  description:
    "Maison Fondjo presents Sève Racine, a 100ml botanical hair oil born in Buea with 11 botanicals and Cameroon delivery.",
  locale: "en_US",
  twitterHandle: "@maison.fondjo",
} as const;
