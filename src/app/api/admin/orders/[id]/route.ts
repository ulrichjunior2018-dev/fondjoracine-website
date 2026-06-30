import { adminOrderStatusUpdateSchema } from "@/domain/commerce/schemas";
import { parseJsonBody } from "@/lib/api/request";
import { fail, ok } from "@/lib/api/responses";
import { requireAdminPermission } from "@/lib/auth/rbac";
import { adminPermissions } from "@/lib/database/schema";
import { updateAdminOrderStatus } from "@/services/commerce/one-product-order-service";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const input = await parseJsonBody(request, adminOrderStatusUpdateSchema);
    const { id } = await context.params;
    const { supabase, user } = await requireAdminPermission(adminPermissions.ordersWrite);

    if (input.status === "confirmed") {
      await requireAdminPermission(adminPermissions.paymentsWrite);
    }

    const order = await updateAdminOrderStatus(supabase, user.id, id, input);

    return ok({ order });
  } catch (error) {
    return fail(error);
  }
}
