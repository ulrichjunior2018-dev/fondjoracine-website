import { ok } from "@/lib/api/responses";
import { getSupabaseAdminClient } from "@/lib/database/admin";
import { logger } from "@/lib/logger/logger";
import { verifyTwilioSignature } from "@/lib/sms/twilio-client";

export const dynamic = "force-dynamic";

/**
 * Twilio Messaging status callback — set automatically on every outbound
 * SMS via `StatusCallback` in `sendSms` (see lib/sms/twilio-client.ts). Logs
 * delivery/failure onto the matching `notification_log` row (keyed by
 * `provider_id` = the Twilio message SID) so admins can see whether an
 * order-status text actually reached the customer, not just that we tried.
 *
 * Twilio's status progression: queued -> sending -> sent -> delivered, or
 * -> failed / undelivered. We only act on the terminal states; `sent` is
 * already recorded at send time.
 */
export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const params = Object.fromEntries(new URLSearchParams(rawBody));
    const signature = request.headers.get("x-twilio-signature");

    // Must match the exact URL Twilio was configured with — see
    // verifyTwilioSignature's doc comment.
    const url = request.url;

    if (!signature || !verifyTwilioSignature(url, params, signature)) {
      logger.warn("Twilio status webhook: signature verification failed.", {
        messageSid: params.MessageSid,
      });
      // Twilio doesn't retry on 2xx, and this isn't customer-facing data —
      // acknowledge quietly rather than leaking verification details.
      return ok({ received: true });
    }

    const messageSid = params.MessageSid;
    const messageStatus = params.MessageStatus;

    if (!messageSid || !messageStatus) {
      return ok({ received: true });
    }

    let status: "delivered" | "failed" | "undelivered";
    switch (messageStatus) {
      case "delivered":
        status = "delivered";
        break;
      case "failed":
        status = "failed";
        break;
      case "undelivered":
        status = "undelivered";
        break;
      default:
        // queued / sending / sent — already recorded at send time, nothing new to log.
        return ok({ received: true });
    }

    const supabase = getSupabaseAdminClient();
    const { error } = await supabase
      .from("notification_log")
      .update({
        error: params.ErrorMessage || params.ErrorCode || null,
        status,
      })
      .eq("provider_id", messageSid)
      .eq("channel", "customer_sms");

    if (error) {
      logger.error("Twilio status webhook: failed to update notification_log.", {
        error: error.message,
        messageSid,
        status,
      });
    }

    return ok({ received: true });
  } catch (error) {
    logger.error("Twilio status webhook handling failed.", {
      message: error instanceof Error ? error.message : String(error),
    });
    return ok({ received: true });
  }
}
