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

/** Map Supabase Auth errors to clearer customer-facing messages when possible. */
export function formatAuthErrorMessage(message: string, rateLimitHint?: string): string {
  if (/rate limit exceeded/i.test(message)) {
    return rateLimitHint ?? message;
  }

  return message;
}
