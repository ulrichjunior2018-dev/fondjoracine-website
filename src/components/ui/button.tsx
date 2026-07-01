"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  isLoading?: boolean;
};

function getVariantClassName(variant: ButtonVariant) {
  switch (variant) {
    case "secondary":
      return "border border-border bg-surface text-foreground hover:bg-surface-muted";
    case "ghost":
      return "text-foreground hover:bg-surface-muted";
    case "danger":
      return "bg-destructive text-white hover:bg-destructive/90";
    case "primary":
      return "bg-foreground text-background hover:bg-foreground/90 dark:bg-accent dark:text-accent-foreground dark:hover:bg-accent/90";
  }
}

function getSizeClassName(size: ButtonSize) {
  switch (size) {
    case "sm":
      return "h-9 gap-2 rounded-md px-3 text-xs";
    case "lg":
      return "h-12 gap-2.5 rounded-md px-6 text-sm";
    case "icon":
      return "h-10 w-10 rounded-md p-0";
    case "md":
      return "h-11 gap-2 rounded-md px-5 text-sm";
  }
}

export function Button({
  children,
  className,
  disabled,
  isLoading = false,
  leadingIcon,
  onClick,
  size = "md",
  trailingIcon,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden whitespace-nowrap font-medium transition-colors",
        "disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        getVariantClassName(variant),
        getSizeClassName(size),
        className,
      )}
      disabled={disabled || isLoading}
      type={type}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <span className="h-4 w-4 rounded-full border border-current border-t-transparent motion-safe:animate-spin" />
      ) : (
        leadingIcon
      )}
      {children}
      {trailingIcon}
    </button>
  );
}
