import { adminEmailChannel } from "./channels/admin-email";
import { adminWhatsAppChannel } from "./channels/admin-whatsapp";
import { customerEmailChannel } from "./channels/customer-email";
import { customerSmsChannel } from "./channels/customer-sms";
import type { NotificationChannel, OrderPlacedNotification } from "./types";

/**
 * Single source of truth for notification channels. To add a channel (push,
 * Slack, …): create a module implementing `NotificationChannel` and
 * register it here — the order flow does not change.
 */
const channels: readonly NotificationChannel[] = [
  adminEmailChannel,
  adminWhatsAppChannel,
  customerEmailChannel,
  customerSmsChannel,
];

export function listNotificationChannels(): readonly NotificationChannel[] {
  return channels;
}

/**
 * Fan an order lifecycle event out to every channel. Never throws: each channel
 * handles its own errors so a notification failure can't fail the order.
 */
export async function dispatchOrderPlacedNotifications(
  event: OrderPlacedNotification,
): Promise<void> {
  await Promise.all(channels.map((channel) => channel.notifyOrderPlaced(event)));
}
