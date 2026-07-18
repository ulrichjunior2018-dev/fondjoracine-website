/**
 * Order status presentation registry.
 * Customer + admin UI resolve labels/tones here — add a status = module + registry line.
 */

export type OrderStatusId =
  | "pending_payment"
  | "awaiting_confirmation"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type OrderStatusTone = "neutral" | "accent" | "sage" | "warning" | "danger";

export type OrderStatusOption = {
  id: string;
  labelEn: string;
  labelFr: string;
  tone: OrderStatusTone;
};

export interface OrderStatusDescriptor {
  /** Matches persisted `orders.status` (string; may extend beyond the union). */
  id: string;
  labelEn: string;
  labelFr: string;
  tone: OrderStatusTone;
  isConfigured: () => boolean;
}
