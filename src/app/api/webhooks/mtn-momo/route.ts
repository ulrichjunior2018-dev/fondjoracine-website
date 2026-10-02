import { ok } from "@/lib/api/responses";
import { getSupabaseAdminClient } from "@/lib/database/admin";
import { logger } from "@/lib/logger/logger";
import { mtnGetTransactionStatus } from "@/lib/payments/mtn-momo-client";
import {
  failMobileMoneyOrder,
  fulfillMobileMoneyOrder,
} from "@/services/commerce/one-product-order-service";

export const dynamic = "force-dynamic";

/**
 * MTN MoMo "X-Callback-Url" target, set per-request in `mtnRequestToPay`.
 *
 * MTN does not sign callback bodies the way Stripe signs webhook events, so
 * this is treated as a *hint* only — it never marks an order paid directly.
 * Instead it re-queries `/collection/v1_0/requesttopay/{referenceId}` (the
 * source of truth) before fulfilling. This also means a missed/duplicate
 * callback is harmless: the status-polling endpoint
 * (`/api/payments/mtn-momo/status`) is the reliable path and calls the same
 * re-verify-then-fulfill logic.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      referenceId?: string;
      status?: string;
      financialTransactionId?: string;
      reason?: string;
    } | null;

    const referenceId = body?.referenceId;

    if (!referenceId) {
      logger.warn("MTN MoMo callback missing referenceId.", { body });
      return ok({ received: true });
    }

    const result = await mtnGetTransactionStatus(referenceId);
    const supabase = getSupabaseAdminClient();

    if (result.status === "SUCCESSFUL") {
      await fulfillMobileMoneyOrder(supabase, {
        mobileMoneyReference: referenceId,
        provider: "mtn_momo",
        providerPaymentId: result.financialTransactionId ?? referenceId,
      });
    } else if (result.status === "FAILED") {
      await failMobileMoneyOrder(supabase, {
        mobileMoneyReference: referenceId,
        provider: "mtn_momo",
        ...(result.reason ? { reason: result.reason } : {}),
      });
    }

    return ok({ received: true });
  } catch (error) {
    logger.error("MTN MoMo webhook handling failed.", {
      message: error instanceof Error ? error.message : String(error),
    });
    // Always 200 — MTN retries aggressively on non-2xx, and the status-poll
    // endpoint is the reliable confirmation path regardless.
    return ok({ received: true });
  }
}
