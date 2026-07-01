import { env } from "@/config/env";

export const siteConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  url: env.NEXT_PUBLIC_SITE_URL,
  description:
    "FONDJO RACINE SÈVE is a 100ml unisex botanical hair oil founded and made in Buea, Cameroon, with national delivery and international shipping support.",
  locale: "en_US",
  twitterHandle: "@fondjoracine",
} as const;
