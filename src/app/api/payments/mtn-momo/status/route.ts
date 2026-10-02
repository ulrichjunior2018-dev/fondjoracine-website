import { fail, ok } from "@/lib/api/responses";
import { getSupabaseAdminClient } from "@/lib/database/admin";
import { AppError } from "@/lib/errors/app-error";
import { mtnGetTransactionStatus } from "@/lib/payments/mtn-momo-client";
import {
  failMobileMoneyOrder,
  fulfillMobileMoneyOrder,
} from "@/services/commerce/one-product-order-service";

export const dynamic = "force-dynamic";

/**
 * Polled by `/checkout/momo-pending` every few seconds. This — not the
 * webhook — is the reliable confirmation path: it re-queries MTN directly
 * (source of truth) and fulfills the order the moment status flips, so the
 * order confirms correctly even if MTN never delivers the callback.
 */
export async function GET(request: Request) {
  try {
    const ref = new URL(request.url).searchParams.get("ref");

    if (!ref) {
      throw new AppError("BAD_REQUEST", "Missing ref.");
    }

    const result = await mtnGetTransactionStatus(ref);
    const supabase = getSupabaseAdminClient();

    if (result.status === "SUCCESSFUL") {
      await fulfillMobileMoneyOrder(supabase, {
        mobileMoneyReference: ref,
        provider: "mtn_momo",
        providerPaymentId: result.financialTransactionId ?? ref,
      });
    } else if (result.status === "FAILED") {
      await failMobileMoneyOrder(supabase, {
        mobileMoneyReference: ref,
        provider: "mtn_momo",
        ...(result.reason ? { reason: result.reason } : {}),
      });
    }

    return ok({ status: result.status });
  } catch (error) {
    return fail(error);
  }
}
