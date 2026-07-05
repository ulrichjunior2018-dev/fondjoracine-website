"use client";

import { useCopy } from "@/lib/i18n-context";

export function TextureGrid() {
  const copy = useCopy().home;

  return (
    <section
      aria-label={copy.textureTitle}
      className="border-y border-[#d6b75b]/14 bg-[#080706] px-5 py-10 text-center text-[#f6f0e4]"
      id="textures"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d6b75b]">
        {copy.textureTitle}
      </p>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#f6f0e4]/62">
        {copy.textureText}
      </p>
    </section>
  );
}
