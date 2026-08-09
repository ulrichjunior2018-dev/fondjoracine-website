import type { Metadata } from "next";

import { AdvisorShell } from "@/components/AdvisorShell";
import { CatalogProductSection } from "@/components/CatalogProductSection";
import { JsonLd } from "@/components/seo/json-ld";
import { getCatalogProduct } from "@/content/products";
import { notFound } from "next/navigation";
import { buildCatalogProductJsonLd } from "@/lib/seo/catalog-json-ld";
import { buildAdvisorRouteMetadata } from "@/lib/seo/advisor-route-metadata";
import { pickLocale } from "@/lib/locale";
import { resolveAdvisorCopy } from "@/lib/seo/public-route-metadata";

const SLUG = "seve-racine";

export async function generateMetadata(): Promise<Metadata> {
  const product = getCatalogProduct(SLUG);
  if (!product) return {};

  const { locale } = await resolveAdvisorCopy();
  return buildAdvisorRouteMetadata({
    title: pickLocale(locale, {
      english: product.seoTitle.en,
      french: product.seoTitle.fr,
    }),
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
export default async function SeveRacinePage() {
  const product = getCatalogProduct(SLUG);
  if (!product) notFound();

  const { locale } = await resolveAdvisorCopy();

  return (
    <>
      <JsonLd data={buildCatalogProductJsonLd(product, locale)} id="legacy-seve-racine-jsonld" />
      <AdvisorShell>
        <CatalogProductSection product={product} />
      </AdvisorShell>
    </>
  );
}
