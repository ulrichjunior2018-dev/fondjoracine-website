import { NextResponse } from "next/server";

import { fail } from "@/lib/api/responses";
import { requireAdminPermission } from "@/lib/auth/rbac";
import { adminPermissions } from "@/lib/database/schema";
import { exportCustomersCsv } from "@/services/commerce/admin-dashboard-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { supabase } = await requireAdminPermission(adminPermissions.customersRead);
    const csv = await exportCustomersCsv(supabase);

    return new NextResponse(csv, {
      headers: {
        "Content-Disposition": 'attachment; filename="maisonfondjo-customers.csv"',
        "Content-Type": "text/csv; charset=utf-8",
      },
    });
  } catch (error) {
    return fail(error);
  }
}
