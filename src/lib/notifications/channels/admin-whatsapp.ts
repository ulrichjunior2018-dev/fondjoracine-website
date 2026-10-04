import { logger } from "@/lib/logger/logger";
import { isWhatsAppConfigured, sendWhatsApp } from "@/lib/sms/twilio-client";

import type { NotificationChannel, OrderNotificationKind, OrderPlacedNotification } from "../types";

function waCopy(kind: OrderNotificationKind, event: OrderPlacedNotification): string {
  if (kind === "confirmed") {
    return `✅ Payment confirmed — order ${event.orderNumber}\n${event.customerName}, ${event.totalLabel}\n${event.confirmationUrl}`;
  }
  if (kind === "payment_submitted") {
    return `💳 Payment reference submitted — order ${event.orderNumber}\n${event.customerName}, ${event.totalLabel}. Verify in admin.\n${event.confirmationUrl}`;
  }
  return `🛍️ New order ${event.orderNumber}\n${event.customerName}, ${event.totalLabel}\n${event.city}, ${event.phone}\n${event.confirmationUrl}`;
}

/**
 * Admin-only WhatsApp alert via Twilio's WhatsApp Sandbox — a stopgap for
 * "tell me the moment an order lands" while the SMS compliance profile is
 * pending review (see lib/sms/twilio-client.ts doc comment on
 * TWILIO_WHATSAPP_FROM/TO). NOT a production channel: shared sandbox
 * number, messages carry a "Twilio Sandbox:" prefix, and the session
 * expires ~24h after the admin last messaged the sandbox — it needs
 * re-joining periodically. Swap to a registered WhatsApp Business Sender
 * (or just use customer_sms once compliance clears) when that matters.
 *
 * Admin-initiated status changes are skipped, same as admin-email — the
 * admin already knows when they changed something.
 */
export const adminWhatsAppChannel: NotificationChannel = {
  key: "admin_whatsapp",
  isConfigured: isWhatsAppConfigured,
  async notifyOrderPlaced(event) {
    if (!isWhatsAppConfigured()) return;

    const kind: OrderNotificationKind = event.kind ?? "placed";
    if (kind === "status_updated") return;

    try {
      const result = await sendWhatsApp(waCopy(kind, event));
      logger.info("Admin WhatsApp alert sent.", {
        kind,
        orderNumber: event.orderNumber,
        sid: result.sid,
      });
    } catch (err) {
      logger.error("Failed to send admin WhatsApp alert. order was still created.", {
        error: err instanceof Error ? err.message : String(err),
        kind,
        orderNumber: event.orderNumber,
      });
    }
  },
};
