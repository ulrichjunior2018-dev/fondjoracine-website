import { headers } from "next/headers";

import { createOneProductOrderSchema } from "@/domain/commerce/schemas";
import { fail, ok } from "@/lib/api/responses";
import { parseJsonBody } from "@/lib/api/request";
import { getCurrentUser } from "@/lib/auth/session";
import { getSupabaseAdminClient } from "@/lib/database/admin";
import { resolveAppBaseUrl } from "@/lib/http/app-base-url";
import { assertRateLimit } from "@/lib/security/rate-limit";
import { assertSameOriginRequest } from "@/lib/security/request-origin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createOneProductOrder } from "@/services/commerce/one-product-order-service";
import {
  getOrCreateCustomerAccount,
  saveCheckoutDeliveryAddress,
} from "@/services/customer/customer-service";

export const dynamic = "force-dynamic";

function getClientKey(headersList: Headers) {
  return (
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "anonymous"
  );
}

/**
 * Storefront checkout. Guests can order; signed-in users get `customer_id`
 * so the order appears under Account → Orders, and delivery details are saved
 * to Account → Addresses.
 */
export async function POST(request: Request) {
  try {
    assertSameOriginRequest(request);
    const headersList = await headers();
    assertRateLimit(`one-product-order:${getClientKey(headersList)}`, {
      limit: 8,
      windowMs: 15 * 60 * 1000,
    });

    const input = await parseJsonBody(request, createOneProductOrderSchema);

    let customerId: string | null = null;
    const user = await getCurrentUser();

    if (user) {
      try {
        const userClient = await createSupabaseServerClient();
        const account = await getOrCreateCustomerAccount(userClient, user.id);
        customerId = account.id;
      } catch {
        // Never block checkout if account provisioning fails — guest order still works.
        customerId = null;
      }
    }

    const supabase = getSupabaseAdminClient();
    const returnBaseUrl = resolveAppBaseUrl(headersList, request.url);
    const result = await createOneProductOrder(supabase, input, { customerId, returnBaseUrl });

    if (customerId) {
      await saveCheckoutDeliveryAddress(supabase, customerId, {
        city: input.city,
        deliveryAddress: input.delivery_address,
        name: input.name,
        phone: input.phone,
      });
    }

    return ok(result, { status: 201 });
  } catch (error) {
    return fail(error);
  }
}
