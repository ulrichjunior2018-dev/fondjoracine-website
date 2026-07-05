import type { Locale } from "@/content/copy";

export const localeStorageKey = "maison-fondjo-locale";
export const localeSuggestionStorageKey = "maison-fondjo-locale-suggestion";

export function isLocale(value: string | null): value is Locale {
  return value === "fr" || value === "en";
}

export function pickLocale<T>(locale: Locale, values: { english: T; french: T }) {
  return locale.charCodeAt(0) === 102 ? values.french : values.english;
}
