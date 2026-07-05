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
    // facebook-cover.png: 1640×624 — close to recommended OG 1.91:1 ratio
    images: [
      {
        url: `${siteConfig.url}/images/facebook-cover.png`,
        width: 1640,
        height: 624,
        alt: "Maison Fondjo — Sève Racine 100ml, huile capillaire botanique née à Buea, Cameroun",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitterHandle,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/images/studio-reflection.png`],
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
