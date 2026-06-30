import { fail, ok } from "@/lib/api/responses";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { listCollections } from "@/services/commerce/catalog-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const collections = await listCollections(supabase);

    return ok({ collections });
  } catch (error) {
    return fail(error);
  }
}
