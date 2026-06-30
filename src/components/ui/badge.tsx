import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger" | "sage" | "rose";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

function getBadgeToneClassName(tone: BadgeTone) {
  switch (tone) {
    case "accent":
      return "bg-accent-muted text-accent";
    case "success":
      return "bg-success-muted text-success";
    case "warning":
      return "bg-warning-muted text-warning";
    case "danger":
      return "bg-destructive-muted text-destructive";
    case "sage":
      return "bg-sage-muted text-sage";
    case "rose":
      return "bg-rose-muted text-rose";
    case "neutral":
      return "bg-surface-muted text-foreground";
  }
}

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-md px-2.5 text-xs font-medium leading-none",
        getBadgeToneClassName(tone),
        className,
      )}
      {...props}
    />
  );
}
