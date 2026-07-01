"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

import { CustomCursor } from "@/components/ui/custom-cursor";
import { MicroInteractions } from "@/components/ui/micro-interactions";
import { ToastProvider } from "@/components/ui/toast";
import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <SmoothScrollProvider>
        <MicroInteractions />
        <CustomCursor />
        <ToastProvider>{children}</ToastProvider>
      </SmoothScrollProvider>
    </ThemeProvider>
  );
}
