import { notificationPreferencesSchema } from "@/domain/customer/schemas";
import { fail, ok } from "@/lib/api/responses";
import { parseJsonBody } from "@/lib/api/request";
import { requireApiUser } from "@/lib/auth/rbac";
import {
  getNotificationPreferences,
  getOrCreateCustomerAccount,
  updateNotificationPreferences,
} from "@/services/customer/customer-service";

export const dynamic = "force-dynamic";

/** Read the signed-in customer's notification preferences. */
export async function GET() {
  try {
    const { supabase, user } = await requireApiUser();
    const account = await getOrCreateCustomerAccount(supabase, user.id);
    const preferences = await getNotificationPreferences(supabase, account.id);

    return ok(preferences);
  } catch (error) {
    return fail(error);
  }
}

/** Update the signed-in customer's notification preferences. */
export async function PATCH(request: Request) {
  try {
    const { supabase, user } = await requireApiUser();
    const account = await getOrCreateCustomerAccount(supabase, user.id);
    const input = await parseJsonBody(request, notificationPreferencesSchema);
    const preferences = await updateNotificationPreferences(supabase, account.id, input);

    return ok(preferences);
  } catch (error) {
    return fail(error);
  }
}
