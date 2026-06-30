import { createProductSchema, productListQuerySchema } from "@/domain/commerce/schemas";
import { fail, ok } from "@/lib/api/responses";
import { parseJsonBody, parseSearchParams } from "@/lib/api/request";
import { requireAdminPermission } from "@/lib/auth/rbac";
import { adminPermissions } from "@/lib/database/schema";
import { createProduct, listProducts } from "@/services/commerce/catalog-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const query = parseSearchParams(request, productListQuerySchema);
    const { supabase } = await requireAdminPermission(adminPermissions.catalogRead);
    const products = await listProducts(supabase, query);

    return ok({ products });
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: Request) {
  try {
    const input = await parseJsonBody(request, createProductSchema);
    const { supabase } = await requireAdminPermission(adminPermissions.catalogWrite);
    const product = await createProduct(supabase, input);

    return ok({ product }, { status: 201 });
  } catch (error) {
    return fail(error);
  }
}
