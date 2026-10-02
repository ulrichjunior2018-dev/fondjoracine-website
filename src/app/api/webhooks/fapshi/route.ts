import { ok } from "@/lib/api/responses";
import { getSupabaseAdminClient } from "@/lib/database/admin";
import { getPaymentStatus } from "@/lib/payments/fapshi-client";
import { logger } from "@/lib/logger/logger";
import {
  failMobileMoneyOrder,
  fulfillMobileMoneyOrder,
} from "@/services/commerce/one-product-order-service";

export const dynamic = "force-dynamic";

/**
 * Fapshi webhook target — configure this URL (https://maisonfondjo.com/api/webhooks/fapshi)
 * in the Fapshi dashboard under webhook settings.
 *
 * Fapshi's webhook payload is not cryptographically signed, so — same policy
 * as every other payment webhook in this codebase — this re-queries
 * `payment-status/{transId}` (the source of truth) before fulfilling,
 * instead of trusting the callback body directly.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      transId?: string;
      status?: string;
    } | null;

    const transId = body?.transId;

    if (!transId) {
      logger.warn("Fapshi webhook missing transId.", { body });
      return ok({ received: true });
    }

    const result = await getPaymentStatus(transId);
    const supabase = getSupabaseAdminClient();

    if (result.status === "SUCCESSFUL") {
      await fulfillMobileMoneyOrder(supabase, {
        mobileMoneyReference: transId,
        providerPaymentId: result.financialTransId ?? transId,
      });
    } else if (result.status === "FAILED" || result.status === "EXPIRED") {
      await failMobileMoneyOrder(supabase, {
        mobileMoneyReference: transId,
        reason: result.status,
      });
    }

    return ok({ received: true });
  } catch (error) {
    logger.error("Fapshi webhook handling failed.", {
      message: error instanceof Error ? error.message : String(error),
    });
    return ok({ received: true });
  }
}
