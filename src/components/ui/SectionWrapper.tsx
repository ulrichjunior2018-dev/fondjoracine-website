import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type SectionWrapperProps = HTMLAttributes<HTMLElement>;

export function SectionWrapper({ className, ...props }: SectionWrapperProps) {
  return (
    <section
      className={cn("mx-auto w-full max-w-[1100px] px-5 py-16 md:py-24", className)}
      {...props}
    />
  );
}
