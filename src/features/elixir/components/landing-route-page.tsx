import type { Metadata } from "next";

import { PremiumStorefrontPage } from "@/features/elixir/components/premium-storefront-page";
import type { Locale } from "@/features/elixir/data/content";
import { getElixirContent } from "@/features/elixir/lib/cms";

type LandingRoutePageProps = {
  locale?: Locale;
};

export function buildRouteMetadata(title: string, description: string): Metadata {
  return {
    description,
    title: `${title} | FONDJO RACINE`,
  };
}

export async function LandingRoutePage({ locale = "en" }: LandingRoutePageProps) {
  const content = await getElixirContent();

  return <PremiumStorefrontPage content={content} locale={locale} />;
}
