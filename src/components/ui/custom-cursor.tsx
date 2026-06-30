"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";

type CursorState = "default" | "hover" | "rotate";

const SPRING = { stiffness: 300, damping: 30 };

function getPointerSnapshot() {
  return window.matchMedia("(pointer: coarse)").matches;
}

function getServerPointerSnapshot() {
  return true;
}

function subscribePointerChange(callback: () => void) {
  const query = window.matchMedia("(pointer: coarse)");
  query.addEventListener("change", callback);

  return () => query.removeEventListener("change", callback);
}

export function CustomCursor() {
  const isTouch = useSyncExternalStore(
    subscribePointerChange,
    getPointerSnapshot,
    getServerPointerSnapshot,
  );
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState<CursorState>("default");
  const [label, setLabel] = useState<string | null>(null);

  // Raw mouse position (no spring)
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  // Spring-lagged position for both layers
  const springX = useSpring(rawX, SPRING);
  const springY = useSpring(rawY, SPRING);

  // Offset positions — dot centered on 8px, ring centered on 48px
  const dotX = useTransform(springX, (v) => v - 4);
  const dotY = useTransform(springY, (v) => v - 4);
  const ringX = useTransform(springX, (v) => v - 24);
  const ringY = useTransform(springY, (v) => v - 24);

  useEffect(() => {
    // Detect touch/coarse pointer and bail immediately
    if (isTouch) return;

    // Hide default cursor
    document.body.style.cursor = "none";

    function onMove(e: MouseEvent) {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!visible) setVisible(true);
    }

    function onLeave() {
      setVisible(false);
    }

    function onEnter() {
      setVisible(true);
    }

    // Detect interactive elements via event delegation
    function onOver(e: MouseEvent) {
      const target = e.target as Element;
      const el = target.closest(
        "[data-cursor], a, button, [role='button'], label, select, input, textarea",
      );

      if (!el) {
        setState("default");
        setLabel(null);
        return;
      }

      const cursorAttr = el.getAttribute("data-cursor");
      const labelAttr = el.getAttribute("data-cursor-label");

      if (cursorAttr === "rotate") {
        setState("rotate");
      } else {
        setState("hover");
      }

      setLabel(labelAttr ?? null);
    }

    function onOut(e: MouseEvent) {
      const related = e.relatedTarget as Element | null;
      if (
        !related?.closest(
          "[data-cursor], a, button, [role='button'], label, select, input, textarea",
        )
      ) {
        setState("default");
        setLabel(null);
      }
    }

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, [isTouch, rawX, rawY, visible]);

  // Skip entirely on touch devices or during SSR check
  if (isTouch) return null;

  const isExpanded = state !== "default";

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999]">
      {/* Gold dot — visible in default state */}
      <motion.div
        animate={{
          opacity: isExpanded ? 0 : visible ? 1 : 0,
          scale: isExpanded ? 0.2 : 1,
        }}
        className="absolute left-0 top-0 rounded-full bg-[#c8a951]"
        style={{ width: 8, height: 8, x: dotX, y: dotY }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      />

      {/* Expanded ring — visible on hover / rotate */}
      <motion.div
        animate={{
          opacity: isExpanded && visible ? 1 : 0,
          scale: isExpanded ? 1 : 0.4,
        }}
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-[#c8a951] bg-[#c8a951]/6"
        style={{ width: 48, height: 48, x: ringX, y: ringY }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {state === "rotate" ? (
          <RotateCcw className="h-4 w-4 text-[#c8a951]" strokeWidth={1.5} />
        ) : label ? (
          <span className="text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-[#c8a951]">
            {label}
          </span>
        ) : null}
      </motion.div>
    </div>
  );
}
