import { notificationPreferencesSchema } from "@/domain/customer/schemas";
import { parseJsonBody } from "@/lib/api/request";
import { fail, ok } from "@/lib/api/responses";
import { requireApiUser } from "@/lib/auth/rbac";
import {
  getNotificationPreferences,
  getOrCreateCustomerAccount,
  listInboxNotifications,
  updateNotificationPreferences,
} from "@/services/customer/customer-service";

export const dynamic = "force-dynamic";

/**
 * GET returns preferences + inbox for mobile/web clients.
 * PATCH updates preference toggles (existing form behavior).
 */
export async function GET() {
  try {
    const { supabase, user } = await requireApiUser();
    const account = await getOrCreateCustomerAccount(supabase, user.id);
    const [preferences, inbox] = await Promise.all([
      getNotificationPreferences(supabase, account.id),
      listInboxNotifications(supabase, account.profileId, 30),
    ]);

    return ok({ preferences, inbox });
  } catch (error) {
    return fail(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const input = await parseJsonBody(request, notificationPreferencesSchema);
    const { supabase, user } = await requireApiUser();
    const account = await getOrCreateCustomerAccount(supabase, user.id);
    const preferences = await updateNotificationPreferences(supabase, account.id, input);

    return ok(preferences);
  } catch (error) {
    return fail(error);
  }
}
