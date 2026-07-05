"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useState, useTransition } from "react";

import { EmptyState } from "@/components/feedback/empty-state";
import { Button } from "@/components/ui/button";
import type { Cart, CartLine } from "@/domain/commerce/types";
import { formatMoney } from "@/features/commerce/lib/format";

type CartViewProps = {
  initialCart: Cart | null;
};

function getLineImage(line: CartLine) {
  return (
    line.product_variants?.products?.product_images.sort((a, b) => a.position - b.position)[0] ??
    null
  );
}

export function CartView({ initialCart }: CartViewProps) {
  const [cart, setCart] = useState(initialCart);
  const [isPending, startTransition] = useTransition();
  const lines = cart?.cart_items ?? [];
  const subtotal = lines.reduce((total, line) => total + line.quantity * line.unit_price_cents, 0);

  function updateLine(cartItemId: string, quantity: number) {
    startTransition(async () => {
      const response = await fetch("/api/cart", {
        body: JSON.stringify({ cart_item_id: cartItemId, quantity }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });

      if (response.ok) {
        const payload = (await response.json()) as { data: { cart: Cart } };
        setCart(payload.data.cart);
      }
    });
  }

  if (!cart) {
    return (
      <div className="rounded-lg border border-border bg-surface px-6 py-16">
        <EmptyState
          title="Sign in to view your cart"
          description="Your Maison Fondjo cart is protected so your rituals stay connected to your account."
        />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface px-6 py-16">
        <EmptyState
          title="Your cart is empty"
          description="Explore the shop to begin your ritual."
        />
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
      <div className="grid gap-4">
        {lines.map((line) => {
          const product = line.product_variants?.products;
          const image = getLineImage(line);

          return (
            <article
              className="grid grid-cols-[6rem_1fr] gap-4 rounded-lg border border-border bg-surface p-4 sm:grid-cols-[8rem_1fr_auto]"
              key={line.id}
            >
              <div className="relative aspect-square overflow-hidden rounded-md bg-surface-muted">
                {image ? (
                  <Image
                    alt={image.alt}
                    className="object-cover"
                    fill
                    sizes="8rem"
                    src={image.url}
                  />
                ) : null}
              </div>
              <div>
                {product ? (
                  <Link
                    className="font-semibold hover:text-accent"
                    href={`/products/${product.slug}` as Route}
                  >
                    {product.title}
                  </Link>
                ) : (
                  <p className="font-semibold">Product unavailable</p>
                )}
                <p className="mt-1 text-sm text-foreground/62">{line.product_variants?.title}</p>
                <p className="mt-3 font-mono text-sm text-accent">
                  {formatMoney(line.unit_price_cents)}
                </p>
              </div>
              <div className="col-span-2 flex items-center gap-2 sm:col-span-1">
                <Button
                  disabled={isPending}
                  onClick={() => updateLine(line.id, Math.max(line.quantity - 1, 0))}
                  size="icon"
                  variant="secondary"
                >
                  -
                </Button>
                <span className="w-8 text-center text-sm font-medium">{line.quantity}</span>
                <Button
                  disabled={isPending}
                  onClick={() => updateLine(line.id, line.quantity + 1)}
                  size="icon"
                  variant="secondary"
                >
                  +
                </Button>
              </div>
            </article>
          );
        })}
      </div>
      <aside className="h-fit rounded-lg border border-border bg-surface p-5 shadow-soft">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
          <span className="text-sm text-foreground/68">Subtotal</span>
          <span className="font-mono text-sm">{formatMoney(subtotal)}</span>
        </div>
        <Button className="mt-6 w-full">Continue to checkout</Button>
        <p className="mt-3 text-xs leading-5 text-foreground/58">
          Shipping, taxes, subscriptions, and payment are finalized in secure checkout.
        </p>
      </aside>
    </div>
  );
}
