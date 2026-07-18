"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type MotionCardProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  className?: string | undefined;
  /** Slightly stronger lift on hover (cards / tiles). */
  lift?: boolean;
};

/**
 * Interactive surface: hover / press only — no scroll entrance (avoids jumpiness).
 * Prefer wrapping text/tiles — not `fill` image parents that need stable layout.
 */
export function MotionCard({ children, className, lift = true, ...props }: MotionCardProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      whileTap={{ scale: 0.985 }}
      {...(lift
        ? {
            whileHover: {
              y: -5,
              transition: { type: "spring", stiffness: 420, damping: 26 },
            },
          }
        : {})}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type MotionInViewProps = {
  children: ReactNode;
  className?: string | undefined;
  delay?: number;
};

/** Plain wrapper — scroll reveal disabled for smooth native scrolling. */
export function MotionInView({ children, className }: MotionInViewProps) {
  return <div className={className}>{children}</div>;
}

/** Gold ◆ marker with a gentle living pulse. */
export function MotionDiamond({ className }: { className?: string | undefined }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div aria-hidden="true" className={cn("text-lg text-[#B8935A]", className)}>
        ◆
      </div>
    );
  }

  return (
    <motion.div
      aria-hidden="true"
      className={cn("text-lg text-[#B8935A]", className)}
      animate={{
        opacity: [0.55, 1, 0.55],
        scale: [0.92, 1.08, 0.92],
      }}
      transition={{ duration: 2.8, ease: "easeInOut", repeat: Infinity }}
    >
      ◆
    </motion.div>
  );
}

type MotionButtonShellProps = {
  children: ReactNode;
  className?: string | undefined;
};

/** Adds press/hover spring without changing the inner link/button markup. */
export function MotionButtonShell({ children, className }: MotionButtonShellProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <span className={cn("inline-flex", className)}>{children}</span>;
  }

  return (
    <motion.span
      className={cn("inline-flex", className)}
      transition={{ type: "spring", stiffness: 480, damping: 28 }}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.span>
  );
}

type MotionStepProps = {
  children: ReactNode;
  className?: string | undefined;
  delay?: number;
};

/** Numbered ritual / process rows — hover nudge only. */
export function MotionStep({ children, className }: MotionStepProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
      whileHover={{ x: 4 }}
    >
      {children}
    </motion.div>
  );
}
