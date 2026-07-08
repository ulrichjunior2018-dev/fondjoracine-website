"use client";

import { useCopy } from "@/lib/i18n-context";

export function TextureGrid() {
  const copy = useCopy().home;

  return (
    <section
      aria-label={copy.textureTitle}
      className="border-y border-[#B8935A]/14 bg-[#0B0B0B] px-5 py-10 text-center text-[#F5EFE3]"
      id="textures"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#B8935A]">
        {copy.textureTitle}
      </p>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#F5EFE3]/62">
        {copy.textureText}
      </p>
    </section>
  );
}
