import { getSupabaseAdminClient } from "@/lib/database/admin";
import { logger } from "@/lib/logger/logger";

import type { OrderNotificationKind } from "./types";

export type NotificationLogChannel = "admin_email" | "customer_email" | "customer_sms";
export type NotificationLogStatus = "sent" | "delivered" | "failed" | "undelivered";

export type LogNotificationAttemptArgs = {
  orderId?: string | undefined;
  channel: NotificationLogChannel;
  kind: OrderNotificationKind;
  status: NotificationLogStatus;
  recipient?: string | undefined;
  providerId?: string | undefined;
  error?: string | undefined;
};

/**
 * Records one notification send attempt for admin visibility (see
 * `notification_log` in 000016_sms_notifications.sql). Best-effort: a
 * logging failure must never fail the order or the notification itself, so
 * this catches and logs rather than throwing. Skips quietly when `orderId`
 * is unavailable (e.g. an event built outside the normal order flow) since
 * the table is keyed by it for admin lookup.
 */
export async function logNotificationAttempt(args: LogNotificationAttemptArgs): Promise<void> {
  if (!args.orderId) return;

  try {
    const supabase = getSupabaseAdminClient();
    await supabase.from("notification_log").insert({
      channel: args.channel,
      error: args.error ?? null,
      kind: args.kind,
      order_id: args.orderId,
      provider_id: args.providerId ?? null,
      recipient: args.recipient ?? null,
      status: args.status,
    });
  } catch (err) {
    logger.error("Failed to write notification_log row.", {
      channel: args.channel,
      error: err instanceof Error ? err.message : String(err),
      kind: args.kind,
      orderId: args.orderId,
    });
  }
}
