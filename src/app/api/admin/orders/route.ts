import { adminPermissions } from "@/lib/database/schema";
import { fail, ok } from "@/lib/api/responses";
import { requireAdminPermission } from "@/lib/auth/rbac";
import { listAdminOrders } from "@/services/commerce/one-product-order-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { supabase } = await requireAdminPermission(adminPermissions.ordersRead);
    const orders = await listAdminOrders(supabase);

    return ok({ orders });
  } catch (error) {
    return fail(error);
  }
}
