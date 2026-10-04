import { createHmac, timingSafeEqual } from "node:crypto";

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
  // Twilio posts delivery/failure updates here once the message leaves
  // "queued" — see src/app/api/webhooks/twilio/status/route.ts.
  body.set(
    "StatusCallback",
    `${env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")}/api/webhooks/twilio/status`,
  );

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

export function isWhatsAppConfigured(): boolean {
  return Boolean(
    env.TWILIO_ACCOUNT_SID &&
    env.TWILIO_AUTH_TOKEN &&
    env.TWILIO_WHATSAPP_FROM &&
    env.TWILIO_WHATSAPP_TO,
  );
}

/**
 * Sends a WhatsApp message via Twilio's Messages API (same endpoint as SMS —
 * WhatsApp just uses `whatsapp:+E164` addresses for To/From instead of bare
 * E.164). No `StatusCallback`: the Sandbox doesn't reliably post delivery
 * status, and this is an admin-alert stopgap, not something worth tracking
 * in `notification_log` the way customer SMS is.
 */
export async function sendWhatsApp(body: string): Promise<SendSmsResult> {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM, TWILIO_WHATSAPP_TO } = env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM || !TWILIO_WHATSAPP_TO) {
    throw new AppError("BAD_REQUEST", "Twilio WhatsApp admin alerts are not configured.", {
      expose: false,
    });
  }

  const params = new URLSearchParams({
    Body: body,
    From: TWILIO_WHATSAPP_FROM,
    To: TWILIO_WHATSAPP_TO,
  });

  const response = await fetch(`${API_BASE}/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
    body: params,
    headers: {
      Authorization: `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  const json = (await response.json().catch(() => null)) as {
    sid?: string;
    status?: string;
    message?: string;
  } | null;

  if (!response.ok) {
    throw new AppError(
      "INTERNAL",
      `Twilio rejected the WhatsApp message (${response.status}): ${json?.message || "unknown error"}`,
      { expose: false },
    );
  }

  return { sid: json?.sid ?? "", status: json?.status ?? "unknown" };
}

/**
 * Verifies Twilio's `X-Twilio-Signature` header on an inbound webhook
 * (status callbacks, incoming messages, etc). Per Twilio's algorithm: sort
 * the POST params by key, append each `key+value` directly to the full
 * request URL, HMAC-SHA1 that string with the Auth Token, base64-encode,
 * and compare. `url` must be the *exact* URL Twilio was configured with
 * (scheme + host + path, no trailing slash mismatch) or every signature
 * will fail to verify even for a legitimate request.
 *
 * Docs: https://www.twilio.com/docs/usage/webhooks/webhooks-security
 */
export function verifyTwilioSignature(
  url: string,
  params: Record<string, string>,
  signature: string,
): boolean {
  if (!env.TWILIO_AUTH_TOKEN) return false;

  const data =
    url +
    Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => key + value)
      .join("");

  const expected = createHmac("sha1", env.TWILIO_AUTH_TOKEN).update(data, "utf8").digest("base64");

  const expectedBuf = Buffer.from(expected);
  const actualBuf = Buffer.from(signature);
  if (expectedBuf.length !== actualBuf.length) return false;

  return timingSafeEqual(expectedBuf, actualBuf);
}
