import { env } from "@/config/env";
import { fail, ok } from "@/lib/api/responses";
import { getSupabaseAdminClient } from "@/lib/database/admin";
import { logger } from "@/lib/logger/logger";
import {
  createMobileMoneyRenewalOrder,
  markOverdueMobileMoneySubscriptions,
  sendMobileMoneyRenewalReminder,
} from "@/services/commerce/one-product-order-service";

export const dynamic = "force-dynamic";

/**
 * Daily job for "manual-renewal" MTN MoMo / Orange Money subscriptions —
 * mobile money has no stored-card auto-charge, so this is what actually
 * answers "has it been a month": it finds every `subscriptions` row whose
 * `next_billing_at` has arrived, creates a fresh pending order + Fapshi
 * payment link for each, and texts the link to the customer to approve in
 * their MoMo/Orange app. Paid renewals advance `next_billing_at` from inside
 * `fulfillMobileMoneyOrder` (the same webhook path every mobile money order
 * already goes through) — this route only ever creates the reminder, never
 * confirms payment itself.
 *
 * Configure in Vercel: Project Settings → Cron Jobs → path
 * `/api/cron/mobile-money-renewals`, schedule e.g. `0 8 * * *` (08:00 UTC
 * daily). Vercel signs the request with `Authorization: Bearer $CRON_SECRET`
 * automatically once that env var is set — nothing else to configure.
 */
export async function GET(request: Request) {
  if (!env.CRON_SECRET) {
    logger.error("Mobile money renewal cron: CRON_SECRET is not set. Refusing to run.");
    return fail(new Error("Cron is not configured."));
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return fail(new Error("Unauthorized."));
  }

  const supabase = getSupabaseAdminClient();
  const now = new Date().toISOString();

  const pastDueCount = await markOverdueMobileMoneySubscriptions(supabase);

  const { data: due, error } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("billing_provider", "mobile_money")
    .eq("status", "active")
    .is("pending_renewal_order_id", null)
    .lte("next_billing_at", now)
    .returns<{ id: string }[]>();

  if (error) {
    logger.error("Mobile money renewal cron: failed to query due subscriptions.", {
      message: error.message,
    });
    return fail(error);
  }

  let remindersSent = 0;
  let failures = 0;

  for (const row of due ?? []) {
    try {
      const result = await createMobileMoneyRenewalOrder(supabase, row.id);
      if (result) {
        await sendMobileMoneyRenewalReminder(result);
        remindersSent += 1;
      }
    } catch (err) {
      failures += 1;
      logger.error("Mobile money renewal cron: failed for subscription.", {
        message: err instanceof Error ? err.message : String(err),
        subscriptionId: row.id,
      });
    }
  }

  return ok({ failures, pastDue: pastDueCount, remindersSent, subscriptionsDue: due?.length ?? 0 });
}
