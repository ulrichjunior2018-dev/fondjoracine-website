import { getSupabaseAdminClient } from "@/lib/database/admin";
import { logger } from "@/lib/logger/logger";
import { CAMEROON_MOBILE_LOCAL_PATTERN } from "@/lib/phone/cameroon";
import { isTwilioConfigured, sendSms } from "@/lib/sms/twilio-client";

import { logNotificationAttempt } from "../log";
import type { NotificationChannel, OrderNotificationKind, OrderPlacedNotification } from "../types";

/**
 * Normalizes a stored phone (digits + optional leading "+", see
 * `normalizePhone` in one-product-order-service.ts) to E.164 for Twilio.
 * Maison Fondjo's customers are overwhelmingly Cameroonian and the checkout
 * form doesn't collect a country code, so a bare local number matching a
 * real Cameroon mobile prefix (see `lib/phone/cameroon.ts`) is assumed to be
 * Cameroon (+237). Anything already carrying a "+" or a "237" prefix is
 * passed through as-is. A number that doesn't match returns null — we'd
 * rather skip the text than fire it at a malformed number.
 */
function toE164(phone: string): string | null {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("237")) return `+${digits}`;
  if (CAMEROON_MOBILE_LOCAL_PATTERN.test(digits)) return `+237${digits}`;
  return null;
}

function isFrench(locale: OrderPlacedNotification["locale"]) {
  return locale === "fr";
}

function smsCopy(
  kind: OrderNotificationKind,
  fr: boolean,
  orderNumber: string,
  statusLabel: string | undefined,
  confirmationUrl: string,
): string {
  if (kind === "status_updated") {
    const label = statusLabel || (fr ? "mise à jour" : "updated");
    return fr
      ? `Maison Fondjo: commande ${orderNumber} -> ${label}. Suivi: ${confirmationUrl}`
      : `Maison Fondjo: order ${orderNumber} -> ${label}. Track: ${confirmationUrl}`;
  }
  if (kind === "confirmed") {
    return fr
      ? `Maison Fondjo: paiement confirmé pour la commande ${orderNumber}. Suivi: ${confirmationUrl}`
      : `Maison Fondjo: payment confirmed for order ${orderNumber}. Track: ${confirmationUrl}`;
  }
  if (kind === "payment_submitted") {
    return fr
      ? `Maison Fondjo: référence reçue pour la commande ${orderNumber}, vérification en cours. Suivi: ${confirmationUrl}`
      : `Maison Fondjo: reference received for order ${orderNumber}, verifying now. Track: ${confirmationUrl}`;
  }
  return fr
    ? `Maison Fondjo: commande ${orderNumber} reçue. Suivi: ${confirmationUrl}`
    : `Maison Fondjo: order ${orderNumber} received. Track: ${confirmationUrl}`;
}

/**
 * Own opt-in column, independent of email's `order_updates`
 * (see 000016_sms_notifications.sql). Guest orders (no customerId) default
 * to allowed — there's no account to hold a preference against.
 */
async function shouldSendSmsUpdates(customerId: string | null | undefined): Promise<boolean> {
  if (!customerId) return true;

  try {
    const supabase = getSupabaseAdminClient();
    const { data } = await supabase
      .from("customer_notification_preferences")
      .select("sms_updates")
      .eq("customer_id", customerId)
      .maybeSingle<{ sms_updates: boolean }>();

    if (!data) return true;
    return data.sms_updates;
  } catch {
    return true;
  }
}

/**
 * Texts the buyer on order lifecycle events (placed, reference submitted,
 * confirmed, status updates) via Twilio. Skips quietly when the phone can't
 * be resolved to E.164, Twilio isn't configured, or the customer opted out —
 * never throws, matching every other notification channel.
 */
export const customerSmsChannel: NotificationChannel = {
  key: "customer_sms",
  isConfigured: isTwilioConfigured,
  async notifyOrderPlaced(event) {
    if (!isTwilioConfigured()) return;

    const to = toE164(event.phone);
    if (!to) {
      logger.warn("Customer order SMS skipped. phone could not be resolved to E.164.", {
        orderNumber: event.orderNumber,
      });
      return;
    }

    const allowed = await shouldSendSmsUpdates(event.customerId);
    if (!allowed) {
      logger.info("Customer order SMS skipped. SMS updates disabled.", {
        orderNumber: event.orderNumber,
      });
      return;
    }

    const kind: OrderNotificationKind = event.kind ?? "placed";
    const fr = isFrench(event.locale);
    const body = smsCopy(kind, fr, event.orderNumber, event.statusLabel, event.confirmationUrl);

    try {
      const result = await sendSms({ body, to });
      logger.info("Customer order SMS sent.", {
        kind,
        orderNumber: event.orderNumber,
        sid: result.sid,
        status: result.status,
      });
      await logNotificationAttempt({
        channel: "customer_sms",
        kind,
        orderId: event.orderId,
        providerId: result.sid,
        recipient: to,
        status: "sent",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      logger.error("Failed to send customer order SMS. order was still saved.", {
        error: message,
        kind,
        orderNumber: event.orderNumber,
      });
      await logNotificationAttempt({
        channel: "customer_sms",
        error: message,
        kind,
        orderId: event.orderId,
        recipient: to,
        status: "failed",
      });
    }
  },
};
