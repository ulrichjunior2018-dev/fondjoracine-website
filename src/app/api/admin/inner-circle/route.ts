import { innerCircleMemberSchema } from "@/domain/commerce/schemas";
import { parseJsonBody } from "@/lib/api/request";
import { fail, ok } from "@/lib/api/responses";
import { requireAdminPermission } from "@/lib/auth/rbac";
import { adminPermissions } from "@/lib/database/schema";
import { createInnerCircleMember } from "@/services/commerce/admin-dashboard-service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const input = await parseJsonBody(request, innerCircleMemberSchema);
    const { supabase } = await requireAdminPermission(adminPermissions.subscriptionsWrite);
    const member = await createInnerCircleMember(supabase, input);

    return ok({ member }, { status: 201 });
  } catch (error) {
    return fail(error);
  }
}
