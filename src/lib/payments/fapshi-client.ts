import { env } from "@/config/env";
import { AppError } from "@/lib/errors/app-error";
import { logger } from "@/lib/logger/logger";

/**
 * Fapshi — Cameroon payment aggregator covering MTN MoMo and Orange Money
 * behind a single API. `initiatePay` returns one hosted payment link; the
 * customer picks their network (MTN or Orange) on Fapshi's own page, so our
 * `mtn_momo` / `orange_money` checkout buttons both resolve to the exact
 * same call here — the distinction only matters for CMS/UI copy, not for
 * which API we hit.
 *
 * Auth is two static headers (no OAuth token dance like the direct MTN/Orange
 * APIs): `apiuser` + `apikey` from the Fapshi dashboard. Sandbox and live use
 * different hosts, not different credentials.
 *
 * Docs: https://docs.fapshi.com
 */

const SANDBOX_BASE_URL = "https://sandbox.fapshi.com";
const LIVE_BASE_URL = "https://live.fapshi.com";

function getBaseUrl(): string {
  if (env.FAPSHI_BASE_URL) return env.FAPSHI_BASE_URL.replace(/\/$/, "");
  return env.FAPSHI_ENV === "live" ? LIVE_BASE_URL : SANDBOX_BASE_URL;
}

export function isFapshiConfigured(): boolean {
  return Boolean(env.FAPSHI_API_USER && env.FAPSHI_API_KEY);
}

function requireConfig(): { apiUser: string; apiKey: string } {
  const { FAPSHI_API_USER, FAPSHI_API_KEY } = env;

  if (!FAPSHI_API_USER || !FAPSHI_API_KEY) {
    throw new AppError(
      "BAD_REQUEST",
      "Mobile Money (Fapshi) is not configured. Set FAPSHI_API_USER and FAPSHI_API_KEY in Vercel and redeploy.",
    );
  }

  return { apiKey: FAPSHI_API_KEY, apiUser: FAPSHI_API_USER };
}

function authHeaders(): Record<string, string> {
  const { apiUser, apiKey } = requireConfig();
  return { apikey: apiKey, apiuser: apiUser, "Content-Type": "application/json" };
}

export type InitiatePayArgs = {
  /** Integer XAF amount (Fapshi, like the networks themselves, has no minor unit). Minimum 100. */
  amount: number;
  /** Our order id — round-trips back on the webhook and status check. */
  externalId: string;
  redirectUrl: string;
  message: string;
  email?: string;
};

export type FapshiPayment = {
  link: string;
  transId: string;
};

export async function initiatePay(args: InitiatePayArgs): Promise<FapshiPayment> {
  const response = await fetch(`${getBaseUrl()}/initiate-pay`, {
    body: JSON.stringify({
      amount: args.amount,
      externalId: args.externalId,
      message: args.message,
      redirectUrl: args.redirectUrl,
      ...(args.email ? { email: args.email } : {}),
    }),
    headers: authHeaders(),
    method: "POST",
  });

  const data = (await response.json().catch(() => null)) as {
    message?: string;
    link?: string;
    transId?: string;
  } | null;

  if (!response.ok || !data?.link || !data?.transId) {
    logger.error("Fapshi initiate-pay failed.", {
      body: data,
      externalId: args.externalId,
      status: response.status,
    });
    throw new AppError("BAD_REQUEST", data?.message || "Unable to start Mobile Money checkout.");
  }

  return { link: data.link, transId: data.transId };
}

export type FapshiStatus = "CREATED" | "PENDING" | "SUCCESSFUL" | "FAILED" | "EXPIRED";

export type FapshiPaymentStatus = {
  status: FapshiStatus;
  amount: number;
  financialTransId?: string;
  medium?: string;
  externalId?: string;
};

/** Always call this to confirm payment — never trust the redirect or webhook payload alone. */
export async function getPaymentStatus(transId: string): Promise<FapshiPaymentStatus> {
  const response = await fetch(`${getBaseUrl()}/payment-status/${transId}`, {
    headers: authHeaders(),
    method: "GET",
  });

  const data = (await response.json().catch(() => null)) as {
    message?: string;
    status?: FapshiStatus;
    amount?: number;
    financialTransId?: string;
    medium?: string;
    externalId?: string;
  } | null;

  if (!response.ok || !data?.status) {
    logger.error("Fapshi payment-status failed.", { body: data, status: response.status, transId });
    throw new AppError("BAD_REQUEST", data?.message || "Unable to check Mobile Money payment status.");
  }

  const result: FapshiPaymentStatus = { amount: data.amount ?? 0, status: data.status };
  if (data.financialTransId) result.financialTransId = data.financialTransId;
  if (data.medium) result.medium = data.medium;
  if (data.externalId) result.externalId = data.externalId;
  return result;
}
