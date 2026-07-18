import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";

export const dictionaries = {
  ["en"]: en,
  ["es"]: es,
  ["fr"]: fr,
} as const;

export type SiteLanguage = keyof typeof dictionaries;
export type SiteDictionary = (typeof dictionaries)[SiteLanguage];

export const languageLabels: Record<SiteLanguage, string> = {
  ["en"]: "EN",
  ["es"]: "ES",
  ["fr"]: "FR",
};

export function isSiteLanguage(value: string | null): value is SiteLanguage {
  return value === "en" || value === "fr" || value === "es";
}

/** Resolve translation keys for a site locale (en | fr). */
export function getDictionary(locale: "en" | "fr"): SiteDictionary {
  if (locale === "fr") {
    return dictionaries.fr;
  }

  return dictionaries.en;
}
