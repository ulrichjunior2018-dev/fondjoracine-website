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
        // Position via individual `translate` property — leaves `scale` free for CSS transition.
        dot.style.translate = `${x - 3.5}px ${y - 3.5}px`;
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
      const hovering = Boolean((e.target as Element).closest(INTERACTIVE));
      if (hovering === isHoverRef.current) return;
      isHoverRef.current = hovering;
      // Toggle scale via class — CSS transition eases the change independently of rAF position.
      dot!.classList.toggle("cursor-expanded", hovering);
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
        className="absolute left-0 top-0 size-[7px] rounded-full bg-[#B8935A] opacity-0 shadow-[0_0_14px_rgb(184_147_90/.28)]"
        ref={dotRef}
        style={{
          translate: "-100px -100px",
          scale: "1",
          transition: "opacity 150ms, scale 150ms cubic-bezier(0.23,1,0.32,1)",
          willChange: "translate",
        }}
      />
    </div>
  );
}
