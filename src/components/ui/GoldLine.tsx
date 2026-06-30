import type { CSSProperties, HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type GoldLineProps = HTMLAttributes<HTMLDivElement> & {
  opacity?: number;
  width?: CSSProperties["width"];
};

export function GoldLine({ className, opacity = 0.4, width = "80px", ...props }: GoldLineProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "h-px bg-[linear-gradient(90deg,transparent,var(--gold),transparent)]",
        className,
      )}
      style={{ opacity, width }}
      {...props}
    />
  );
}
