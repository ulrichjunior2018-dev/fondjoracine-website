"use client";

import { useEffect, useRef } from "react";

import { trackBeginCheckout, trackPurchase, trackViewItem } from "@/lib/analytics/events";

/** Fire once on mount — use on product detail pages. */
export function ViewItemTracker(props: {
  itemId: string;
  itemName: string;
  price?: number;
  currency?: string;
}) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    trackViewItem({
      item_id: props.itemId,
      item_name: props.itemName,
      ...(typeof props.price === "number" ? { price: props.price } : {}),
      ...(props.currency ? { currency: props.currency } : {}),
    });
  }, [props.currency, props.itemId, props.itemName, props.price]);

  return null;
}

/** Fire once — checkout page. */
export function BeginCheckoutTracker(props?: { value?: number; currency?: string }) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    trackBeginCheckout({
      ...(typeof props?.value === "number" ? { value: props.value } : {}),
      ...(props?.currency ? { currency: props.currency } : {}),
    });
  }, [props?.currency, props?.value]);

  return null;
}

/** Fire once — order confirmation with a real order id. */
export function PurchaseTracker(props: {
  transactionId: string;
  value?: number;
  currency?: string;
  items?: string;
}) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current || !props.transactionId) return;
    sent.current = true;
    trackPurchase({
      transaction_id: props.transactionId,
      ...(typeof props.value === "number" ? { value: props.value } : {}),
      ...(props.currency ? { currency: props.currency } : {}),
      ...(props.items ? { items: props.items } : {}),
    });
  }, [props.currency, props.items, props.transactionId, props.value]);

  return null;
}
