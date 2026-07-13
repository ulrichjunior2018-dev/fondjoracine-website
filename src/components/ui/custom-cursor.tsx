"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

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

const INTERACTIVE = "[data-cursor], a, button, [role='button'], label, select, input, textarea";

export function CustomCursor() {
  const isTouch = useSyncExternalStore(
    subscribePointerChange,
    getPointerSnapshot,
    getServerPointerSnapshot,
  );
  const dotRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number>(0);
  const isHoverRef = useRef(false);

  useEffect(() => {
    if (isTouch) return;

    document.documentElement.classList.add("custom-cursor-active");
    const dot = dotRef.current;
    if (!dot) return;

    function onMove(e: MouseEvent) {
      cancelAnimationFrame(rafRef.current);
      const x = e.clientX;
      const y = e.clientY;
      rafRef.current = requestAnimationFrame(() => {
        if (!dot) return;
        const scale = isHoverRef.current ? 1.7 : 1;
        dot.style.transform = `translate3d(${x - 3.5}px,${y - 3.5}px,0) scale(${scale})`;
        dot.style.opacity = "1";
      });
    }

    function onLeave() {
      dot!.style.opacity = "0";
    }

    function onEnter() {
      dot!.style.opacity = "1";
    }

    function onOver(e: MouseEvent) {
      isHoverRef.current = Boolean((e.target as Element).closest(INTERACTIVE));
    }

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseover", onOver);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseover", onOver);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999]">
      <div
        className="absolute left-0 top-0 size-[7px] rounded-full bg-[#B8935A] opacity-0 shadow-[0_0_14px_rgb(184_147_90/.28)] transition-opacity duration-150"
        ref={dotRef}
        style={{ transform: "translate3d(-100px,-100px,0)", willChange: "transform" }}
      />
    </div>
  );
}
