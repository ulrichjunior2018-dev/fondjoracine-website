import { fail, ok } from "@/lib/api/responses";
import { requireApiUser } from "@/lib/auth/rbac";
import {
  getOrCreateCustomerAccount,
  listOrdersForCustomer,
} from "@/services/customer/customer-service";

export const dynamic = "force-dynamic";

/** List the signed-in customer's own orders (see "My Orders"). */
export async function GET(request: Request) {
  try {
    const { supabase, user } = await requireApiUser();
    const account = await getOrCreateCustomerAccount(supabase, user.id);
    const locale = new URL(request.url).searchParams.get("locale") ?? "en";
    const orders = await listOrdersForCustomer(supabase, account.id, locale);

    return ok(orders);
  } catch (error) {
    return fail(error);
  }
}
