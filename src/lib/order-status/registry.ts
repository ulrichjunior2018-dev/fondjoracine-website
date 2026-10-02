import {
  awaitingConfirmation,
  cancelled,
  confirmed,
  delivered,
  failed,
  orderReceived,
  outForDelivery,
  packed,
  paymentSubmitted,
  pendingPayment,
  preparing,
  processing,
  refunded,
  returned,
  shipped,
  unknownStatus,
} from "./statuses";
import type { OrderStatusDescriptor, OrderStatusOption, OrderTimelineStep } from "./types";

const statuses: readonly OrderStatusDescriptor[] = [
  pendingPayment,
  paymentSubmitted,
  awaitingConfirmation,
  confirmed,
  orderReceived,
  preparing,
  processing,
  packed,
  shipped,
  outForDelivery,
  delivered,
  cancelled,
  refunded,
  failed,
  returned,
];

/** Progressive customer timeline (happy path). Exceptional statuses are shown separately. */
const LIFECYCLE_ORDER = [
  "pending_payment",
  "payment_submitted",
  "confirmed",
  "order_received",
  "preparing",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
] as const;

const STATUS_RANK: Record<string, number> = {
  pending_payment: 0,
  payment_submitted: 1,
  awaiting_confirmation: 1,
  confirmed: 2,
  order_received: 3,
  preparing: 4,
  processing: 4,
  packed: 5,
  shipped: 6,
  out_for_delivery: 7,
  delivered: 8,
  cancelled: -1,
  refunded: -1,
  failed: -1,
  returned: -1,
};

export function listOrderStatuses(): readonly OrderStatusDescriptor[] {
  return statuses;
}

export function getOrderStatus(id: string): OrderStatusDescriptor {
  const match = statuses.find((candidate) => candidate.id === id);
  return match ?? unknownStatus;
}

export function listOrderStatusOptions(): OrderStatusOption[] {
  return statuses
    .filter((status) => status.isConfigured() && status.isAdminSelectable)
    .map((status) => ({
      id: status.id,
      labelEn: status.labelEn,
      labelFr: status.labelFr,
      tone: status.tone,
    }));
}

export function listAdminOrderStatusIds(): string[] {
  return listOrderStatusOptions().map((status) => status.id);
}

export function getOrderStatusLabel(id: string, locale: string): string {
  const status = getOrderStatus(id);
  return locale.startsWith("fr") ? status.labelFr : status.labelEn;
}

export function getOrderStatusRank(id: string): number {
  return STATUS_RANK[id] ?? -1;
}

/**
 * Builds a customer-facing progress timeline for the current order status.
 * Skips `payment_submitted` when the order never used that step (card checkout).
 */
export function buildOrderTimeline(
  currentStatus: string,
  locale: string,
  options?: { includePaymentSubmitted?: boolean },
): OrderTimelineStep[] {
  const includePaymentSubmitted = options?.includePaymentSubmitted ?? false;
  const currentRank = getOrderStatusRank(currentStatus);
  const isException = currentRank < 0 && currentStatus !== "pending_payment";

  const steps = LIFECYCLE_ORDER.filter((id) => {
    if (id === "payment_submitted" && !includePaymentSubmitted) {
      return false;
    }
    return true;
  });

  if (isException) {
    const descriptor = getOrderStatus(currentStatus);
    return [
      {
        id: currentStatus,
        label: locale.startsWith("fr") ? descriptor.labelFr : descriptor.labelEn,
        tone: descriptor.tone,
        state: "current",
      },
    ];
  }

  return steps.map((id) => {
    const descriptor = getOrderStatus(id);
    const rank = getOrderStatusRank(id);
    let state: OrderTimelineStep["state"] = "upcoming";

    if (currentStatus === id || (id === "preparing" && currentStatus === "processing")) {
      state = "current";
    } else if (currentRank > rank) {
      state = "complete";
    }

    return {
      id,
      label: locale.startsWith("fr") ? descriptor.labelFr : descriptor.labelEn,
      tone: descriptor.tone,
      state,
    };
  });
}

/** Default Cameroon domestic window after payment confirmation. */
export function defaultEstimatedDeliveryWindow(from = new Date()): {
  start: string;
  end: string;
} {
  const start = new Date(from);
  start.setDate(start.getDate() + 2);
  const end = new Date(from);
  end.setDate(end.getDate() + 4);

  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}
