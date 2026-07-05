"use client";

import { motion } from "framer-motion";
import { KeyboardEvent } from "react";

import { useI18n } from "@/lib/i18n-context";

export function LanguageBottle() {
  const { locale, toggleLocale } = useI18n();

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleLocale();
    }
  }

  return (
    <button
      aria-label="Switch language / Changer de langue"
      className="fixed bottom-4 right-4 z-[70] grid size-13 place-items-center rounded-full border border-[#d6b75b]/28 bg-[#080706]/82 shadow-[0_18px_60px_rgb(0_0_0/.38)] backdrop-blur-xl transition-transform duration-100 active:scale-[0.98] md:bottom-auto md:right-5 md:top-5"
      onClick={toggleLocale}
      onKeyDown={onKeyDown}
      type="button"
    >
      <motion.svg
        animate={{ rotateY: locale === "fr" ? 0 : 180 }}
        aria-hidden="true"
        className="h-10 w-8"
        initial={false}
        transition={{ duration: 0.23, ease: [0.22, 1, 0.36, 1] }}
        viewBox="0 0 40 58"
      >
        <defs>
          <linearGradient id="languageBottleGlass" x1="10" x2="30" y1="6" y2="54">
            <stop stopColor="#17351f" />
            <stop offset="0.48" stopColor="#07120b" />
            <stop offset="1" stopColor="#010302" />
          </linearGradient>
          <linearGradient id="languageBottleGold" x1="12" x2="28" y1="33" y2="45">
            <stop stopColor="#f1d778" />
            <stop offset="1" stopColor="#9b7a28" />
          </linearGradient>
        </defs>
        <path d="M16 3h8v9l3 4v7H13v-7l3-4V3Z" fill="#0b1b10" stroke="#d6b75b" />
        <path
          d="M11 22h18c3.1 0 5.6 2.5 5.6 5.6v20.1c0 4-3.2 7.3-7.3 7.3H12.7c-4 0-7.3-3.2-7.3-7.3V27.6C5.4 24.5 7.9 22 11 22Z"
          fill="url(#languageBottleGlass)"
          stroke="#d6b75b"
          strokeOpacity="0.74"
          strokeWidth="1.2"
        />
        <path d="M12 35h16v11H12z" fill="url(#languageBottleGold)" opacity="0.95" />
        <path d="M14 8h12" stroke="#d6b75b" strokeWidth="1.1" />
        <text
          fill="#080706"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontSize="6.6"
          fontWeight="700"
          letterSpacing="1"
          style={{
            transform: locale === "en" ? "scaleX(-1)" : undefined,
            transformOrigin: "20px 40px",
          }}
          textAnchor="middle"
          x="20"
          y="42.5"
        >
          {locale.toUpperCase()}
        </text>
      </motion.svg>
    </button>
  );
}
