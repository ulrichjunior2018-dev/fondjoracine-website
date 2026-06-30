import { z } from "zod";

import { fail, ok } from "@/lib/api/responses";
import { AppError } from "@/lib/errors/app-error";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getProductBySlug } from "@/services/commerce/catalog-service";

const paramsSchema = z.object({
  slug: z.string().min(1),
});

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const params = paramsSchema.safeParse(await context.params);

    if (!params.success) {
      throw new AppError("BAD_REQUEST", "Invalid product slug.");
    }

    const supabase = await createSupabaseServerClient();
    const product = await getProductBySlug(supabase, params.data.slug);

    return ok({ product });
  } catch (error) {
    return fail(error);
  }
}
