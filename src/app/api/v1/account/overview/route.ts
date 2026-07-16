import { fail, ok } from "@/lib/api/responses";
import { requireApiUser } from "@/lib/auth/rbac";
import { getAccountOverview } from "@/services/customer/customer-service";

export const dynamic = "force-dynamic";

/** Dashboard "Home" summary for the signed-in customer. */
export async function GET() {
  try {
    const { supabase, user } = await requireApiUser();
    const overview = await getAccountOverview(supabase, user.id);

    return ok(overview);
  } catch (error) {
    return fail(error);
  }
}
