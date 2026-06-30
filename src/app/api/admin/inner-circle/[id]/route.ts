import { innerCircleStatusUpdateSchema } from "@/domain/commerce/schemas";
import { parseJsonBody } from "@/lib/api/request";
import { fail, ok } from "@/lib/api/responses";
import { requireAdminPermission } from "@/lib/auth/rbac";
import { adminPermissions } from "@/lib/database/schema";
import { updateInnerCircleMemberStatus } from "@/services/commerce/admin-dashboard-service";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const input = await parseJsonBody(request, innerCircleStatusUpdateSchema);
    const { id } = await context.params;
    const { supabase } = await requireAdminPermission(adminPermissions.subscriptionsWrite);
    const member = await updateInnerCircleMemberStatus(supabase, id, input);

    return ok({ member });
  } catch (error) {
    return fail(error);
  }
}
