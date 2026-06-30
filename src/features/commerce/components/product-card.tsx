import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ProductSummary } from "@/domain/commerce/types";
import { getPrimaryImage, getProductPriceLabel } from "@/features/commerce/lib/format";

type ProductCardProps = {
  product: ProductSummary;
};

export function ProductCard({ product }: ProductCardProps) {
  const image = getPrimaryImage(product);

  return (
    <Card className="group h-full overflow-hidden p-0" variant="elevated">
      <Link
        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
        href={`/products/${product.slug}` as Route}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-surface-muted">
          {image ? (
            <Image
              alt={image.alt}
              className="object-cover transition-transform duration-700 ease-[var(--ease-luxury)] group-hover:scale-105"
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              src={image.url}
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-foreground/55">
              Image unavailable
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-base font-semibold leading-6 text-foreground">{product.title}</h3>
            <span className="font-mono text-sm text-accent">{getProductPriceLabel(product)}</span>
          </div>
          {product.subtitle ? (
            <p className="mt-2 text-sm leading-6 text-foreground/62">{product.subtitle}</p>
          ) : null}
          <Badge className="mt-4" tone="sage">
            Scalp-first
          </Badge>
        </div>
      </Link>
    </Card>
  );
}
