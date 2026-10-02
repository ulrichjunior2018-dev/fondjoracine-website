import { env } from "@/config/env";
import { AppError } from "@/lib/errors/app-error";
import { logger } from "@/lib/logger/logger";

/**
 * Orange Money — Web Payment API (hosted redirect checkout).
 *
 * Unlike MTN MoMo, this *does* return a hosted `payment_url` — the customer
 * is redirected there to confirm with their Orange Money PIN, then Orange
 * redirects back to `return_url` / `cancel_url` and separately POSTs the
 * final status to `notif_url` (our webhook). Always re-verify via
 * `getTransactionStatus` before trusting either the redirect or the webhook,
 * per Orange's integration guidance.
 *
 * Docs: https://developer.orange.com — Orange Money Web Payment API.
 */

const DEFAULT_BASE_URL = "https://api.orange.com";

function getBaseUrl(): string {
  return (env.ORANGE_MONEY_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
}

export function isOrangeMoneyConfigured(): boolean {
  return Boolean(
    env.ORANGE_MONEY_CLIENT_ID && env.ORANGE_MONEY_CLIENT_SECRET && env.ORANGE_MONEY_MERCHANT_KEY,
  );
}

function assertConfigured(): void {
  if (!isOrangeMoneyConfigured()) {
    throw new AppError(
      "BAD_REQUEST",
      "Orange Money is not configured. Set ORANGE_MONEY_CLIENT_ID, ORANGE_MONEY_CLIENT_SECRET and ORANGE_MONEY_MERCHANT_KEY in Vercel and redeploy.",
    );
  }
}

let cachedToken: { expiresAt: number; value: string } | null = null;

async function getAccessToken(): Promise<string> {
  assertConfigured();

  if (cachedToken && cachedToken.expiresAt > Date.now() + 5_000) {
    return cachedToken.value;
  }

  const credentials = Buffer.from(
    `${env.ORANGE_MONEY_CLIENT_ID}:${env.ORANGE_MONEY_CLIENT_SECRET}`,
  ).toString("base64");

  const response = await fetch(`${getBaseUrl()}/oauth/v3/token`, {
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    logger.error("Orange Money token request failed.", { body, status: response.status });
    throw new AppError(
      "BAD_REQUEST",
      "Unable to authenticate with Orange Money. Check ORANGE_MONEY_CLIENT_ID / ORANGE_MONEY_CLIENT_SECRET.",
    );
  }

  const data = (await response.json()) as { access_token: string; expires_in: number };
  cachedToken = { expiresAt: Date.now() + data.expires_in * 1000, value: data.access_token };
  return cachedToken.value;
}

export type CreateOrangeWebPaymentArgs = {
  /** Merchant order id — we pass our own order id so webhooks map back cleanly. */
  orderId: string;
  /** Integer amount in the settlement currency's minor-or-whole unit per Orange's convention (XAF has no decimals). */
  amount: number;
  currency: string;
  returnUrl: string;
  cancelUrl: string;
  notifUrl: string;
  lang?: "fr" | "en";
  reference: string;
};

export type OrangeWebPayment = {
  paymentUrl: string;
  payToken: string;
};

export async function createOrangeWebPayment(
  args: CreateOrangeWebPaymentArgs,
): Promise<OrangeWebPayment> {
  const token = await getAccessToken();

  const response = await fetch(`${getBaseUrl()}/orange-money-webpay/cm/v1/webpayment`, {
    body: JSON.stringify({
      amount: args.amount,
      cancel_url: args.cancelUrl,
      currency: args.currency,
      lang: args.lang ?? "fr",
      merchant_key: env.ORANGE_MONEY_MERCHANT_KEY,
      notif_url: args.notifUrl,
      order_id: args.orderId,
      reference: args.reference,
      return_url: args.returnUrl,
    }),
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    logger.error("Orange Money webpayment create failed.", {
      body,
      orderId: args.orderId,
      status: response.status,
    });
    throw new AppError("BAD_REQUEST", "Unable to start Orange Money checkout.");
  }

  const data = (await response.json()) as {
    message?: string;
    pay_token: string;
    payment_url: string;
    status?: number;
  };

  if (!data.payment_url || !data.pay_token) {
    logger.error("Orange Money webpayment response missing fields.", {
      data,
      orderId: args.orderId,
    });
    throw new AppError("BAD_REQUEST", "Orange Money did not return a checkout URL.");
  }

  return { payToken: data.pay_token, paymentUrl: data.payment_url };
}

export type OrangeTransactionStatus = "SUCCESS" | "FAILED" | "PENDING" | "EXPIRED";

/** Always call this to confirm payment — never trust notif_url or the return redirect alone. */
export async function getOrangeTransactionStatus(args: {
  orderId: string;
  amount: number;
  payToken: string;
}): Promise<{ status: OrangeTransactionStatus; txnId?: string }> {
  const token = await getAccessToken();

  const response = await fetch(`${getBaseUrl()}/orange-money-webpay/cm/v1/transactionstatus`, {
    body: JSON.stringify({
      amount: args.amount,
      order_id: args.orderId,
      pay_token: args.payToken,
    }),
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    logger.error("Orange Money status check failed.", {
      body,
      orderId: args.orderId,
      status: response.status,
    });
    throw new AppError("BAD_REQUEST", "Unable to check Orange Money payment status.");
  }

  const data = (await response.json()) as { status: OrangeTransactionStatus; txnid?: string };
  const result: { status: OrangeTransactionStatus; txnId?: string } = { status: data.status };
  if (data.txnid) result.txnId = data.txnid;
  return result;
}
