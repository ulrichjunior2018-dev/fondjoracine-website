import { z } from "zod";

import { fail, ok } from "@/lib/api/responses";
import { requireApiUser } from "@/lib/auth/rbac";
import { AppError } from "@/lib/errors/app-error";
import {
  cancelSubscriptionForCustomer,
  getOrCreateCustomerAccount,
} from "@/services/customer/customer-service";

const paramsSchema = z.object({ id: z.string().uuid() });

export const dynamic = "force-dynamic";

/** Cancels the signed-in customer's subscription. */
export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = paramsSchema.safeParse(await context.params);

    if (!params.success) {
      throw new AppError("BAD_REQUEST", "Invalid subscription id.");
    }

    const { supabase, user } = await requireApiUser();
    const account = await getOrCreateCustomerAccount(supabase, user.id);
    const subscription = await cancelSubscriptionForCustomer(supabase, account.id, params.data.id);

    return ok({ subscription });
  } catch (error) {
    return fail(error);
  }
}
