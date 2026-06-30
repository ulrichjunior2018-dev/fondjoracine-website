import { EmptyState } from "@/components/feedback/empty-state";
import type { ProductSummary } from "@/domain/commerce/types";
import { ProductCard } from "@/features/commerce/components/product-card";

type ProductGridProps = {
  emptyDescription?: string;
  products: ProductSummary[];
};

export function ProductGrid({ emptyDescription, products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface px-6 py-16">
        <EmptyState
          title="No products found"
          description={
            emptyDescription ?? "Refine your filters or check back as new FONDJO rituals launch."
          }
        />
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
