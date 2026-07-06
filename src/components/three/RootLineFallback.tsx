"use client";

import { useEffect } from "react";

import { useRootLineProgress } from "@/components/three/use-root-line-progress";
import { cn } from "@/lib/utils/cn";

type RootLineFallbackProps = {
  className?: string | undefined;
  onProgressChange?: ((progress: number) => void) | undefined;
  progress?: number | undefined;
};

const pathLength = 1;

export function RootLineFallback({
  className,
  onProgressChange,
  progress: controlledProgress,
}: RootLineFallbackProps) {
  const windowProgress = useRootLineProgress();
  const progress = controlledProgress ?? windowProgress;
  const dashOffset = pathLength - progress;

  useEffect(() => {
    onProgressChange?.(progress);
  }, [onProgressChange, progress]);

  return (
    <svg
      aria-hidden="true"
      className={cn("h-full w-full overflow-visible", className)}
      data-root-line="fallback"
      fill="none"
      viewBox="0 0 640 640"
    >
      <path
        d="M79 545 C 138 476, 120 382, 199 330 C 254 294, 306 318, 336 251 C 365 188, 415 139, 548 92"
        pathLength={pathLength}
        stroke="#2C3A22"
        strokeLinecap="round"
        strokeWidth="8"
      />
      <path
        d="M79 545 C 138 476, 120 382, 199 330 C 254 294, 306 318, 336 251 C 365 188, 415 139, 548 92"
        pathLength={pathLength}
        stroke="#C9A24B"
        strokeDasharray={pathLength}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        strokeWidth="8"
        style={{ transition: "stroke-dashoffset 120ms linear" }}
      />
    </svg>
  );
}
