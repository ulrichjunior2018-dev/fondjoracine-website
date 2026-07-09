"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

import { LanguageSuggestionBanner } from "@/components/ui/LanguageSuggestionBanner";
import { CustomCursor } from "@/components/ui/custom-cursor";
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
          <CustomCursor />
          <LanguageSuggestionBanner />
          <ToastProvider>{children}</ToastProvider>
        </SmoothScrollProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
