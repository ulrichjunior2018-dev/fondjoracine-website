import { env } from "@/config/env";
import { getSupabaseAdminClient } from "@/lib/database/admin";
import { getResendClient } from "@/lib/email/resend";
import { logger } from "@/lib/logger/logger";

import type { NotificationChannel, OrderNotificationKind, OrderPlacedNotification } from "../types";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isFrench(locale: OrderPlacedNotification["locale"]) {
  return locale === "fr";
}

function copyFor(kind: OrderNotificationKind, fr: boolean) {
  if (kind === "confirmed") {
    return fr
      ? {
          headline: "Paiement confirmé",
          intro:
            "Merci. Votre paiement pour Sève Racine est confirmé. Notre équipe prépare votre commande.",
          subject: (orderNumber: string) => `Commande confirmée ${orderNumber}, Maison Fondjo`,
          cta: "Voir ma confirmation",
        }
      : {
          headline: "Payment confirmed",
          intro:
            "Thank you. Your payment for Sève Racine is confirmed. Our team is preparing your order.",
          subject: (orderNumber: string) => `Order confirmed ${orderNumber}, Maison Fondjo`,
          cta: "View your confirmation",
        };
  }

  if (kind === "payment_submitted") {
    return fr
      ? {
          headline: "Référence reçue",
          intro:
            "Nous avons bien reçu votre référence de paiement. Notre équipe la vérifie et vous confirme ensuite.",
          subject: (orderNumber: string) => `Référence reçue ${orderNumber}, Maison Fondjo`,
          cta: "Suivre ma commande",
        }
      : {
          headline: "Payment reference received",
          intro:
            "We received your payment reference. Our team will verify it and confirm your order shortly.",
          subject: (orderNumber: string) =>
            `Payment reference received ${orderNumber}, Maison Fondjo`,
          cta: "Track your order",
        };
  }

  return fr
    ? {
        headline: "Commande reçue",
        intro:
          "Merci pour votre commande Sève Racine. Conservez cet email. Il contient le lien de suivi de votre commande.",
        subject: (orderNumber: string) => `Commande reçue ${orderNumber}, Maison Fondjo`,
        cta: "Voir ma commande",
      }
    : {
        headline: "Order received",
        intro:
          "Thank you for your Sève Racine order. Keep this email. It includes your order tracking link.",
        subject: (orderNumber: string) => `Order received ${orderNumber}, Maison Fondjo`,
        cta: "View your order",
      };
}

function buildCustomerHtml(payload: OrderPlacedNotification, kind: OrderNotificationKind): string {
  const fr = isFrench(payload.locale);
  const text = copyFor(kind, fr);
  const safe = {
    city: escapeHtml(payload.city),
    confirmationUrl: escapeHtml(payload.confirmationUrl),
    customerName: escapeHtml(payload.customerName),
    orderNumber: escapeHtml(payload.orderNumber),
    paymentMethod: escapeHtml(payload.paymentMethod),
    phone: escapeHtml(payload.phone),
    productName: escapeHtml(payload.productName || "Sève Racine"),
    totalLabel: escapeHtml(payload.totalLabel),
    transactionReference: payload.transactionReference
      ? escapeHtml(payload.transactionReference)
      : undefined,
  };
  const labels = fr
    ? {
        order: "N° de commande",
        product: "Produit",
        total: "Total",
        payment: "Paiement",
        delivery: "Livraison",
        phone: "Téléphone",
        reference: "Référence",
      }
    : {
        order: "Order number",
        product: "Product",
        total: "Total",
        payment: "Payment",
        delivery: "Delivery",
        phone: "Phone",
        reference: "Reference",
      };

  const txRow = safe.transactionReference
    ? `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #e8e0d4;font-weight:600;width:160px;color:#5c5346;">${labels.reference}</td>
        <td style="padding:10px 0;border-bottom:1px solid #e8e0d4;font-family:monospace;color:#0B0B0B;">${safe.transactionReference}</td>
      </tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="${fr ? "fr" : "en"}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F7F2E8;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F2E8;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;max-width:600px;width:100%;border:1px solid #e8e0d4;">
        <tr>
          <td style="background:#0B0B0B;padding:28px 32px;">
            <p style="margin:0;font-size:12px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#B8935A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Maison Fondjo</p>
            <h1 style="margin:10px 0 0;font-size:26px;font-weight:400;color:#F5EFE3;">${text.headline}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
            <p style="margin:0 0 8px;font-size:15px;color:#0B0B0B;">${fr ? "Bonjour" : "Hello"} ${safe.customerName},</p>
            <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#5c5346;">${text.intro}</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e8e0d4;font-weight:600;width:160px;color:#5c5346;">${labels.order}</td>
                <td style="padding:10px 0;border-bottom:1px solid #e8e0d4;font-family:monospace;color:#0B0B0B;">${safe.orderNumber}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e8e0d4;font-weight:600;color:#5c5346;">${labels.product}</td>
                <td style="padding:10px 0;border-bottom:1px solid #e8e0d4;color:#0B0B0B;">${safe.productName}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e8e0d4;font-weight:600;color:#5c5346;">${labels.total}</td>
                <td style="padding:10px 0;border-bottom:1px solid #e8e0d4;font-weight:600;color:#0B0B0B;">${safe.totalLabel}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e8e0d4;font-weight:600;color:#5c5346;">${labels.payment}</td>
                <td style="padding:10px 0;border-bottom:1px solid #e8e0d4;color:#0B0B0B;">${safe.paymentMethod}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e8e0d4;font-weight:600;color:#5c5346;">${labels.delivery}</td>
                <td style="padding:10px 0;border-bottom:1px solid #e8e0d4;color:#0B0B0B;">${safe.city}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e8e0d4;font-weight:600;color:#5c5346;">${labels.phone}</td>
                <td style="padding:10px 0;border-bottom:1px solid #e8e0d4;color:#0B0B0B;">${safe.phone}</td>
              </tr>
              ${txRow}
            </table>
            <p style="margin:28px 0 0;">
              <a href="${safe.confirmationUrl}" style="display:inline-block;background:#B8935A;color:#0B0B0B;padding:12px 22px;text-decoration:none;border-radius:999px;font-weight:700;font-size:14px;">${text.cta}</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px;background:#F7F2E8;border-top:1px solid #e8e0d4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
            <p style="margin:0;font-size:12px;color:#8a7f6e;">Maison Fondjo, maisonfondjo.com. ${fr ? "Des questions ? Écrivez-nous sur WhatsApp." : "Questions? Message us on WhatsApp."}</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function shouldSendOrderUpdates(customerId: string | null | undefined): Promise<boolean> {
  if (!customerId) return true;

  try {
    const supabase = getSupabaseAdminClient();
    const { data } = await supabase
      .from("customer_notification_preferences")
      .select("order_updates")
      .eq("customer_id", customerId)
      .maybeSingle<{ order_updates: boolean }>();

    if (!data) return true;
    return data.order_updates;
  } catch {
    return true;
  }
}

/**
 * Emails the buyer when an order is placed, a MoMo reference is submitted,
 * or payment is confirmed. Skips quietly when email/Resend/prefs block send.
 */
export const customerEmailChannel: NotificationChannel = {
  key: "customer_email",
  isConfigured: () => Boolean(env.RESEND_API_KEY),
  async notifyOrderPlaced(event) {
    const email = event.customerEmail?.trim();
    if (!email) return;
    if (!env.RESEND_API_KEY) return;

    const kind: OrderNotificationKind = event.kind ?? "placed";
    const allowed = await shouldSendOrderUpdates(event.customerId);
    if (!allowed) {
      logger.info("Customer order email skipped. order updates disabled.", {
        orderNumber: event.orderNumber,
        kind,
      });
      return;
    }

    const fr = isFrench(event.locale);
    const text = copyFor(kind, fr);
    const fromEmail = env.RESEND_FROM_EMAIL || "care@maisonfondjo.com";

    try {
      const resend = getResendClient();
      const { error: sendError } = await resend.emails.send({
        from: `Maison Fondjo <${fromEmail}>`,
        to: email,
        subject: text.subject(event.orderNumber),
        html: buildCustomerHtml(event, kind),
      });

      if (sendError) {
        logger.error("Customer order email rejected by Resend.", {
          error: sendError.message,
          kind,
          orderNumber: event.orderNumber,
          recipient: email,
        });
        return;
      }

      logger.info("Customer order email sent.", {
        kind,
        orderNumber: event.orderNumber,
        recipient: email,
      });
    } catch (err) {
      logger.error("Failed to send customer order email. order was still saved.", {
        error: err instanceof Error ? err.message : String(err),
        kind,
        orderNumber: event.orderNumber,
      });
    }
  },
};
