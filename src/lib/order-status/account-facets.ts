import { getOrderStatus, getOrderStatusRank } from "@/lib/order-status/registry";

export type AccountPaymentStatus = "pending" | "paid" | "refunded" | "cancelled";

const TERMINAL_INACTIVE = new Set(["delivered", "cancelled", "refunded", "failed", "returned"]);

/** Payment facet derived from the order lifecycle status. */
export function getAccountPaymentStatus(orderStatus: string): AccountPaymentStatus {
  if (orderStatus === "refunded") return "refunded";
  if (orderStatus === "cancelled" || orderStatus === "failed") return "cancelled";
  if (orderStatus === "pending_payment" || orderStatus === "payment_submitted") {
    return "pending";
  }
  return "paid";
}

export function getAccountPaymentStatusLabel(orderStatus: string, locale: string): string {
  const status = getAccountPaymentStatus(orderStatus);
  const fr = locale.startsWith("fr");
  switch (status) {
    case "paid":
      return fr ? "Paye" : "Paid";
    case "pending":
      return fr ? "Paiement en attente" : "Pending payment";
    case "refunded":
      return fr ? "Rembourse" : "Refunded";
    case "cancelled":
      return fr ? "Annule" : "Cancelled";
  }
}

/** Delivery / fulfillment label for list cards (same registry as timeline). */
export function getAccountDeliveryStatusLabel(orderStatus: string, locale: string): string {
  return getOrderStatus(orderStatus).id === "unknown"
    ? orderStatus.replace(/_/g, " ")
    : locale.startsWith("fr")
      ? getOrderStatus(orderStatus).labelFr
      : getOrderStatus(orderStatus).labelEn;
}

export function isActiveAccountOrder(orderStatus: string): boolean {
  return !TERMINAL_INACTIVE.has(orderStatus) && getOrderStatusRank(orderStatus) >= 0;
}

export function canDownloadAccountReceipt(orderStatus: string): boolean {
  const payment = getAccountPaymentStatus(orderStatus);
  return payment === "paid" || payment === "refunded";
}
