import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdvisorShell } from "@/components/AdvisorShell";
import { CatalogProductSection } from "@/components/CatalogProductSection";
import { getCatalogProduct, listCatalogProductSlugs } from "@/content/products";
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
  const title = pickLocale(locale, { english: product.name.en, french: product.name.fr });
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

  return (
    <AdvisorShell>
      <CatalogProductSection product={product} />
    </AdvisorShell>
  );
}
