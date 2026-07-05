"use client";

import { useCopy } from "@/lib/i18n-context";

export function HairTexturePanels() {
  return null;
}

export function RealPhotographyPendingSlot() {
  const { advisor } = useCopy();

  return <span className="sr-only">{advisor.texturePending.label}</span>;
}
