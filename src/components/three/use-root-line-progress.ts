"use client";

import { useEffect, useState } from "react";

type ProgressTarget = {
  current: HTMLElement | null;
};

function clampProgress(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function getRootLineScrollProgress(target?: HTMLElement | null) {
  if (typeof window === "undefined") {
    return 0;
  }

  if (!target) {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollable <= 0) {
      return 0;
    }

    return clampProgress(window.scrollY / scrollable);
  }

  const rect = target.getBoundingClientRect();
  const travel = rect.height + window.innerHeight;
  const passed = window.innerHeight - rect.top;

  return travel > 0 ? clampProgress(passed / travel) : 0;
}

export function useRootLineProgress(target?: ProgressTarget) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    function update() {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        setProgress(getRootLineScrollProgress(target?.current));
      });
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [target]);

  return progress;
}
