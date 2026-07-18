"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string | undefined;
  /** Kept for API compatibility — scroll entrance animations are disabled. */
  staggerChildren?: boolean;
};

/**
 * Layout wrapper only. Scroll-linked reveal animations were removed so the page
 * scrolls normally without sections jumping / tightening into view.
 */
export function ScrollReveal({ children, className }: ScrollRevealProps) {
  return <div className={cn(className)}>{children}</div>;
}
