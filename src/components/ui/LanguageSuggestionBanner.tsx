"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

import { copy } from "@/content/copy";
import { useI18n } from "@/lib/i18n-context";
import { localeStorageKey, localeSuggestionStorageKey } from "@/lib/locale";

export function LanguageSuggestionBanner() {
  const { setLocale } = useI18n();
  const bannerCopy = copy.fr.home.language;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasChoice = window.localStorage.getItem(localeStorageKey);
    const hasDismissed = window.localStorage.getItem(localeSuggestionStorageKey);
    const browserLanguage = window.navigator.language.toLowerCase();

    if (!hasChoice && !hasDismissed && browserLanguage.startsWith("fr")) {
      const frame = window.requestAnimationFrame(() => setIsVisible(true));

      return () => window.cancelAnimationFrame(frame);
    }
  }, []);

  if (!isVisible) {
    return null;
  }

  function acceptFrench() {
    setLocale("fr");
    setIsVisible(false);
  }

  function keepEnglish() {
    window.localStorage.setItem(localeStorageKey, "en");
    window.localStorage.setItem(localeSuggestionStorageKey, "resolved");
    setLocale("en");
    setIsVisible(false);
  }

  return (
    <div className="fixed inset-x-0 top-0 z-[80] border-b border-[#d6b75b]/30 bg-[#f6f0e4] px-4 py-3 text-[#080706] shadow-[0_12px_40px_rgb(0_0_0/.18)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-center">
        <span className="font-serif text-base">{bannerCopy.bannerText}</span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="rounded-full bg-[#080706] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#d6b75b]"
            onClick={acceptFrench}
            type="button"
          >
            {bannerCopy.bannerAccept}
          </button>
          <button
            className="inline-flex items-center gap-1 rounded-full border border-[#080706]/18 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em]"
            onClick={keepEnglish}
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
