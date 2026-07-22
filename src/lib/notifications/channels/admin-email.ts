import { env } from "@/config/env";
import { getResendClient } from "@/lib/email/resend";
import { logger } from "@/lib/logger/logger";

import type { NotificationChannel, OrderNotificationKind, OrderPlacedNotification } from "../types";

const DEFAULT_ADMIN_NOTIFICATION_EMAIL = "hello@maisonfondjo.com";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function adminCopy(kind: OrderNotificationKind) {
  if (kind === "confirmed") {
    return {
      headline: "Payment confirmed",
      intro: "This order is paid and ready to prepare for delivery.",
      subject: (orderNumber: string) => `Confirmed Maison Fondjo order ${orderNumber}`,
      cta: "Open admin dashboard →",
    };
  }
  if (kind === "payment_submitted") {
    return {
      headline: "Payment reference submitted",
      intro: "A customer submitted a mobile-money reference. Please verify it in admin.",
      subject: (orderNumber: string) => `Verify MoMo reference ${orderNumber}`,
      cta: "Verify in Admin Dashboard →",
    };
  }
  return {
    headline: "New order",
    intro: "A new storefront order was placed.",
    subject: (orderNumber: string) => `New Maison Fondjo Order ${orderNumber}`,
    cta: "Open admin dashboard →",
  };
}

function buildAdminNotificationHtml(
  payload: OrderPlacedNotification,
  kind: OrderNotificationKind,
): string {
  const adminUrl = `${env.NEXT_PUBLIC_SITE_URL}/admin`;
  const text = adminCopy(kind);
  const safePayload = {
    city: escapeHtml(payload.city),
    confirmationUrl: escapeHtml(payload.confirmationUrl),
    customerEmail: payload.customerEmail ? escapeHtml(payload.customerEmail) : undefined,
    customerName: escapeHtml(payload.customerName),
    orderNumber: escapeHtml(payload.orderNumber),
    paymentMethod: escapeHtml(payload.paymentMethod),
    phone: escapeHtml(payload.phone),
    totalLabel: escapeHtml(payload.totalLabel),
    transactionReference: payload.transactionReference
      ? escapeHtml(payload.transactionReference)
      : undefined,
  };
  const txRow = payload.transactionReference
    ? `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-weight:600;width:180px;color:#374151;">Transaction Ref</td>
        <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-family:monospace;color:#111827;">${safePayload.transactionReference}</td>
      </tr>`
    : "";
  const emailRow = safePayload.customerEmail
    ? `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-weight:600;color:#374151;">Email</td>
        <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#111827;">${safePayload.customerEmail}</td>
      </tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);max-width:600px;width:100%;">

        <tr>
          <td style="background:#0a0905;padding:24px 32px;">
            <p style="margin:0;font-size:13px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#B8935A;">Maison Fondjo</p>
            <h1 style="margin:8px 0 0;font-size:20px;font-weight:600;color:#f5f0e8;">${text.headline} ${safePayload.orderNumber}</h1>
          </td>
        </tr>

        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 24px;font-size:15px;color:#4b5563;">${text.intro}</p>

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-weight:600;width:180px;color:#374151;">Order Number</td>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-family:monospace;color:#111827;">${safePayload.orderNumber}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-weight:600;color:#374151;">Customer</td>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#111827;">${safePayload.customerName}</td>
              </tr>
              ${emailRow}
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-weight:600;color:#374151;">Phone</td>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#111827;">${safePayload.phone}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-weight:600;color:#374151;">City</td>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#111827;">${safePayload.city}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-weight:600;color:#374151;">Payment Method</td>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#111827;">${safePayload.paymentMethod}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-weight:600;color:#374151;">Amount</td>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-weight:600;color:#111827;">${safePayload.totalLabel}</td>
              </tr>
              ${txRow}
            </table>

            <table cellpadding="0" cellspacing="0" style="margin-top:32px;">
              <tr>
                <td style="padding-right:12px;">
                  <a href="${adminUrl}" style="display:inline-block;background:#B8935A;color:#0a0905;padding:12px 20px;text-decoration:none;border-radius:6px;font-weight:700;font-size:14px;">${text.cta}</a>
                </td>
                <td>
                  <a href="${safePayload.confirmationUrl}" style="display:inline-block;color:#6b7280;padding:12px 4px;text-decoration:underline;font-size:14px;">View Confirmation Page</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:16px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">Maison Fondjo, maisonfondjo.com. Automatic order notification.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/** Emails the back-office for new orders, MoMo references, and payment confirmations. */
export const adminEmailChannel: NotificationChannel = {
  key: "admin_email",
  isConfigured: () => Boolean(env.RESEND_API_KEY),
  async notifyOrderPlaced(event) {
    if (!env.RESEND_API_KEY) {
      logger.warn("Admin order notification skipped. RESEND_API_KEY is not set.", {
        orderNumber: event.orderNumber,
        kind: event.kind ?? "placed",
      });
      return;
    }

    const kind: OrderNotificationKind = event.kind ?? "placed";
    const fromEmail = env.RESEND_FROM_EMAIL || "care@maisonfondjo.com";
    const adminEmail = env.ADMIN_EMAIL || DEFAULT_ADMIN_NOTIFICATION_EMAIL;
    const text = adminCopy(kind);

    try {
      const resend = getResendClient();
      const { error: sendError } = await resend.emails.send({
        from: `Maison Fondjo Orders <${fromEmail}>`,
        to: adminEmail,
        subject: text.subject(event.orderNumber),
        html: buildAdminNotificationHtml(event, kind),
      });

      if (sendError) {
        logger.error("Admin order notification rejected by Resend.", {
          error: sendError.message,
          kind,
          orderNumber: event.orderNumber,
          paymentMethod: event.paymentMethod,
          recipient: adminEmail,
        });
        return;
      }

      logger.info("Admin order notification sent.", {
        kind,
        orderNumber: event.orderNumber,
        paymentMethod: event.paymentMethod,
        recipient: adminEmail,
      });
    } catch (err) {
      logger.error("Failed to send admin order notification. order was still created.", {
        error: err instanceof Error ? err.message : String(err),
        kind,
        orderNumber: event.orderNumber,
        paymentMethod: event.paymentMethod,
      });
    }
  },
};
