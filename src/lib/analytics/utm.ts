const UTM_STORAGE_KEY = "mf_utm_attribution";
const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "ttclid",
] as const;

export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>>;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/** Capture campaign params from the landing URL (social / ads). First-touch wins. */
export function captureUtmFromLocation(): UtmParams {
  if (!isBrowser()) {
    return {};
  }

  const existing = getStoredUtmParams();
  if (Object.keys(existing).length > 0) {
    return existing;
  }

  const params = new URLSearchParams(window.location.search);
  const next: UtmParams = {};

  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) {
      next[key] = value;
    }
  }

  // Soft referrer fallback when no UTMs (organic social / direct sites)
  if (Object.keys(next).length === 0) {
    const ref = document.referrer;
    if (ref) {
      try {
        const host = new URL(ref).hostname.replace(/^www\./, "");
        if (host && host !== window.location.hostname.replace(/^www\./, "")) {
          next.utm_source = host;
          next.utm_medium = "referral";
        }
      } catch {
        // ignore invalid referrer
      }
    }
  }

  if (Object.keys(next).length > 0) {
    try {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // private mode / storage blocked
    }
  }

  return next;
}

export function getStoredUtmParams(): UtmParams {
  if (!isBrowser()) {
    return {};
  }

  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return {};
    }
    return parsed as UtmParams;
  } catch {
    return {};
  }
}
