import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "rounded-md bg-[linear-gradient(110deg,var(--surface-muted),color-mix(in_srgb,var(--surface-muted)_60%,var(--surface-elevated)),var(--surface-muted))] bg-[length:200%_100%] motion-safe:animate-shimmer",
        className,
      )}
      {...props}
    />
  );
}
