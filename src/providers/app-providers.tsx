"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

import { LanguageSuggestionBanner } from "@/components/ui/LanguageSuggestionBanner";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { MicroInteractions } from "@/components/ui/micro-interactions";
import { ToastProvider } from "@/components/ui/toast";
import { I18nProvider } from "@/lib/i18n-context";
import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <I18nProvider>
        <SmoothScrollProvider>
          <MicroInteractions />
          <CustomCursor />
          <LanguageSuggestionBanner />
          <LanguageToggle />
          <ToastProvider>{children}</ToastProvider>
        </SmoothScrollProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
