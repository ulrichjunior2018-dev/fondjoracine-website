"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

/**
 * Thin gold progress bar during client navigations so route changes feel intentional
 * instead of instantaneous.
 */
function NavigationProgressInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const routeKey = `${pathname}?${searchParams.toString()}`;
  const previousRoute = useRef(routeKey);

  useEffect(() => {
    function clearTimers() {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (tickTimer.current) clearInterval(tickTimer.current);
      hideTimer.current = null;
      tickTimer.current = null;
    }

    function start() {
      clearTimers();
      setVisible(true);
      setProgress(12);
      tickTimer.current = setInterval(() => {
        setProgress((current) => {
          if (current >= 88) return current;
          return current + Math.max(1, (90 - current) * 0.08);
        });
      }, 120);
    }

    function finish() {
      clearTimers();
      setProgress(100);
      hideTimer.current = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 280);
    }

    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!anchor) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;
        if (url.pathname === window.location.pathname && url.search === window.location.search) {
          return;
        }
      } catch {
        return;
      }

      start();
    }

    document.addEventListener("click", onClick, true);

    if (previousRoute.current !== routeKey) {
      previousRoute.current = routeKey;
      finish();
    }

    return () => {
      document.removeEventListener("click", onClick, true);
      clearTimers();
    };
  }, [routeKey]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[2px] bg-transparent"
    >
      <div
        className="h-full bg-[#B8935A] shadow-[0_0_12px_rgba(184,147,90,0.55)] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressInner />
    </Suspense>
  );
}
