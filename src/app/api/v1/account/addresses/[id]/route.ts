import { z } from "zod";

import { updateAddressSchema } from "@/domain/customer/schemas";
import { fail, ok } from "@/lib/api/responses";
import { parseJsonBody } from "@/lib/api/request";
import { AppError } from "@/lib/errors/app-error";
import { requireApiUser } from "@/lib/auth/rbac";
import {
  deleteAddress,
  getOrCreateCustomerAccount,
  updateAddress,
} from "@/services/customer/customer-service";

const paramsSchema = z.object({ id: z.string().uuid() });

export const dynamic = "force-dynamic";

/** Update one of the signed-in customer's addresses. */
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = paramsSchema.safeParse(await context.params);

    if (!params.success) {
      throw new AppError("BAD_REQUEST", "Invalid address id.");
    }

    const { supabase, user } = await requireApiUser();
    const account = await getOrCreateCustomerAccount(supabase, user.id);
    const input = await parseJsonBody(request, updateAddressSchema);
    const address = await updateAddress(supabase, account.id, params.data.id, input);

    return ok(address);
  } catch (error) {
    return fail(error);
  }
}

/** Delete one of the signed-in customer's addresses. */
export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = paramsSchema.safeParse(await context.params);

    if (!params.success) {
      throw new AppError("BAD_REQUEST", "Invalid address id.");
    }

    const { supabase, user } = await requireApiUser();
    const account = await getOrCreateCustomerAccount(supabase, user.id);

    await deleteAddress(supabase, account.id, params.data.id);

    return ok({ deleted: true });
  } catch (error) {
    return fail(error);
  }
}
