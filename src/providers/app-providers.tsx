"use client";

import { ThemeProvider } from "next-themes";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";

import { ToastProvider } from "@/components/ui/toast";
import type { Locale } from "@/content/copy";
import { I18nProvider } from "@/lib/i18n-context";
import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";

const FloatingWhatsApp = dynamic(
  () =>
    import("@/components/FloatingWhatsApp").then((mod) => ({
      default: mod.FloatingWhatsApp,
    })),
  { ssr: false },
);

const LanguageSuggestionBanner = dynamic(
  () =>
    import("@/components/ui/LanguageSuggestionBanner").then((mod) => ({
      default: mod.LanguageSuggestionBanner,
    })),
  { ssr: false },
);

const LanguageBottle = dynamic(
  () =>
    import("@/components/ui/LanguageBottle").then((mod) => ({
      default: mod.LanguageBottle,
    })),
  { ssr: false },
);

type AppProvidersProps = {
  children: ReactNode;
  initialLocale?: Locale;
};

export function AppProviders({ children, initialLocale = "en" }: AppProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <I18nProvider initialLocale={initialLocale}>
        <SmoothScrollProvider>
          <FloatingWhatsApp />
          <LanguageBottle />
          <LanguageSuggestionBanner />
          <ToastProvider>{children}</ToastProvider>
        </SmoothScrollProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
