import type { Metadata, Viewport } from "next";
import { Fraunces } from "next/font/google";

import { AppProviders } from "@/providers/app-providers";
import { env } from "@/config/env";
import { DocumentLanguage } from "@/components/seo/document-language";
import { JsonLd } from "@/components/seo/json-ld";
import { buildOrganizationJsonLd, defaultMetadata } from "@/lib/seo/metadata";
import { getServerLocale } from "@/lib/locale-server";

import "@/styles/globals.css";

// Fraunces: light display face with italic support for luxury headings.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300"],
  style: ["normal"],
  variable: "--fr-font-display",
  display: "swap",
});

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0B0B0B" },
    { media: "(prefers-color-scheme: light)", color: "#0B0B0B" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getServerLocale();

  return (
    <html
      lang={locale}
      className={`h-full antialiased ${fraunces.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col overflow-x-clip bg-background text-foreground">
        <JsonLd data={buildOrganizationJsonLd(env.NEXT_PUBLIC_SITE_URL)} id="organization-jsonld" />
        <DocumentLanguage />
        <AppProviders initialLocale={locale}>{children}</AppProviders>
      </body>
    </html>
  );
}
