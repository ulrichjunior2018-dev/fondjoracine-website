import { fail, ok } from "@/lib/api/responses";
import { requireApiUser } from "@/lib/auth/rbac";
import {
  getOrCreateCustomerAccount,
  getSubscriptionForCustomer,
} from "@/services/customer/customer-service";

export const dynamic = "force-dynamic";

/** The signed-in customer's current subscription, or `null` if they've never subscribed. */
export async function GET() {
  try {
    const { supabase, user } = await requireApiUser();
    const account = await getOrCreateCustomerAccount(supabase, user.id);
    const subscription = await getSubscriptionForCustomer(supabase, account.id);

    return ok({ subscription });
  } catch (error) {
    return fail(error);
  }
}
