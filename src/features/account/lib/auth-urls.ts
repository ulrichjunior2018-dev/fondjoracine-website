type AuthErrorHints = {
  fallback: string;
  invalidEmail?: string;
  rateLimit?: string;
  sendFailed?: string;
};

type AuthErrorLike = {
  code?: string;
  message?: string;
  status?: number;
};

/**
 * Builds the OAuth / email-confirm / password-reset return URL for Supabase Auth.
 * Uses the current browser origin so local, preview, and production hosts work.
 */
export function buildAuthCallbackUrl(nextPath = "/account"): string {
  const safeNext = nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/account";

  if (typeof window === "undefined") {
    return `/auth/callback?next=${encodeURIComponent(safeNext)}`;
  }

  return `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`;
}

function readAuthErrorLike(error: unknown): AuthErrorLike {
  if (!error || typeof error !== "object") {
    return {};
  }

  const record = error as Record<string, unknown>;

  return {
    code: typeof record.code === "string" ? record.code : undefined,
    message: typeof record.message === "string" ? record.message.trim() : undefined,
    status: typeof record.status === "number" ? record.status : undefined,
  };
}

function isUsableMessage(message: string | undefined): message is string {
  return Boolean(message && message !== "{}" && message !== "[object Object]");
}

/** Turn Supabase Auth errors into readable customer-facing copy. */
export function resolveAuthErrorMessage(error: unknown, hints: AuthErrorHints): string {
  const { code, message, status } = readAuthErrorLike(error);

  if (
    code === "over_email_send_rate_limit" ||
    (isUsableMessage(message) && /rate limit exceeded/i.test(message))
  ) {
    return hints.rateLimit ?? hints.sendFailed ?? hints.fallback;
  }

  if (code === "email_address_invalid") {
    return hints.invalidEmail ?? hints.fallback;
  }

  if (
    code === "unexpected_failure" ||
    code === "hook_timeout" ||
    (isUsableMessage(message) &&
      /(smtp|email.*send|redirect.*not allowed|invalid.*redirect)/i.test(message))
  ) {
    return hints.sendFailed ?? hints.fallback;
  }

  if (isUsableMessage(message)) {
    return message;
  }

  if (code) {
    return code.replace(/_/g, " ");
  }

  if (status === 401 || status === 403) {
    return hints.fallback;
  }

  if (error instanceof Error && isUsableMessage(error.message)) {
    return error.message;
  }

  return hints.fallback;
}

/** @deprecated Use `resolveAuthErrorMessage` with hint strings from the dictionary. */
export function formatAuthErrorMessage(message: string, rateLimitHint?: string): string {
  if (/rate limit exceeded/i.test(message)) {
    return rateLimitHint ?? message;
  }

  return isUsableMessage(message) ? message : (rateLimitHint ?? "Please try again.");
}
