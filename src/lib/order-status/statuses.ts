import type { OrderStatusDescriptor } from "./types";

function status(
  id: string,
  labelEn: string,
  labelFr: string,
  tone: OrderStatusDescriptor["tone"],
): OrderStatusDescriptor {
  return { id, labelEn, labelFr, tone, isConfigured: () => true };
}

export const pendingPayment = status(
  "pending_payment",
  "Pending payment",
  "Paiement en attente",
  "warning",
);
export const paymentSubmitted = status(
  "payment_submitted",
  "Payment submitted",
  "Paiement envoye",
  "accent",
);
export const awaitingConfirmation = status(
  "awaiting_confirmation",
  "Awaiting confirmation",
  "En attente de confirmation",
  "accent",
);
export const confirmed = status("confirmed", "Confirmed", "Confirmee", "sage");
export const processing = status("processing", "Processing", "En preparation", "accent");
export const packed = status("packed", "Packed", "Emballee", "accent");
export const shipped = status("shipped", "Shipped", "Expediee", "accent");
export const delivered = status("delivered", "Delivered", "Livree", "sage");
export const cancelled = status("cancelled", "Cancelled", "Annulee", "danger");
export const refunded = status("refunded", "Refunded", "Remboursee", "neutral");

/** Fallback when an unknown DB status appears. */
export const unknownStatus = status("unknown", "Updating", "Mise a jour", "neutral");
