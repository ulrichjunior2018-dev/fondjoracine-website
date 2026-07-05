"use client";

import { useCopy } from "@/lib/i18n-context";

export function HairTexturePanels() {
  return null;
}

export function RealPhotographyPendingSlot() {
  const copy = useCopy();

  return <span className="sr-only">{copy.home.textureTitle}</span>;
}
