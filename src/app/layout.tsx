import type { Metadata } from "next";

import { AppProviders } from "@/providers/app-providers";
import { env } from "@/config/env";
import { DocumentLanguage } from "@/components/seo/document-language";
import { buildOrganizationJsonLd, defaultMetadata } from "@/lib/seo/metadata";

import "@/styles/globals.css";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildOrganizationJsonLd(env.NEXT_PUBLIC_SITE_URL)),
          }}
        />
        <DocumentLanguage />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
