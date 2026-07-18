import type { Locale } from "@/content/copy";

export const localeStorageKey = "maison-fondjo-locale";
export const localeCookieKey = "maison-fondjo-locale";
export const localeSuggestionStorageKey = "maison-fondjo-locale-suggestion";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "fr" || value === "en";
}

export function pickLocale<T>(locale: Locale, values: { english: T; french: T }) {
  return locale.charCodeAt(0) === 102 ? values.french : values.english;
}

/** Write locale cookie so server components can resolve public copy. */
export function writeLocaleCookie(locale: Locale) {
  if (typeof document === "undefined") {
    return;
  }

  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${localeCookieKey}=${locale};path=/;max-age=${maxAge};samesite=lax`;
}

export function openGraphLocale(locale: Locale) {
  return locale === "fr" ? "fr_FR" : "en_US";
}
