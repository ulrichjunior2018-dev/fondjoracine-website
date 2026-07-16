import { fail, ok } from "@/lib/api/responses";
import { listAvailablePaymentMethods } from "@/lib/payments/registry";

export const dynamic = "force-dynamic";

/**
 * Lists the payment methods currently configured for this deployment. Any
 * client (web checkout, future mobile) reads this instead of hardcoding
 * provider availability.
 */
export function GET() {
  try {
    return ok(listAvailablePaymentMethods());
  } catch (error) {
    return fail(error);
  }
}
