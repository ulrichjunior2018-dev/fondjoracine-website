import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdvisorShell } from "@/components/AdvisorShell";
import { CatalogProductSection } from "@/components/CatalogProductSection";
import { getCatalogProduct } from "@/content/products";
import { buildAdvisorRouteMetadata } from "@/lib/seo/advisor-route-metadata";
import { pickLocale } from "@/lib/locale";
import { resolveAdvisorCopy } from "@/lib/seo/public-route-metadata";

const SLUG = "seve-racine";

export async function generateMetadata(): Promise<Metadata> {
  const product = getCatalogProduct(SLUG);
  if (!product) return {};

  const { locale } = await resolveAdvisorCopy();
  return buildAdvisorRouteMetadata({
    title: pickLocale(locale, { english: product.name.en, french: product.name.fr }),
    description: pickLocale(locale, {
      english: product.description.en,
      french: product.description.fr,
    }),
    locale,
    path: "/seve-racine",
  });
}

/**
 * Legacy product URL. Prefer `/products/seve-racine`.
 * Renders the shared catalog template (no page-level redirect — that looped with
 * an old next.config rule that sent `/products/*` back here).
 */
export default function SeveRacinePage() {
  const product = getCatalogProduct(SLUG);
  if (!product) notFound();

  return (
    <AdvisorShell>
      <CatalogProductSection product={product} />
    </AdvisorShell>
  );
}
