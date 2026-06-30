import { fail, ok } from "@/lib/api/responses";
import { requireAdminPermission } from "@/lib/auth/rbac";
import { adminPermissions } from "@/lib/database/schema";
import { getAdminAnalyticsSummary } from "@/services/commerce/admin-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { supabase } = await requireAdminPermission(adminPermissions.analyticsRead);
    const summary = await getAdminAnalyticsSummary(supabase);

    return ok({ summary });
  } catch (error) {
    return fail(error);
  }
}
