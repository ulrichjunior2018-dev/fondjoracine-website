"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

import { CustomCursor } from "@/components/ui/custom-cursor";
import { ToastProvider } from "@/components/ui/toast";
import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <SmoothScrollProvider>
        <CustomCursor />
        <ToastProvider>{children}</ToastProvider>
      </SmoothScrollProvider>
    </ThemeProvider>
  );
}
