import { adminImageUpdateSchema } from "@/domain/commerce/schemas";
import { parseJsonBody } from "@/lib/api/request";
import { fail, ok } from "@/lib/api/responses";
import { requireAdminPermission } from "@/lib/auth/rbac";
import { adminPermissions } from "@/lib/database/schema";
import { updateAdminImage } from "@/services/commerce/admin-dashboard-service";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  try {
    const input = await parseJsonBody(request, adminImageUpdateSchema);
    const { supabase } = await requireAdminPermission(adminPermissions.contentWrite);
    const content = await updateAdminImage(supabase, input);

    return ok({ content });
  } catch (error) {
    return fail(error);
  }
}
