import { env } from "@/config/env";
import { AppError } from "@/lib/errors/app-error";
import { logger } from "@/lib/logger/logger";

/**
 * MTN Mobile Money — Collection API ("Request to Pay").
 *
 * Unlike Stripe/Orange, MTN MoMo has no hosted checkout page: `requestToPay`
 * pushes a PIN-confirmation prompt straight to the payer's phone and returns
 * immediately (202 Accepted, empty body). The caller must then poll
 * `getTransactionStatus` (and/or receive the `X-Callback-Url` webhook) until
 * the customer approves or rejects on their handset.
 *
 * Docs: https://momodeveloper.mtn.com — Collection product.
 */

const DEFAULT_SANDBOX_BASE_URL = "https://sandbox.momodeveloper.mtn.com";

function getBaseUrl(): string {
  return (env.MTN_MOMO_BASE_URL || DEFAULT_SANDBOX_BASE_URL).replace(/\/$/, "");
}

function getTargetEnvironment(): string {
  return env.MTN_MOMO_TARGET_ENVIRONMENT || "sandbox";
}

export function isMtnMomoConfigured(): boolean {
  return Boolean(env.MTN_MOMO_SUBSCRIPTION_KEY && env.MTN_MOMO_API_USER && env.MTN_MOMO_API_KEY);
}

/** Narrows the optional env strings to required ones in one place, with a clear error if missing. */
function requireConfig(): { subscriptionKey: string; apiUser: string; apiKey: string } {
  const { MTN_MOMO_SUBSCRIPTION_KEY, MTN_MOMO_API_USER, MTN_MOMO_API_KEY } = env;

  if (!MTN_MOMO_SUBSCRIPTION_KEY || !MTN_MOMO_API_USER || !MTN_MOMO_API_KEY) {
    throw new AppError(
      "BAD_REQUEST",
      "MTN MoMo is not configured. Set MTN_MOMO_SUBSCRIPTION_KEY, MTN_MOMO_API_USER and MTN_MOMO_API_KEY in Vercel and redeploy.",
    );
  }

  return { apiKey: MTN_MOMO_API_KEY, apiUser: MTN_MOMO_API_USER, subscriptionKey: MTN_MOMO_SUBSCRIPTION_KEY };
}

// Module-level cache: Edge/Node function instances are reused across warm
// invocations, so this avoids an extra token round-trip on every request.
// Safe to lose on cold start — getAccessToken() re-fetches transparently.
let cachedToken: { expiresAt: number; value: string } | null = null;

async function getAccessToken(): Promise<{ token: string; subscriptionKey: string }> {
  const { subscriptionKey, apiUser, apiKey } = requireConfig();

  if (cachedToken && cachedToken.expiresAt > Date.now() + 5_000) {
    return { subscriptionKey, token: cachedToken.value };
  }

  const credentials = Buffer.from(`${apiUser}:${apiKey}`).toString("base64");

  const response = await fetch(`${getBaseUrl()}/collection/token/`, {
    headers: {
      Authorization: `Basic ${credentials}`,
      "Ocp-Apim-Subscription-Key": subscriptionKey,
    },
    method: "POST",
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    logger.error("MTN MoMo token request failed.", { body, status: response.status });
    throw new AppError(
      "BAD_REQUEST",
      "Unable to authenticate with MTN MoMo. Check MTN_MOMO_API_USER / MTN_MOMO_API_KEY / MTN_MOMO_SUBSCRIPTION_KEY.",
    );
  }

  const data = (await response.json()) as { access_token: string; expires_in: number };
  cachedToken = { expiresAt: Date.now() + data.expires_in * 1000, value: data.access_token };
  return { subscriptionKey, token: cachedToken.value };
}

export type MtnRequestToPayArgs = {
  /** UUID — becomes the lookup key for status checks and the callback. */
  referenceId: string;
  /** Decimal string, e.g. "1500" (no currency symbol, no thousands separator). */
  amount: string;
  /** "EUR" in sandbox (MTN sandbox only accepts EUR); "XAF" once on the production target. */
  currency: string;
  /** MSISDN without "+", e.g. "237670000000". */
  payerPhone: string;
  externalId: string;
  payerMessage: string;
  payeeNote: string;
  /** Our webhook URL — MTN POSTs the final status here if callback delivery succeeds. */
  callbackUrl?: string;
};

/** Fires the push-payment prompt. Resolves once MTN has *accepted the request* — not once the customer has paid. */
export async function mtnRequestToPay(args: MtnRequestToPayArgs): Promise<void> {
  const { token, subscriptionKey } = await getAccessToken();

  const response = await fetch(`${getBaseUrl()}/collection/v1_0/requesttopay`, {
    body: JSON.stringify({
      amount: args.amount,
      currency: args.currency,
      externalId: args.externalId,
      payeeNote: args.payeeNote,
      payer: {
        partyId: args.payerPhone,
        partyIdType: "MSISDN",
      },
      payerMessage: args.payerMessage,
    }),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": subscriptionKey,
      "X-Reference-Id": args.referenceId,
      "X-Target-Environment": getTargetEnvironment(),
      ...(args.callbackUrl ? { "X-Callback-Url": args.callbackUrl } : {}),
    },
    method: "POST",
  });

  if (response.status !== 202) {
    const body = await response.text().catch(() => "");
    logger.error("MTN MoMo requesttopay failed.", {
      body,
      referenceId: args.referenceId,
      status: response.status,
    });
    throw new AppError(
      "BAD_REQUEST",
      "MTN MoMo declined the payment request. Check the phone number and try again.",
    );
  }
}

export type MtnTransactionStatus = "PENDING" | "SUCCESSFUL" | "FAILED";

export type MtnTransactionResult = {
  status: MtnTransactionStatus;
  financialTransactionId?: string;
  reason?: string;
};

export async function mtnGetTransactionStatus(referenceId: string): Promise<MtnTransactionResult> {
  const { token, subscriptionKey } = await getAccessToken();

  const response = await fetch(`${getBaseUrl()}/collection/v1_0/requesttopay/${referenceId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Ocp-Apim-Subscription-Key": subscriptionKey,
      "X-Target-Environment": getTargetEnvironment(),
    },
    method: "GET",
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    logger.error("MTN MoMo status check failed.", { body, referenceId, status: response.status });
    throw new AppError("BAD_REQUEST", "Unable to check MTN MoMo payment status.");
  }

  const data = (await response.json()) as {
    financialTransactionId?: string;
    reason?: { message?: string } | string;
    status: MtnTransactionStatus;
  };

  const result: MtnTransactionResult = { status: data.status };
  if (data.financialTransactionId) result.financialTransactionId = data.financialTransactionId;
  const reason = typeof data.reason === "string" ? data.reason : data.reason?.message;
  if (reason) result.reason = reason;
  return result;
}
