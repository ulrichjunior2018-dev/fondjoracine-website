"use client";

import { useEffect } from "react";

const PRESSABLE_SELECTOR =
  "button, [role='button'], a[class*='inline-flex'], a[class*='rounded'], input[type='button'], input[type='submit'], input[type='reset']";

export function MicroInteractions() {
  useEffect(() => {
    let pressedElement: Element | null = null;
    let releaseTimer: number | null = null;

    function clearPressedElement() {
      if (releaseTimer) {
        window.clearTimeout(releaseTimer);
        releaseTimer = null;
      }

      pressedElement?.classList.remove("is-pressing");
      pressedElement = null;
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target instanceof Element ? event.target : null;
      const pressable = target?.closest(PRESSABLE_SELECTOR);

      if (!pressable || pressable.getAttribute("aria-disabled") === "true") {
        return;
      }

      if ("disabled" in pressable && pressable.disabled === true) {
        return;
      }

      clearPressedElement();
      pressedElement = pressable;
      pressedElement.classList.add("is-pressing");
    }

    function onPointerRelease() {
      if (!pressedElement) {
        return;
      }

      releaseTimer = window.setTimeout(clearPressedElement, 100);
    }

    document.addEventListener("pointerdown", onPointerDown, { capture: true, passive: true });
    document.addEventListener("pointerup", onPointerRelease, { capture: true, passive: true });
    document.addEventListener("pointercancel", clearPressedElement, { capture: true });
    window.addEventListener("blur", clearPressedElement);

    return () => {
      clearPressedElement();
      document.removeEventListener("pointerdown", onPointerDown, { capture: true });
      document.removeEventListener("pointerup", onPointerRelease, { capture: true });
      document.removeEventListener("pointercancel", clearPressedElement, { capture: true });
      window.removeEventListener("blur", clearPressedElement);
    };
  }, []);

  return null;
}
