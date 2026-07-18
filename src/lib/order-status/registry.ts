import {
  awaitingConfirmation,
  cancelled,
  confirmed,
  delivered,
  packed,
  paymentSubmitted,
  pendingPayment,
  processing,
  refunded,
  shipped,
  unknownStatus,
} from "./statuses";
import type { OrderStatusDescriptor, OrderStatusOption } from "./types";

const statuses: readonly OrderStatusDescriptor[] = [
  pendingPayment,
  paymentSubmitted,
  awaitingConfirmation,
  confirmed,
  processing,
  packed,
  shipped,
  delivered,
  cancelled,
  refunded,
];

export function listOrderStatuses(): readonly OrderStatusDescriptor[] {
  return statuses;
}

export function getOrderStatus(id: string): OrderStatusDescriptor {
  const match = statuses.find((candidate) => candidate.id === id);
  return match ?? unknownStatus;
}

export function listOrderStatusOptions(): OrderStatusOption[] {
  return statuses
    .filter((status) => status.isConfigured())
    .map((status) => ({
      id: status.id,
      labelEn: status.labelEn,
      labelFr: status.labelFr,
      tone: status.tone,
    }));
}

export function getOrderStatusLabel(id: string, locale: string): string {
  const status = getOrderStatus(id);
  return locale.startsWith("fr") ? status.labelFr : status.labelEn;
}
