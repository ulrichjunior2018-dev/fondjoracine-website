"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
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
          <FloatingWhatsApp />
          <LanguageSuggestionBanner />
          <ToastProvider>{children}</ToastProvider>
        </SmoothScrollProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
