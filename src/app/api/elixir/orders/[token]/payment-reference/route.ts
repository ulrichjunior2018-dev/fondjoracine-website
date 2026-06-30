import { headers } from "next/headers";
import { z } from "zod";

import { submitPaymentReferenceSchema } from "@/domain/commerce/schemas";
import { fail, ok } from "@/lib/api/responses";
import { parseJsonBody } from "@/lib/api/request";
import { getSupabaseAdminClient } from "@/lib/database/admin";
import { AppError } from "@/lib/errors/app-error";
import { assertRateLimit } from "@/lib/security/rate-limit";
import { submitOrderPaymentReference } from "@/services/commerce/one-product-order-service";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    token: string;
  }>;
};

const paramsSchema = z.object({
  token: z.string().min(24).max(128),
});

function getClientKey(headersList: Headers) {
  return (
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "anonymous"
  );
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const headersList = await headers();
    const params = paramsSchema.safeParse(await context.params);

    if (!params.success) {
      throw new AppError("BAD_REQUEST", "Order token is invalid.");
    }

    assertRateLimit(`payment-reference:${getClientKey(headersList)}:${params.data.token}`, {
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });

    const input = await parseJsonBody(request, submitPaymentReferenceSchema);
    const supabase = getSupabaseAdminClient();
    const order = await submitOrderPaymentReference(supabase, params.data.token, input);

    return ok({ order });
  } catch (error) {
    return fail(error);
  }
}
