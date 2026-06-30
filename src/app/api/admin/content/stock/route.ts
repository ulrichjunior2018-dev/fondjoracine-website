import { adminStockUpdateSchema } from "@/domain/commerce/schemas";
import { parseJsonBody } from "@/lib/api/request";
import { fail, ok } from "@/lib/api/responses";
import { requireAdminPermission } from "@/lib/auth/rbac";
import { adminPermissions } from "@/lib/database/schema";
import { updateAdminStock } from "@/services/commerce/admin-dashboard-service";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  try {
    const input = await parseJsonBody(request, adminStockUpdateSchema);
    const { supabase } = await requireAdminPermission(adminPermissions.inventoryWrite);
    const content = await updateAdminStock(supabase, input);

    return ok({ content });
  } catch (error) {
    return fail(error);
  }
}
