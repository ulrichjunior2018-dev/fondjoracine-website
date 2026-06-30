import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type EyebrowProps = HTMLAttributes<HTMLParagraphElement>;

export function Eyebrow({ className, ...props }: EyebrowProps) {
  return (
    <p
      className={cn(
        "font-sans text-[10px] font-medium uppercase leading-none tracking-[0.4em] text-[var(--gold)]",
        className,
      )}
      {...props}
    />
  );
}
