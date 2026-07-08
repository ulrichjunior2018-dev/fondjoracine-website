"use client";

import { useEffect } from "react";

import {
  BRANCH_INGREDIENTS,
  BRANCH_LO,
  getBranchPhase,
  getNodePhase,
  useRootLineProgress,
} from "@/components/three/use-root-line-progress";
import { cn } from "@/lib/utils/cn";

type RootLineFallbackProps = {
  className?: string | undefined;
  onProgressChange?: ((progress: number) => void) | undefined;
  progress?: number | undefined;
};

const pathLength = 1;

// Root of all branches — point on main spine at ~47% path length
const RX = 252;
const RY = 308;

// 11 node positions in 640×640 viewBox — arc fanning right of path direction
const NODES: [number, number][] = [
  [315, 262], // Menthe
  [325, 281], // Moringa
  [330, 303], // Graine noire
  [328, 324], // Laurier
  [321, 345], // Ricin
  [308, 362], // Coco
  [291, 375], // Olive
  [271, 384], // Amande douce
  [249, 386], // Avocat
  [228, 382], // Argan
  [208, 373], // Jojoba
];

export function RootLineFallback({
  className,
  onProgressChange,
  progress: controlledProgress,
}: RootLineFallbackProps) {
  const windowProgress = useRootLineProgress();
  const progress = controlledProgress ?? windowProgress;
  const dashOffset = pathLength - progress;
  const phase = getBranchPhase(progress);

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
      {/* Dark spine underlay */}
      <path
        d="M79 545 C 138 476, 120 382, 199 330 C 254 294, 306 318, 336 251 C 365 188, 415 139, 548 92"
        pathLength={pathLength}
        stroke="#2C3A22"
        strokeLinecap="round"
        strokeWidth="8"
      />
      {/* Gold spine reveal */}
      <path
        d="M79 545 C 138 476, 120 382, 199 330 C 254 294, 306 318, 336 251 C 365 188, 415 139, 548 92"
        pathLength={pathLength}
        stroke="#B8935A"
        strokeDasharray={pathLength}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        strokeWidth="8"
        style={{ transition: "stroke-dashoffset 120ms linear" }}
      />

      {/* Branch nodes — visible only during 40–55% scroll window */}
      {phase > 0 &&
        NODES.map(([nx, ny], i) => {
          const name = BRANCH_INGREDIENTS[i];
          const nodeOpacity = getNodePhase(progress, phase, i);
          if (nodeOpacity <= 0) return null;
          const isRight = nx >= RX;
          const dx = nx - RX;
          const dy = ny - RY;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const lx = nx + (dx / len) * 10;
          const ly = ny + (dy / len) * 2;

          return (
            <g key={name} style={{ opacity: nodeOpacity, transition: "opacity 80ms linear" }}>
              <line
                stroke="#B8935A"
                strokeLinecap="round"
                strokeOpacity={0.45}
                strokeWidth="1.5"
                x1={RX}
                x2={nx}
                y1={RY}
                y2={ny}
              />
              <circle cx={nx} cy={ny} fill="#B8935A" r={3.5} />
              <text
                dominantBaseline="middle"
                fill="#F5F0E6"
                fontFamily="var(--fr-font-display, Georgia, serif)"
                fontSize="10.5"
                fontStyle="italic"
                textAnchor={isRight ? "start" : "end"}
                x={lx}
                y={ly}
              >
                {name}
              </text>
            </g>
          );
        })}

      {/* Branch root dot — visible during trigger window */}
      {phase > 0 && (
        <circle
          cx={RX}
          cy={RY}
          fill="#B8935A"
          r={4}
          style={{ opacity: phase, transition: "opacity 120ms linear" }}
        />
      )}
    </svg>
  );
}

export { BRANCH_LO };
