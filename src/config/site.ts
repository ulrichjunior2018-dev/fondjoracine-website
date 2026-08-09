import { env } from "@/config/env";
import { config } from "@/lib/config";

export const siteConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  tagline: "Enracinée dans la nature. Faite pour durer.",
  url: config.env === "production" ? "https://maisonfondjo.com" : env.NEXT_PUBLIC_SITE_URL,
  description:
    "Maison Fondjo is a botanical hair care house from Buea, Cameroon. Shop the collection, from Sève Racine hair oil to upcoming cleansers and care for scalp and lengths.",
  locale: "en_US",
  twitterHandle: "@maison.fondjo",
  /**
   * Only list networks that are active and maintained.
   * Avoid linking inactive profiles — that reduces trust.
   */
  social: {
    instagram: "https://www.instagram.com/maison.fondjo",
    facebook: "https://www.facebook.com/maisonfondjo",
    tiktok: "https://www.tiktok.com/@maisonfondjo",
  },
} as const;
