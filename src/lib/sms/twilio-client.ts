import { env } from "@/config/env";
import { AppError } from "@/lib/errors/app-error";

/**
 * Twilio Programmable Messaging — thin REST client (no SDK dependency, same
 * convention as `lib/payments/fapshi-client.ts`). Auth is HTTP Basic:
 * Account SID as username, Auth Token as password.
 *
 * Sending "from" is either a Messaging Service SID (preferred — Twilio
 * picks/rotates the sender and handles geo-permission routing) or a single
 * `TWILIO_FROM_NUMBER`. At least one of the two must be set.
 *
 * Docs: https://www.twilio.com/docs/messaging/api/message-resource
 */

const API_BASE = "https://api.twilio.com/2010-04-01";

export function isTwilioConfigured(): boolean {
  return Boolean(
    env.TWILIO_ACCOUNT_SID &&
    env.TWILIO_AUTH_TOKEN &&
    (env.TWILIO_MESSAGING_SERVICE_SID || env.TWILIO_FROM_NUMBER),
  );
}

function requireConfig() {
  const {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_MESSAGING_SERVICE_SID,
    TWILIO_FROM_NUMBER,
  } = env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    throw new AppError(
      "BAD_REQUEST",
      "Twilio is not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in Vercel and redeploy.",
    );
  }

  if (!TWILIO_MESSAGING_SERVICE_SID && !TWILIO_FROM_NUMBER) {
    throw new AppError(
      "BAD_REQUEST",
      "Twilio sender is not configured. Set TWILIO_MESSAGING_SERVICE_SID or TWILIO_FROM_NUMBER in Vercel and redeploy.",
    );
  }

  return {
    accountSid: TWILIO_ACCOUNT_SID,
    authToken: TWILIO_AUTH_TOKEN,
    messagingServiceSid: TWILIO_MESSAGING_SERVICE_SID || undefined,
    fromNumber: TWILIO_FROM_NUMBER || undefined,
  };
}

export type SendSmsArgs = {
  /** E.164 destination, e.g. "+237650000000". */
  to: string;
  body: string;
};

export type SendSmsResult = {
  sid: string;
  status: string;
};

/**
 * Sends one SMS via Twilio's REST API. Throws `AppError` on misconfiguration
 * or a non-2xx Twilio response — callers (notification channels) must catch
 * and log, never let this fail the order.
 */
export async function sendSms(args: SendSmsArgs): Promise<SendSmsResult> {
  const { accountSid, authToken, messagingServiceSid, fromNumber } = requireConfig();

  const body = new URLSearchParams({ To: args.to, Body: args.body });
  if (messagingServiceSid) {
    body.set("MessagingServiceSid", messagingServiceSid);
  } else if (fromNumber) {
    body.set("From", fromNumber);
  }

  const response = await fetch(`${API_BASE}/Accounts/${accountSid}/Messages.json`, {
    body,
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  const json = (await response.json().catch(() => null)) as {
    sid?: string;
    status?: string;
    message?: string;
    code?: number;
  } | null;

  if (!response.ok) {
    throw new AppError(
      "INTERNAL",
      `Twilio rejected the SMS (${response.status}): ${json?.message || "unknown error"}`,
      { expose: false },
    );
  }

  return { sid: json?.sid ?? "", status: json?.status ?? "unknown" };
}
