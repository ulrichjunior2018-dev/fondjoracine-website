import type { HTMLAttributes, ReactNode } from "react";

import { typography } from "@/lib/design-system/tokens";
import { cn } from "@/lib/utils/cn";

type TextTone = "default" | "muted" | "accent" | "success" | "danger";

function getToneClassName(tone: TextTone) {
  switch (tone) {
    case "muted":
      return "text-foreground/68";
    case "accent":
      return "text-accent";
    case "success":
      return "text-success";
    case "danger":
      return "text-destructive";
    case "default":
      return "text-foreground";
  }
}

function getHeadingLevelClassName(level: HeadingProps["level"]) {
  switch (level) {
    case "display":
      return typography.display;
    case "h1":
      return typography.h1;
    case "h2":
      return typography.h2;
    case "h3":
      return typography.h3;
    case "h4":
      return typography.h4;
  }
}

function getTextSizeClassName(size: TextProps["size"]) {
  switch (size) {
    case "bodySmall":
      return typography.bodySmall;
    case "caption":
      return typography.caption;
    case "mono":
      return typography.mono;
    case "body":
      return typography.body;
  }
}

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  as?: "h1" | "h2" | "h3" | "h4";
  level?: "display" | "h1" | "h2" | "h3" | "h4";
  tone?: TextTone;
};

export function Heading({
  as: Element = "h2",
  className,
  level = "h2",
  tone = "default",
  ...props
}: HeadingProps) {
  return (
    <Element
      className={cn(
        "font-sans tracking-normal",
        getHeadingLevelClassName(level),
        getToneClassName(tone),
        className,
      )}
      {...props}
    />
  );
}

type TextProps = HTMLAttributes<HTMLParagraphElement> & {
  size?: "body" | "bodySmall" | "caption" | "mono";
  tone?: TextTone;
};

export function Text({ className, size = "body", tone = "default", ...props }: TextProps) {
  return (
    <p className={cn(getTextSizeClassName(size), getToneClassName(tone), className)} {...props} />
  );
}

type KickerProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
};

export function Kicker({ className, ...props }: KickerProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-xs font-semibold uppercase leading-5 text-accent",
        className,
      )}
      {...props}
    />
  );
}
