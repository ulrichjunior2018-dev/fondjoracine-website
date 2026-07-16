import { productListQuerySchema } from "@/domain/commerce/schemas";
import { parseSearchParams } from "@/lib/api/request";
import { fail, ok } from "@/lib/api/responses";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { listProducts } from "@/services/commerce/catalog-service";

export const dynamic = "force-dynamic";

/**
 * Versioned catalog listing. Reuses the existing `catalog-service` (no logic
 * duplicated) and returns the product array directly as `data` so the shared
 * API client / SDK can type it cleanly for web and future mobile clients.
 */
export async function GET(request: Request) {
  try {
    const query = parseSearchParams(request, productListQuerySchema);
    const supabase = await createSupabaseServerClient();
    const products = await listProducts(supabase, query);

    return ok(products);
  } catch (error) {
    return fail(error);
  }
}
