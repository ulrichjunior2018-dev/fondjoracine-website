"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";

const SPRING = { stiffness: 200, damping: 15 };
const REACH = 100; // px from button center that activates the magnet
const PULL = 0.25; // 25% toward cursor

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
};

export function MagneticButton({ children, className }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawScale = useMotionValue(1);

  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);
  const scale = useSpring(rawScale, SPRING);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < REACH) {
      rawX.set(dx * PULL);
      rawY.set(dy * PULL);
      rawScale.set(1.05);
    } else {
      rawX.set(0);
      rawY.set(0);
      rawScale.set(1);
    }
  }

  function onMouseLeave() {
    rawX.set(0);
    rawY.set(0);
    rawScale.set(1);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y, scale, display: "inline-flex" }}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
    >
      {children}
    </motion.div>
  );
}
