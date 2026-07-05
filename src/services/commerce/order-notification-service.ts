import { env } from "@/config/env";
import type { ElixirContent, Locale } from "@/features/elixir/data/content";
import { t } from "@/features/elixir/data/content";
import { getResendClient } from "@/lib/email/resend";
import { logger } from "@/lib/logger/logger";

export type OrderNotificationPayload = {
  city: string;
  confirmationUrl: string;
  customerName: string;
  orderNumber: string;
  paymentMethod: string;
  phone: string;
  totalLabel: string;
  transactionReference?: string;
};

const DEFAULT_ADMIN_NOTIFICATION_EMAIL = "hello@fondjoracine.com";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

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

function buildAdminNotificationHtml(payload: OrderNotificationPayload): string {
  const adminUrl = `${env.NEXT_PUBLIC_SITE_URL}/admin`;
  const safePayload = {
    city: escapeHtml(payload.city),
    confirmationUrl: escapeHtml(payload.confirmationUrl),
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

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);max-width:600px;width:100%;">

        <tr>
          <td style="background:#0a0905;padding:24px 32px;">
            <p style="margin:0;font-size:13px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#c8a951;">Maison Fondjo</p>
            <h1 style="margin:8px 0 0;font-size:20px;font-weight:600;color:#f5f0e8;">New Order — ${safePayload.orderNumber}</h1>
          </td>
        </tr>

        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 24px;font-size:15px;color:#4b5563;">A new manual payment order has been placed and is waiting for verification.</p>

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-weight:600;width:180px;color:#374151;">Order Number</td>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-family:monospace;color:#111827;">${safePayload.orderNumber}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-weight:600;color:#374151;">Customer</td>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#111827;">${safePayload.customerName}</td>
              </tr>
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
                  <a href="${adminUrl}" style="display:inline-block;background:#c8a951;color:#0a0905;padding:12px 20px;text-decoration:none;border-radius:6px;font-weight:700;font-size:14px;">Verify in Admin Dashboard →</a>
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
            <p style="margin:0;font-size:12px;color:#9ca3af;">Maison Fondjo · fondjoracine.com · This notification was sent automatically when the order was created.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function queueOrderNotifications(payload: OrderNotificationPayload) {
  // Stripe payments are confirmed via webhook — no manual admin action needed
  if (payload.paymentMethod.toLowerCase() === "stripe") {
    return;
  }

  const fromEmail = env.RESEND_FROM_EMAIL || "care@fondjoracine.com";
  const adminEmail = env.ADMIN_EMAIL || DEFAULT_ADMIN_NOTIFICATION_EMAIL;

  try {
    const resend = getResendClient();
    await resend.emails.send({
      from: `Maison Fondjo Orders <${fromEmail}>`,
      to: adminEmail,
      subject: `New Maison Fondjo Order — ${payload.orderNumber}`,
      html: buildAdminNotificationHtml(payload),
    });

    logger.info("Admin order notification sent.", {
      orderNumber: payload.orderNumber,
      paymentMethod: payload.paymentMethod,
      recipient: adminEmail,
    });
  } catch (err) {
    logger.error("Failed to send admin order notification — order was still created.", {
      error: err instanceof Error ? err.message : String(err),
      orderNumber: payload.orderNumber,
      paymentMethod: payload.paymentMethod,
    });
  }
}
