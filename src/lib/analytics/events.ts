import type { AnalyticsEventName, AnalyticsEventParams } from "@/lib/analytics/types";
import { isClientAnalyticsEnabled } from "@/lib/analytics/config";
import { getStoredUtmParams } from "@/lib/analytics/utm";

function ensureDataLayer(): Array<Record<string, unknown>> {
  if (typeof window === "undefined") {
    return [];
  }

  window.dataLayer = window.dataLayer ?? [];
  return window.dataLayer;
}

/**
 * Push a GTM/GA4-compatible event. Safe no-op when analytics is off or SSR.
 * Include first-touch UTMs when available so social/campaign attribution sticks.
 */
export function pushDataLayer(payload: Record<string, unknown>): void {
  if (typeof window === "undefined") {
    return;
  }

  ensureDataLayer().push(payload);
}

export function trackEvent(event: AnalyticsEventName, params: AnalyticsEventParams = {}): void {
  if (typeof window === "undefined" || !isClientAnalyticsEnabled()) {
    return;
  }

  const utm = getStoredUtmParams();
  const cleaned: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      cleaned[key] = value;
    }
  }

  pushDataLayer({
    event,
    ...utm,
    ...cleaned,
  });
}

export function trackPageView(path: string, title?: string): void {
  trackEvent("page_view", {
    page_path: path,
    page_title: title ?? (typeof document !== "undefined" ? document.title : undefined),
    page_location: typeof window !== "undefined" ? window.location.href : undefined,
  });
}

export function trackViewItem(params: {
  item_id: string;
  item_name: string;
  price?: number;
  currency?: string;
}): void {
  trackEvent("view_item", {
    currency: params.currency ?? "XAF",
    value: params.price,
    item_id: params.item_id,
    item_name: params.item_name,
  });
}

export function trackBeginCheckout(params?: { value?: number; currency?: string }): void {
  trackEvent("begin_checkout", {
    currency: params?.currency ?? "XAF",
    value: params?.value,
  });
}

export function trackPurchase(params: {
  transaction_id: string;
  value?: number;
  currency?: string;
  items?: string;
}): void {
  trackEvent("purchase", {
    transaction_id: params.transaction_id,
    value: params.value,
    currency: params.currency ?? "XAF",
    items: params.items,
  });
}

export function trackSignUp(method: string = "password"): void {
  trackEvent("sign_up", { method });
}

export function trackLogin(method: string = "password"): void {
  trackEvent("login", { method });
}

export function trackWhatsAppClick(context: string): void {
  trackEvent("whatsapp_click", { context });
  trackEvent("generate_lead", { method: "whatsapp", context });
}

export function trackNewsletterSubscribe(source: string): void {
  trackEvent("newsletter_subscribe", { source });
  trackEvent("generate_lead", { method: "newsletter", context: source });
}

export function trackDiagnosticComplete(riskLevel?: string): void {
  trackEvent("diagnostic_complete", { risk_level: riskLevel });
}
