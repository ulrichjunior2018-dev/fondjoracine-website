import { addressSchema } from "@/domain/customer/schemas";
import { fail, ok } from "@/lib/api/responses";
import { parseJsonBody } from "@/lib/api/request";
import { requireApiUser } from "@/lib/auth/rbac";
import {
  createAddress,
  getOrCreateCustomerAccount,
  listAddresses,
} from "@/services/customer/customer-service";

export const dynamic = "force-dynamic";

/** List the signed-in customer's saved addresses. */
export async function GET() {
  try {
    const { supabase, user } = await requireApiUser();
    const account = await getOrCreateCustomerAccount(supabase, user.id);
    const addresses = await listAddresses(supabase, account.id);

    return ok(addresses);
  } catch (error) {
    return fail(error);
  }
}

/** Save a new address for the signed-in customer. */
export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireApiUser();
    const account = await getOrCreateCustomerAccount(supabase, user.id);
    const input = await parseJsonBody(request, addressSchema);
    const address = await createAddress(supabase, account.id, input);

    return ok(address, { status: 201 });
  } catch (error) {
    return fail(error);
  }
}
