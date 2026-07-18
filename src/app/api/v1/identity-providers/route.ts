import { fail, ok } from "@/lib/api/responses";
import { listAvailableIdentityProviders } from "@/lib/identity/registry";

export const dynamic = "force-dynamic";

/**
 * Lists identity / sign-in methods currently configured for this deployment.
 * Web auth UI, Security, and future mobile clients read this instead of
 * hardcoding provider availability — same idea as `/api/v1/payment-methods`.
 */
export function GET() {
  try {
    return ok(listAvailableIdentityProviders());
  } catch (error) {
    return fail(error);
  }
}
