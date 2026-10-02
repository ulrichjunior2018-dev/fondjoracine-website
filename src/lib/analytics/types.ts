/**
 * Client analytics helpers — Google Tag Manager dataLayer + optional first-party UTM stash.
 * Tags (GA4, Meta, TikTok) are configured in GTM; the app only pushes events.
 */

export type AnalyticsEventName =
  | "page_view"
  | "view_item"
  | "begin_checkout"
  | "purchase"
  | "sign_up"
  | "login"
  | "generate_lead"
  | "whatsapp_click"
  | "newsletter_subscribe"
  | "diagnostic_complete";

export type AnalyticsEventParams = Record<string, string | number | boolean | undefined | null>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}
