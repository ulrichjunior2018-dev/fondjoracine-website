import { updateProfileSchema } from "@/domain/customer/schemas";
import { fail, ok } from "@/lib/api/responses";
import { parseJsonBody } from "@/lib/api/request";
import { requireApiUser } from "@/lib/auth/rbac";
import { getOrCreateCustomerAccount, updateProfile } from "@/services/customer/customer-service";

export const dynamic = "force-dynamic";

/** Read the signed-in customer's account (profile + customer stats). */
export async function GET() {
  try {
    const { supabase, user } = await requireApiUser();
    const account = await getOrCreateCustomerAccount(supabase, user.id);

    return ok(account);
  } catch (error) {
    return fail(error);
  }
}

/** Update the signed-in customer's profile (name, phone). */
export async function PATCH(request: Request) {
  try {
    const { supabase, user } = await requireApiUser();
    const input = await parseJsonBody(request, updateProfileSchema);

    await updateProfile(supabase, user.id, input);
    const account = await getOrCreateCustomerAccount(supabase, user.id);

    return ok(account);
  } catch (error) {
    return fail(error);
  }
}
