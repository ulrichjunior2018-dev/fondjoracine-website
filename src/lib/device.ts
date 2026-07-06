"use client";

type NavigatorConnection = {
  effectiveType?: string;
  saveData?: boolean;
};

type NavigatorWithConnection = Navigator & {
  connection?: NavigatorConnection;
  mozConnection?: NavigatorConnection;
  webkitConnection?: NavigatorConnection;
};

const slowConnectionTypes = new Set(["slow-2g", "2g", "3g"]);

export function shouldRenderWebGL() {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (motionQuery.matches) {
    return false;
  }

  if (window.matchMedia("(max-width: 767px)").matches) {
    return false;
  }

  const nav = navigator as NavigatorWithConnection;
  const connection = nav.connection ?? nav.mozConnection ?? nav.webkitConnection;

  if (connection?.saveData) {
    return false;
  }

  if (connection?.effectiveType && slowConnectionTypes.has(connection.effectiveType)) {
    return false;
  }

  return true;
}
