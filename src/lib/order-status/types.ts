/**
 * Order status presentation registry.
 * Customer + admin UI resolve labels/tones here — add a status = module + registry line.
 */

export type OrderStatusId =
  | "pending_payment"
  | "payment_submitted"
  | "awaiting_confirmation"
  | "confirmed"
  | "order_received"
  | "preparing"
  | "processing"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "failed"
  | "returned";

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
  /** Whether this status appears in the progressive customer timeline. */
  isLifecycleStep: boolean;
  /** Whether admins can select this status in the dropdown. */
  isAdminSelectable: boolean;
  isConfigured: () => boolean;
}

export type OrderTimelineStep = {
  id: string;
  label: string;
  tone: OrderStatusTone;
  state: "complete" | "current" | "upcoming";
};
