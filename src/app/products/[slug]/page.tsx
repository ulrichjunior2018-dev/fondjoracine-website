import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdvisorShell } from "@/components/AdvisorShell";
import { CatalogProductSection } from "@/components/CatalogProductSection";
import { JsonLd } from "@/components/seo/json-ld";
import { getCatalogProduct, listCatalogProductSlugs } from "@/content/products";
import { buildCatalogProductJsonLd } from "@/lib/seo/catalog-json-ld";
import { buildAdvisorRouteMetadata } from "@/lib/seo/advisor-route-metadata";
import { resolveAdvisorCopy } from "@/lib/seo/public-route-metadata";
import { pickLocale } from "@/lib/locale";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return listCatalogProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getCatalogProduct(slug);
  if (!product) {
    return {};
  }

  const { locale } = await resolveAdvisorCopy();
  const title = pickLocale(locale, {
    english: product.seoTitle.en,
    french: product.seoTitle.fr,
  });
  const description = pickLocale(locale, {
    english: product.description.en,
    french: product.description.fr,
  });

  return buildAdvisorRouteMetadata({
    title,
    description,
    locale,
    path: `/products/${product.slug}`,
  });
}

export default async function ProductSlugPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getCatalogProduct(slug);

  if (!product) {
    notFound();
  }

  const { locale } = await resolveAdvisorCopy();

  return (
    <>
      <JsonLd
        data={buildCatalogProductJsonLd(product, locale)}
        id={`product-${product.slug}-jsonld`}
      />
      <AdvisorShell>
        <CatalogProductSection product={product} />
      </AdvisorShell>
    </>
  );
}
