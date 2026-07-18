import type { Metadata } from "next";

import type { Locale } from "@/content/copy";
import { siteConfig } from "@/config/site";
import { openGraphLocale } from "@/lib/locale";

type AdvisorRouteMetadataInput = {
  description: string;
  locale?: Locale;
  path: string;
  title: string;
};

export function buildAdvisorRouteMetadata({
  description,
  locale = "en",
  path,
  title,
}: AdvisorRouteMetadataInput): Metadata {
  const url = `${siteConfig.url}${path}`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      locale: openGraphLocale(locale),
      url,
    },
    twitter: {
      title: `${title} | ${siteConfig.name}`,
      description,
    },
  };
}
