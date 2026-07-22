import { env } from "@/config/env";

/**
 * Public site origin for absolute links (emails, SEO).
 * Always configure per environment:
 * - local `.env.local` → http://localhost:3000
 * - Vercel Production → https://fondjoracine.com (or maisonfondjo.com)
 */
export function getConfiguredSiteUrl() {
  return env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
}

/**
 * Prefer the browser Origin (or forwarded host) so Stripe (and future MoMo)
 * return URLs match the environment the shopper is actually using — localhost
 * in dev, preview URL on Vercel previews, live domain in production.
 */
export function resolveAppBaseUrl(requestHeaders: Headers, requestUrl?: string) {
  const origin = requestHeaders.get("origin");
  if (origin && isSafeAppOrigin(origin)) {
    return origin.replace(/\/$/, "");
  }

  const forwardedHost = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const forwardedProto = requestHeaders.get("x-forwarded-proto");
  if (forwardedHost) {
    const host = forwardedHost.split(",")[0]?.trim();
    if (host) {
      const proto =
        forwardedProto?.split(",")[0]?.trim() ||
        (host.includes("localhost") || host.startsWith("127.") || host.startsWith("192.168.")
          ? "http"
          : "https");
      const candidate = `${proto}://${host}`;
      if (isSafeAppOrigin(candidate)) {
        return candidate.replace(/\/$/, "");
      }
    }
  }

  if (requestUrl) {
    try {
      const url = new URL(requestUrl);
      const candidate = url.origin;
      if (isSafeAppOrigin(candidate)) {
        return candidate.replace(/\/$/, "");
      }
    } catch {
      // ignore
    }
  }

  return getConfiguredSiteUrl();
}

function isSafeAppOrigin(origin: string) {
  try {
    const url = new URL(origin);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    // Block obvious non-app origins
    if (url.hostname === "checkout.stripe.com") return false;
    return true;
  } catch {
    return false;
  }
}
