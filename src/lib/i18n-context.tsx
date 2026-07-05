"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from "react";

import { copy, type Locale } from "@/content/copy";

type I18nContextValue = {
  copy: (typeof copy)[Locale];
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);
const storageKey = "maison-fondjo-locale";

export function I18nProvider({ children }: { children: ReactNode }) {
  const locale: Locale = "fr";

  useEffect(() => {
    window.localStorage.setItem(storageKey, "fr");
    document.documentElement.lang = "fr";
  }, []);

  const setLocale = useCallback((nextLocale: Locale) => {
    void nextLocale;
    window.localStorage.setItem(storageKey, "fr");
    document.documentElement.lang = "fr";
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale("fr");
  }, [setLocale]);

  useEffect(() => {
    document.documentElement.lang = "fr";
  }, []);

  const value = useMemo(
    () => ({
      copy: copy.fr,
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
