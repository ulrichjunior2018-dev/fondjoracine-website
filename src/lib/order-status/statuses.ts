import type { OrderStatusDescriptor } from "./types";

function status(
  id: string,
  labelEn: string,
  labelFr: string,
  tone: OrderStatusDescriptor["tone"],
  options?: Partial<Pick<OrderStatusDescriptor, "isLifecycleStep" | "isAdminSelectable">>,
): OrderStatusDescriptor {
  return {
    id,
    labelEn,
    labelFr,
    tone,
    isLifecycleStep: options?.isLifecycleStep ?? false,
    isAdminSelectable: options?.isAdminSelectable ?? true,
    isConfigured: () => true,
  };
}

export const pendingPayment = status(
  "pending_payment",
  "Pending Payment",
  "Paiement en attente",
  "warning",
  { isLifecycleStep: true },
);
export const paymentSubmitted = status(
  "payment_submitted",
  "Payment Submitted",
  "Paiement envoye",
  "accent",
  { isLifecycleStep: true },
);
export const awaitingConfirmation = status(
  "awaiting_confirmation",
  "Awaiting confirmation",
  "En attente de confirmation",
  "accent",
  { isAdminSelectable: false, isLifecycleStep: false },
);
export const confirmed = status("confirmed", "Payment Confirmed", "Paiement confirme", "sage", {
  isLifecycleStep: true,
});
export const orderReceived = status(
  "order_received",
  "Order Received",
  "Commande recue",
  "accent",
  { isLifecycleStep: true },
);
export const preparing = status(
  "preparing",
  "Preparing Order",
  "Preparation de la commande",
  "accent",
  { isLifecycleStep: true },
);
/** Legacy alias — same customer-facing meaning as Preparing Order. */
export const processing = status(
  "processing",
  "Preparing Order",
  "Preparation de la commande",
  "accent",
  { isLifecycleStep: false, isAdminSelectable: false },
);
export const packed = status("packed", "Ready for Shipment", "Pret a expedier", "accent", {
  isLifecycleStep: true,
});
export const shipped = status("shipped", "Shipped", "Expediee", "accent", {
  isLifecycleStep: true,
});
export const outForDelivery = status(
  "out_for_delivery",
  "Out for Delivery",
  "En cours de livraison",
  "accent",
  { isLifecycleStep: true },
);
export const delivered = status("delivered", "Delivered", "Livree", "sage", {
  isLifecycleStep: true,
});
export const cancelled = status("cancelled", "Cancelled", "Annulee", "danger");
export const refunded = status("refunded", "Refunded", "Remboursee", "neutral");
export const failed = status("failed", "Failed", "Echouee", "danger");
export const returned = status("returned", "Returned", "Retournee", "neutral");

/** Fallback when an unknown DB status appears. */
export const unknownStatus = status("unknown", "Updating", "Mise a jour", "neutral", {
  isAdminSelectable: false,
});
