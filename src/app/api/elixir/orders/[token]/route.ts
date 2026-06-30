import { fail, ok } from "@/lib/api/responses";
import { getSupabaseAdminClient } from "@/lib/database/admin";
import { getOrderByConfirmationToken } from "@/services/commerce/one-product-order-service";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    token: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { token } = await context.params;
    const supabase = getSupabaseAdminClient();
    const order = await getOrderByConfirmationToken(supabase, token);

    return ok({ order });
  } catch (error) {
    return fail(error);
  }
}
