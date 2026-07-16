"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

import { copy, type Locale } from "@/content/copy";
import { useI18n } from "@/lib/i18n-context";
import { localeStorageKey, localeSuggestionStorageKey } from "@/lib/locale";

/** Best-effort mapping from a browser/OS language tag to a supported site locale. */
function detectBrowserLocale(): Locale {
  const browserLanguage = window.navigator.language.toLowerCase();

  return browserLanguage.startsWith("fr") ? "fr" : "en";
}

/**
 * Suggests switching locale when the visitor's browser/system language differs
 * from the locale currently shown — in either direction (en → fr or fr → en).
 * Only shown once per visitor unless they clear their locale choice.
 */
export function LanguageSuggestionBanner() {
  const { locale, setLocale } = useI18n();
  const [suggestedLocale, setSuggestedLocale] = useState<Locale | null>(null);

  useEffect(() => {
    const hasChoice = window.localStorage.getItem(localeStorageKey);
    const hasDismissed = window.localStorage.getItem(localeSuggestionStorageKey);

    if (hasChoice || hasDismissed) {
      return;
    }

    const detected = detectBrowserLocale();

    if (detected !== locale) {
      const frame = window.requestAnimationFrame(() => setSuggestedLocale(detected));

      return () => window.cancelAnimationFrame(frame);
    }
  }, [locale]);

  if (!suggestedLocale) {
    return null;
  }

  // Rebind so the handler below keeps the narrowed (non-null) type.
  const targetLocale = suggestedLocale;
  const bannerCopy = copy[targetLocale].home.language;

  function acceptSuggestion() {
    setLocale(targetLocale);
    setSuggestedLocale(null);
  }

  function dismissSuggestion() {
    window.localStorage.setItem(localeStorageKey, locale);
    window.localStorage.setItem(localeSuggestionStorageKey, "resolved");
    setSuggestedLocale(null);
  }

  return (
    <div className="fixed inset-x-0 top-0 z-[80] border-b border-[#B8935A]/30 bg-[#F5EFE3] px-4 py-3 text-[#0B0B0B] shadow-[0_12px_40px_rgb(0_0_0/.18)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-center">
        <span className="font-serif text-base">{bannerCopy.bannerText}</span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="rounded-full bg-[#0B0B0B] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#B8935A]"
            onClick={acceptSuggestion}
            type="button"
          >
            {bannerCopy.bannerAccept}
          </button>
          <button
            className="inline-flex items-center gap-1 rounded-full border border-[#0B0B0B]/18 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em]"
            onClick={dismissSuggestion}
            type="button"
          >
            {bannerCopy.bannerDismiss}
            <X className="size-3" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
