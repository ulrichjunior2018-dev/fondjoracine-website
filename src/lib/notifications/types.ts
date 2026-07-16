/**
 * Notification abstraction (WS-3).
 *
 * Order/checkout code fires a domain event; each configured `NotificationChannel`
 * (admin email today; SMS / push / Slack / mobile push later) decides whether and
 * how to deliver it. Adding a channel is a new module + one registry line — no
 * change to the order flow.
 */

/** Payload for the "an order was placed" event. Framework-free. */
export type OrderPlacedNotification = {
  city: string;
  confirmationUrl: string;
  customerName: string;
  orderNumber: string;
  paymentMethod: string;
  phone: string;
  totalLabel: string;
  transactionReference?: string;
};

export interface NotificationChannel {
  /** Stable channel identifier (e.g. "admin_email"). */
  key: string;
  /** Whether this channel is usable given the current environment config. */
  isConfigured: () => boolean;
  /**
   * Deliver an order-placed notification. Implementations MUST NOT throw —
   * a failed notification must never fail the order. Log and swallow instead.
   */
  notifyOrderPlaced: (event: OrderPlacedNotification) => Promise<void>;
}
