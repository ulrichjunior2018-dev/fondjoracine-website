"use client";

import { useState, useTransition } from "react";

import { EmptyState } from "@/components/feedback/empty-state";
import { Button } from "@/components/ui/button";
import type { ProductSummary } from "@/domain/commerce/types";
import { ProductCard } from "@/features/commerce/components/product-card";

type WishlistItem = {
  id: string;
  product_id: string;
  created_at: string;
  products: ProductSummary | null;
};

type WishlistViewProps = {
  initialItems: WishlistItem[];
};

export function WishlistView({ initialItems }: WishlistViewProps) {
  const [items, setItems] = useState(initialItems);
  const [isPending, startTransition] = useTransition();

  function remove(productId: string) {
    startTransition(async () => {
      const response = await fetch("/api/wishlist", {
        body: JSON.stringify({ product_id: productId }),
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
      });

      if (response.ok) {
        setItems((current) => current.filter((item) => item.product_id !== productId));
      }
    });
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface px-6 py-16">
        <EmptyState
          title="Your wishlist is empty"
          description="Save rituals from product pages to compare and revisit them."
        />
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <article className="grid gap-3" key={item.id}>
          {item.products ? (
            <ProductCard product={item.products} />
          ) : (
            <div className="rounded-lg border border-border bg-surface p-5">
              <p className="font-mono text-xs text-foreground/58">{item.product_id}</p>
              <p className="mt-1 text-sm text-foreground/68">
                This product is no longer available.
              </p>
            </div>
          )}
          <Button disabled={isPending} onClick={() => remove(item.product_id)} variant="secondary">
            Remove
          </Button>
        </article>
      ))}
    </div>
  );
}
