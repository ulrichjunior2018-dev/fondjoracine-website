import type { ElixirContent, Locale } from "@/features/elixir/data/content";
import { t } from "@/features/elixir/data/content";
import { dispatchOrderPlacedNotifications } from "@/lib/notifications/registry";
import type { OrderPlacedNotification } from "@/lib/notifications/types";

/**
 * Order-notification entry point for the commerce layer. Delivery is handled by
 * the notification channel registry (`src/lib/notifications`), so new channels
 * (SMS, push, Slack, mobile push) can be added without touching the order flow.
 */
export type OrderNotificationPayload = OrderPlacedNotification;

export function buildWhatsAppOrderMessage(
  content: ElixirContent,
  locale: Locale,
  payload: OrderNotificationPayload,
) {
  const productName = t(content.product.name, locale);

  return [
    locale.startsWith("fr")
      ? `Bonjour Maison Fondjo, j'ai cree la commande ${payload.orderNumber}.`
      : `Hello Maison Fondjo, I created order ${payload.orderNumber}.`,
    `${locale.startsWith("fr") ? "Produit" : "Product"}: ${productName}`,
    `${locale.startsWith("fr") ? "Client" : "Customer"}: ${payload.customerName}`,
    `${locale.startsWith("fr") ? "Telephone" : "Phone"}: ${payload.phone}`,
    `${locale.startsWith("fr") ? "Ville" : "City"}: ${payload.city}`,
    `${locale.startsWith("fr") ? "Paiement" : "Payment"}: ${payload.paymentMethod}`,
    `${locale.startsWith("fr") ? "Total" : "Total"}: ${payload.totalLabel}`,
    `${locale.startsWith("fr") ? "Confirmation" : "Confirmation"}: ${payload.confirmationUrl}`,
  ].join("\n");
}

export async function queueOrderNotifications(payload: OrderNotificationPayload) {
  await dispatchOrderPlacedNotifications(payload);
}
