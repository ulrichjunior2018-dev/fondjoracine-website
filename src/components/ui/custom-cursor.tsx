"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type CursorState = "default" | "hover";

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
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState<CursorState>("default");

  useEffect(() => {
    if (isTouch) return;

    document.documentElement.classList.add("custom-cursor-active");

    function onMove(e: MouseEvent) {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX - 3.5}px, ${e.clientY - 3.5}px, 0) scale(${
          state === "hover" ? 1.7 : 1
        })`;
      }
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
        return;
      }

      setState("hover");
    }

    function onOut(e: MouseEvent) {
      const related = e.relatedTarget as Element | null;
      if (
        !related?.closest(
          "[data-cursor], a, button, [role='button'], label, select, input, textarea",
        )
      ) {
        setState("default");
      }
    }

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, [isTouch, state, visible]);

  if (isTouch) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999]">
      <div
        className="absolute left-0 top-0 size-[7px] rounded-full bg-[#B8935A] opacity-0 shadow-[0_0_14px_rgb(184_147_90/.28)] transition-[opacity,transform] duration-100 ease-out"
        ref={dotRef}
        style={{
          opacity: visible ? 1 : 0,
          transform: `translate3d(-100px, -100px, 0) scale(${state === "hover" ? 1.7 : 1})`,
        }}
      />
    </div>
  );
}
