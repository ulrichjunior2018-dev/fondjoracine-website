import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { config } from "@/lib/config";

const isProduction = config.env === "production";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    locale: siteConfig.locale,
    images: [
      {
        url: `${siteConfig.url}/images/wordmark-lockup.png`,
        width: 1254,
        height: 1254,
        alt: "Maison Fondjo wordmark lockup on black",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitterHandle,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/images/studio.png`],
  },
  robots: {
    index: isProduction,
    follow: isProduction,
    googleBot: {
      index: isProduction,
      follow: isProduction,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    google: "notranslate",
  },
  ...(isProduction
    ? {
        alternates: {
          canonical: siteConfig.url,
        },
      }
    : {}),
};

export function buildOrganizationJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteUrl,
  };
}
