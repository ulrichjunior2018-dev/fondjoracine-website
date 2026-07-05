"use client";

import { Heart, ShoppingBag } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/toast";
import type { ProductSummary, ProductVariant } from "@/domain/commerce/types";
import { formatMoney, getPrimaryVariant } from "@/features/commerce/lib/format";

type ProductActionsProps = {
  product: ProductSummary;
};

export function ProductActions({ product }: ProductActionsProps) {
  const variants = product.product_variants.filter((variant) => variant.is_active);
  const defaultVariant = getPrimaryVariant(product);
  const [selectedVariantId, setSelectedVariantId] = useState(defaultVariant?.id ?? "");
  const [purchaseMode, setPurchaseMode] = useState("one-time");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const selectedVariant =
    variants.find((variant) => variant.id === selectedVariantId) ?? variants[0];

  async function postJson(url: string, body: unknown) {
    const response = await fetch(url, {
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }
  }

  function handleAddToCart() {
    if (!selectedVariant) {
      return;
    }

    startTransition(async () => {
      try {
        await postJson("/api/cart", { quantity: 1, variant_id: selectedVariant.id });
        toast({
          title: "Added to cart",
          description:
            purchaseMode === "subscription"
              ? "Subscription preference saved with this ritual."
              : "Your ritual is waiting in the cart.",
          tone: "success",
        });
      } catch {
        toast({
          title: "Sign in required",
          description: "Please sign in to manage your Maison Fondjo cart.",
          tone: "warning",
        });
      }
    });
  }

  function handleWishlist() {
    startTransition(async () => {
      try {
        await postJson("/api/wishlist", { product_id: product.id });
        toast({
          title: "Saved to wishlist",
          description: "Added to your Maison Fondjo wishlist.",
          tone: "success",
        });
      } catch {
        toast({
          title: "Sign in required",
          description: "Please sign in to save wishlist items.",
          tone: "warning",
        });
      }
    });
  }

  return (
    <div className="grid gap-6">
      {variants.length > 1 ? (
        <RadioGroup onValueChange={setSelectedVariantId} value={selectedVariantId}>
          {variants.map((variant: ProductVariant) => (
            <RadioItem
              description={formatMoney(variant.price_cents, variant.currency)}
              key={variant.id}
              label={variant.title}
              value={variant.id}
            />
          ))}
        </RadioGroup>
      ) : null}

      <RadioGroup onValueChange={setPurchaseMode} value={purchaseMode}>
        <RadioItem label="One-time purchase" value="one-time" />
        <RadioItem
          description="Ships on your selected cadence with priority access to replenishment."
          label="Subscribe and replenish"
          value="subscription"
        />
      </RadioGroup>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <Button
          disabled={!selectedVariant}
          isLoading={isPending}
          leadingIcon={<ShoppingBag aria-hidden="true" className="h-4 w-4" />}
          onClick={handleAddToCart}
        >
          Add to cart
        </Button>
        <Button
          leadingIcon={<Heart aria-hidden="true" className="h-4 w-4" />}
          onClick={handleWishlist}
          variant="secondary"
        >
          Wishlist
        </Button>
      </div>
    </div>
  );
}
