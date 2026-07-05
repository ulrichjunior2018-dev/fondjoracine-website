"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { copy, type Locale } from "@/content/copy";
import { isLocale, localeStorageKey, localeSuggestionStorageKey, pickLocale } from "@/lib/locale";

type I18nContextValue = {
  copy: (typeof copy)[Locale];
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const storedLocale = window.localStorage.getItem(localeStorageKey);
    const nextLocale = isLocale(storedLocale) ? storedLocale : "en";

    document.documentElement.lang = nextLocale;

    if (nextLocale.charCodeAt(0) !== locale.charCodeAt(0)) {
      const frame = window.requestAnimationFrame(() => setLocaleState(nextLocale));

      return () => window.cancelAnimationFrame(frame);
    }
  }, []);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    window.localStorage.setItem(localeStorageKey, nextLocale);
    window.localStorage.setItem(localeSuggestionStorageKey, "resolved");
    document.documentElement.lang = nextLocale;
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(pickLocale(locale, { english: "fr", french: "en" }));
  }, [locale, setLocale]);

  const value = useMemo(
    () => ({
      copy: copy[locale],
      locale,
      setLocale,
      toggleLocale,
    }),
    [locale, setLocale, toggleLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }

  return context;
}

export function useCopy() {
  return useI18n().copy;
}
