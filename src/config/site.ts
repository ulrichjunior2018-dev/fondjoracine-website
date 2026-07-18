import { env } from "@/config/env";
import { config } from "@/lib/config";

export const siteConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  tagline: "Enracinée dans la nature. Faite pour durer.",
  url: config.env === "production" ? "https://maisonfondjo.com" : env.NEXT_PUBLIC_SITE_URL,
  description:
    "Maison Fondjo presents Sève Racine, a 100ml botanical hair oil born in Buea. A rich blend of botanical oils and herbs, with Cameroon delivery.",
  locale: "en_US",
  twitterHandle: "@maison.fondjo",
  /**
   * Only list networks that are active and maintained.
   * Add Facebook / TikTok / YouTube / LinkedIn here when accounts go live.
   * Avoid linking inactive profiles — that reduces trust.
   */
  social: {
    instagram: "https://www.instagram.com/maison.fondjo",
  },
} as const;
