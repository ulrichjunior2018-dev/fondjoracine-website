import { headers } from "next/headers";

import { createOneProductOrderSchema } from "@/domain/commerce/schemas";
import { fail, ok } from "@/lib/api/responses";
import { parseJsonBody } from "@/lib/api/request";
import { getSupabaseAdminClient } from "@/lib/database/admin";
import { assertRateLimit } from "@/lib/security/rate-limit";
import { createOneProductOrder } from "@/services/commerce/one-product-order-service";

export const dynamic = "force-dynamic";

function getClientKey(headersList: Headers) {
  return (
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "anonymous"
  );
}

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    assertRateLimit(`one-product-order:${getClientKey(headersList)}`, {
      limit: 8,
      windowMs: 15 * 60 * 1000,
    });

    const input = await parseJsonBody(request, createOneProductOrderSchema);
    const supabase = getSupabaseAdminClient();
    const result = await createOneProductOrder(supabase, input);

    return ok(result, { status: 201 });
  } catch (error) {
    return fail(error);
  }
}
