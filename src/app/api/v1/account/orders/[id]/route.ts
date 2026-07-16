import { z } from "zod";

import { fail, ok } from "@/lib/api/responses";
import { AppError } from "@/lib/errors/app-error";
import { requireApiUser } from "@/lib/auth/rbac";
import {
  getOrCreateCustomerAccount,
  getOrderForCustomer,
} from "@/services/customer/customer-service";

const paramsSchema = z.object({ id: z.string().uuid() });

export const dynamic = "force-dynamic";

/** Order detail, scoped to the signed-in customer (404s if it isn't theirs). */
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = paramsSchema.safeParse(await context.params);

    if (!params.success) {
      throw new AppError("BAD_REQUEST", "Invalid order id.");
    }

    const { supabase, user } = await requireApiUser();
    const account = await getOrCreateCustomerAccount(supabase, user.id);
    const order = await getOrderForCustomer(supabase, account.id, params.data.id);

    return ok(order);
  } catch (error) {
    return fail(error);
  }
}
