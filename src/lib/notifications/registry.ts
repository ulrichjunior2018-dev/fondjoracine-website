import { adminEmailChannel } from "./channels/admin-email";
import type { NotificationChannel, OrderPlacedNotification } from "./types";

/**
 * Single source of truth for notification channels. To add a channel (SMS,
 * push, Slack, …): create a module implementing `NotificationChannel` and
 * register it here — the order flow does not change.
 */
const channels: readonly NotificationChannel[] = [adminEmailChannel];

export function listNotificationChannels(): readonly NotificationChannel[] {
  return channels;
}

/**
 * Fan an order-placed event out to every channel. Never throws: each channel
 * handles its own errors so a notification failure can't fail the order.
 */
export async function dispatchOrderPlacedNotifications(
  event: OrderPlacedNotification,
): Promise<void> {
  await Promise.all(channels.map((channel) => channel.notifyOrderPlaced(event)));
}
