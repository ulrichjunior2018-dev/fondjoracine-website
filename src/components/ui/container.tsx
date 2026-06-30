import type { HTMLAttributes } from "react";

import { containerWidths } from "@/lib/design-system/tokens";
import { cn } from "@/lib/utils/cn";

type ContainerSize = keyof typeof containerWidths;

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  size?: ContainerSize;
};

function getContainerWidthClassName(size: ContainerSize) {
  switch (size) {
    case "sm":
      return containerWidths.sm;
    case "md":
      return containerWidths.md;
    case "lg":
      return containerWidths.lg;
    case "xl":
      return containerWidths.xl;
    case "2xl":
      return containerWidths["2xl"];
    case "full":
      return containerWidths.full;
  }
}

export function Container({ className, size = "xl", ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-6 lg:px-8",
        getContainerWidthClassName(size),
        className,
      )}
      {...props}
    />
  );
}
