import { env } from "@/config/env";
import { AppError } from "@/lib/errors/app-error";

function parseOrigin(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function isLocalDevHost(hostname: string) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)
  );
}

function allowedOrigins(): Set<string> {
  const origins = new Set<string>();
  try {
    origins.add(new URL(env.NEXT_PUBLIC_SITE_URL).origin);
  } catch {
    // ignore invalid site URL
  }

  if (process.env.VERCEL_URL) {
    origins.add(`https://${process.env.VERCEL_URL}`);
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    origins.add(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  }

  if (process.env.NODE_ENV !== "production") {
    origins.add("http://localhost:3000");
    origins.add("http://127.0.0.1:3000");
  }

  return origins;
}

/**
 * Soft CSRF defense for cookie-authenticated mutating requests.
 * Browsers send Origin (or Referer) on cross-site form/fetch posts.
 * Webhooks and server-to-server calls should not use this helper.
 */
export function assertSameOriginRequest(request: Request) {
  const origin = parseOrigin(request.headers.get("origin"));
  const refererOrigin = parseOrigin(request.headers.get("referer"));
  const candidate = origin ?? refererOrigin;

  // Non-browser clients (curl, some mobile WebViews) may omit both.
  // Require at least one header in production for browser-facing APIs.
  if (!candidate) {
    if (process.env.NODE_ENV === "production") {
      throw new AppError("FORBIDDEN", "Missing request origin.");
    }
    return;
  }

  if (allowedOrigins().has(candidate)) {
    return;
  }

  // Phone / LAN preview during local development.
  if (process.env.NODE_ENV !== "production") {
    try {
      if (isLocalDevHost(new URL(candidate).hostname)) {
        return;
      }
    } catch {
      // fall through
    }
  }

  throw new AppError("FORBIDDEN", "Request origin is not allowed.");
}
