"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { copy, type Locale } from "@/content/copy";
import {
  isLocale,
  localeStorageKey,
  localeSuggestionStorageKey,
  writeLocaleCookie,
} from "@/lib/locale";

type I18nContextValue = {
  copy: (typeof copy)[Locale];
  locale: Locale;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const listeners = new Set<() => void>();
let memoryLocale: Locale | null = null;

function emitLocaleChange() {
  listeners.forEach((listener) => listener());
}

function subscribeLocale(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function readClientLocale(fallback: Locale): Locale {
  if (memoryLocale) {
    return memoryLocale;
  }

  const storedLocale = window.localStorage.getItem(localeStorageKey);
  return isLocale(storedLocale) ? storedLocale : fallback;
}

function persistLocale(nextLocale: Locale) {
  memoryLocale = nextLocale;
  window.localStorage.setItem(localeStorageKey, nextLocale);
  window.localStorage.setItem(localeSuggestionStorageKey, "resolved");
  writeLocaleCookie(nextLocale);
  document.documentElement.lang = nextLocale;
  emitLocaleChange();
}

export function I18nProvider({
  children,
  initialLocale = "en",
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const locale = useSyncExternalStore(
    subscribeLocale,
    () => readClientLocale(initialLocale),
    () => initialLocale,
  );

  useEffect(() => {
    const storedLocale = window.localStorage.getItem(localeStorageKey);

    if (!isLocale(storedLocale)) {
      // First visit: lock in the locale the server already detected from Accept-Language.
      persistLocale(initialLocale);
      return;
    }

    document.documentElement.lang = locale;
    writeLocaleCookie(locale);
  }, [locale]);

  const value = useMemo(
    () => ({
      copy: locale === "fr" ? copy.fr : copy.en,
      locale,
    }),
    [locale],
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
