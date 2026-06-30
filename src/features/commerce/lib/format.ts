import type { ProductImage, ProductSummary, ProductVariant } from "@/domain/commerce/types";

export function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    currency,
    style: "currency",
  }).format(cents / 100);
}

export function getPrimaryVariant(product: ProductSummary): ProductVariant | null {
  return (
    product.product_variants.find((variant) => variant.is_active) ??
    product.product_variants[0] ??
    null
  );
}

export function getPrimaryImage(product: ProductSummary): ProductImage | null {
  return [...product.product_images].sort((a, b) => a.position - b.position)[0] ?? null;
}

export function getProductPriceLabel(product: ProductSummary) {
  const variant = getPrimaryVariant(product);

  if (!variant) {
    return "Unavailable";
  }

  return formatMoney(variant.price_cents, variant.currency);
}
