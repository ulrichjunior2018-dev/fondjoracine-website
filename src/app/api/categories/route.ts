import { fail, ok } from "@/lib/api/responses";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { listCategories } from "@/services/commerce/catalog-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const categories = await listCategories(supabase);

    return ok({ categories });
  } catch (error) {
    return fail(error);
  }
}
