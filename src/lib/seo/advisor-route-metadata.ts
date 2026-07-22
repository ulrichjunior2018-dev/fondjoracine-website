import type { Metadata } from "next";

import type { Locale } from "@/content/copy";
import { siteConfig } from "@/config/site";
import { openGraphLocale } from "@/lib/locale";
import { buildShareMetadata } from "@/lib/seo/share-metadata";

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
  const pageTitle = `${title} | ${siteConfig.name}`;

  return {
    title: pageTitle,
    description,
    ...buildShareMetadata({
      description,
      locale: openGraphLocale(locale),
      title: pageTitle,
      url,
    }),
  };
}
