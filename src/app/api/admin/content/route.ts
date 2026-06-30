import { adminContentUpdateSchema } from "@/domain/commerce/schemas";
import { parseJsonBody } from "@/lib/api/request";
import { fail, ok } from "@/lib/api/responses";
import { requireAdminPermission } from "@/lib/auth/rbac";
import { adminPermissions } from "@/lib/database/schema";
import { updateAdminContent } from "@/services/commerce/admin-dashboard-service";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  try {
    const input = await parseJsonBody(request, adminContentUpdateSchema);
    const { supabase } = await requireAdminPermission(adminPermissions.contentWrite);
    const content = await updateAdminContent(supabase, input);

    return ok({ content });
  } catch (error) {
    return fail(error);
  }
}
