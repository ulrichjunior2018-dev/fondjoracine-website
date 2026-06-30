import type { HTMLAttributes } from "react";

import { grid } from "@/lib/design-system/tokens";
import { cn } from "@/lib/utils/cn";

type GridPreset = keyof typeof grid;

type GridProps = HTMLAttributes<HTMLDivElement> & {
  preset?: GridPreset;
};

function getGridPresetClassName(preset: GridPreset) {
  switch (preset) {
    case "dashboard":
      return grid.dashboard;
    case "product":
      return grid.product;
    case "editorial":
      return grid.editorial;
  }
}

export function Grid({ className, preset = "editorial", ...props }: GridProps) {
  return <div className={cn(getGridPresetClassName(preset), className)} {...props} />;
}
