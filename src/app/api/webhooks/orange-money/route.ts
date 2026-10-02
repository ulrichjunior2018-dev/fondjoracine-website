import { ok } from "@/lib/api/responses";
import { getSupabaseAdminClient } from "@/lib/database/admin";
import { logger } from "@/lib/logger/logger";
import { getOrangeTransactionStatus } from "@/lib/payments/orange-money-client";
import {
  failMobileMoneyOrder,
  fulfillMobileMoneyOrder,
} from "@/services/commerce/one-product-order-service";

export const dynamic = "force-dynamic";

/**
 * Orange Money `notif_url` target, set per-request in `createOrangeWebPayment`.
 *
 * Orange's notif payload is not cryptographically signed, so — same policy as
 * the MTN webhook — this only re-queries `transactionstatus` (the source of
 * truth, confirmed with order_id + amount + pay_token) before fulfilling,
 * rather than trusting the callback body directly.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      order_id?: string;
      pay_token?: string;
      amount?: number;
      status?: string;
    } | null;

    const orderId = body?.order_id;
    const payToken = body?.pay_token;

    if (!orderId || !payToken) {
      logger.warn("Orange Money notif missing order_id/pay_token.", { body });
      return ok({ received: true });
    }

    const supabase = getSupabaseAdminClient();

    const { data: order } = await supabase
      .from("orders")
      .select("total_cents")
      .eq("id", orderId)
      .maybeSingle<{ total_cents: number }>();

    if (!order) {
      logger.warn("Orange Money notif referenced unknown order.", { orderId });
      return ok({ received: true });
    }

    const result = await getOrangeTransactionStatus({
      amount: order.total_cents,
      orderId,
      payToken,
    });

    if (result.status === "SUCCESS") {
      await fulfillMobileMoneyOrder(supabase, {
        mobileMoneyReference: payToken,
        provider: "orange_money",
        providerPaymentId: result.txnId ?? payToken,
      });
    } else if (result.status === "FAILED" || result.status === "EXPIRED") {
      await failMobileMoneyOrder(supabase, {
        mobileMoneyReference: payToken,
        provider: "orange_money",
        reason: result.status,
      });
    }

    return ok({ received: true });
  } catch (error) {
    logger.error("Orange Money webhook handling failed.", {
      message: error instanceof Error ? error.message : String(error),
    });
    return ok({ received: true });
  }
}
