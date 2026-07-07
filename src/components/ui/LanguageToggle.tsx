"use client";

import { useI18n } from "@/lib/i18n-context";

export function LanguageToggle() {
  const { copy, locale, setLocale } = useI18n();
  const labels = [
    { label: "FR", value: "fr" as const },
    { label: "EN", value: "en" as const },
  ];

  return (
    <div
      aria-label={copy.home.language.toggleLabel}
      className="fixed right-4 top-5 z-[70] inline-flex rounded-full border border-[#d6b75b]/24 bg-[#080706]/88 p-1 text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-[#f6f0e4] shadow-[0_18px_60px_rgb(0_0_0/.32)] backdrop-blur-xl sm:text-[0.68rem] sm:tracking-[0.16em] md:right-5 md:top-5"
      role="group"
    >
      {labels.map((item) => {
        const isActive = locale.charCodeAt(0) === item.value.charCodeAt(0);

        return (
          <button
            aria-pressed={isActive}
            className="relative min-h-8 min-w-9 rounded-full px-2.5 sm:min-h-9 sm:min-w-11 sm:px-3"
            key={item.value}
            onClick={() => setLocale(item.value)}
            type="button"
          >
            {isActive ? <span className="absolute inset-0 rounded-full bg-[#d6b75b]" /> : null}
            <span className={`relative z-10 ${isActive ? "text-[#080706]" : "text-[#f6f0e4]/70"}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
