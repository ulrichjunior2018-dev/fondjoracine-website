import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

type AdvisorRouteMetadataInput = {
  description: string;
  path: string;
  title: string;
};

export function buildAdvisorRouteMetadata({
  description,
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
      locale: "en_US",
      url,
    },
    twitter: {
      title: `${title} | ${siteConfig.name}`,
      description,
    },
  };
}
