import { productListQuerySchema } from "@/domain/commerce/schemas";
import { fail, ok } from "@/lib/api/responses";
import { parseSearchParams } from "@/lib/api/request";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { listProducts } from "@/services/commerce/catalog-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const query = parseSearchParams(request, productListQuerySchema);
    const supabase = await createSupabaseServerClient();
    const products = await listProducts(supabase, query);

    return ok({ products });
  } catch (error) {
    return fail(error);
  }
}
