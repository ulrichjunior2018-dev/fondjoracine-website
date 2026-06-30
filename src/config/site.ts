import { env } from "@/config/env";

export const siteConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  url: env.NEXT_PUBLIC_SITE_URL,
  description:
    "FONDJO RACINE SÈVE is a 100ml unisex hair treatment oil founded and made in Buea, Cameroon. Pre-order Batch #001 for 8,500 XAF.",
  locale: "en_US",
  twitterHandle: "@fondjoracine",
} as const;
