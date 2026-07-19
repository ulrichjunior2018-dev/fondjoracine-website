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

/** Map browser / Accept-Language tags to a supported site locale. */
export function detectLocaleFromLanguageTags(tags: string): Locale {
  for (const part of tags.split(",")) {
    const tag = part.trim().split(";")[0]?.toLowerCase() ?? "";

    if (tag.startsWith("fr")) {
      return "fr";
    }

    if (tag.startsWith("en")) {
      return "en";
    }
  }

  return "en";
}

/** Client-side preference from OS / browser language list. */
export function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") {
    return "en";
  }

  const languages =
    navigator.languages && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language];

  return detectLocaleFromLanguageTags(languages.join(","));
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
