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
      className="inline-flex rounded-full border border-[#B8935A]/24 bg-[#0B0B0B]/60 p-0.5 text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-[#F5EFE3]"
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
            {isActive ? <span className="absolute inset-0 rounded-full bg-[#B8935A]" /> : null}
            <span className={`relative z-10 ${isActive ? "text-[#0B0B0B]" : "text-[#F5EFE3]/70"}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
