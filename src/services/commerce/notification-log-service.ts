import type { SupabaseClient } from "@supabase/supabase-js";

import { AppError } from "@/lib/errors/app-error";

export type NotificationFailure = {
  id: string;
  orderId: string | null;
  orderNumber: string | null;
  channel: string;
  kind: string;
  status: string;
  recipient: string | null;
  error: string | null;
  createdAt: string;
};

/**
 * Recent failed/undelivered notification attempts across every channel
 * (admin email, customer email, customer SMS), joined to the order number
 * for admin troubleshooting. Backs the "Notification failures" panel on
 * /admin/orders — see notification_log in 000016_sms_notifications.sql.
 */
export async function listRecentNotificationFailures(
  supabase: SupabaseClient,
  limit = 20,
): Promise<NotificationFailure[]> {
  const { data, error } = await supabase
    .from("notification_log")
    .select(
      "id, order_id, channel, kind, status, recipient, error, created_at, orders(order_number)",
    )
    .in("status", ["failed", "undelivered"])
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new AppError("INTERNAL", "Unable to load notification failures.", { expose: false });
  }

  return (data ?? []).map((row) => {
    const orders = row.orders as { order_number: string } | { order_number: string }[] | null;
    const orderNumber = Array.isArray(orders)
      ? (orders[0]?.order_number ?? null)
      : (orders?.order_number ?? null);

    return {
      id: row.id,
      orderId: row.order_id,
      orderNumber,
      channel: row.channel,
      kind: row.kind,
      status: row.status,
      recipient: row.recipient,
      error: row.error,
      createdAt: row.created_at,
    };
  });
}
