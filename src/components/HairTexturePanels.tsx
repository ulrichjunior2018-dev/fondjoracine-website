"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { siteImages } from "@/lib/site-images";

type TexturePanel = {
  alt: string;
  label: string;
  src: string;
};

const texturePanels: TexturePanel[] = [
  {
    alt: "Defined 4C coils with FONDJO RACINE SÈVE oil",
    label: "4C coils",
    src: siteImages.hairTextureLifestyle,
  },
  {
    alt: "Fine hair texture reference for FONDJO RACINE SÈVE",
    label: "Fine hair",
    src: siteImages.postpartumShedding,
  },
  {
    alt: "Dark hair scalp ritual with FONDJO RACINE SÈVE oil",
    label: "Straight dark hair",
    src: siteImages.backLabel,
  },
  {
    alt: "Rich curls with FONDJO RACINE SÈVE bottle",
    label: "Rich curls",
    src: siteImages.hairTextureLifestyle,
  },
  {
    alt: "Soft wave ritual mood with FONDJO RACINE SÈVE",
    label: "Waves",
    src: siteImages.nightRoutine,
  },
];
const fallbackTexturePanel = texturePanels[0] as TexturePanel;

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  return reducedMotion;
}

function useActiveTexture(length: number) {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion || length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % length);
    }, 5200);

    return () => window.clearInterval(interval);
  }, [length, reducedMotion]);

  return activeIndex;
}

function getTexturePanel(index: number): TexturePanel {
  const normalizedIndex =
    ((index % texturePanels.length) + texturePanels.length) % texturePanels.length;

  return texturePanels.at(normalizedIndex) ?? fallbackTexturePanel;
}

export function HairTexturePanels() {
  const activeIndex = useActiveTexture(texturePanels.length);
  const desktopPanels = useMemo(
    () => [0, 1, 2].map((offset) => getTexturePanel(activeIndex + offset)),
    [activeIndex],
  );
  const mobilePanel = getTexturePanel(activeIndex);

  return (
    <>
      <div
        aria-label="Animated hair texture examples"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-[31vw] max-w-[27rem] overflow-hidden border-l border-[#D4AF37]/12 bg-[#060706]/44 backdrop-blur-[1px] lg:block"
      >
        <div className="grid h-full grid-cols-3 gap-px">
          {desktopPanels.map((panel, index) => (
            <figure
              className="group relative h-full overflow-hidden"
              key={`${panel.label}-${index}`}
            >
              <Image
                alt={panel.alt}
                className="object-cover opacity-78 transition duration-[1800ms] ease-out motion-safe:group-hover:scale-[1.035]"
                fill
                loading="lazy"
                sizes="11vw"
                src={panel.src}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(13_13_13/.18),rgb(13_13_13/.54))]" />
              <figcaption className="absolute bottom-7 left-1/2 w-max max-w-[9rem] -translate-x-1/2 -rotate-90 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#F7F4EB]/72">
                {panel.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <figure className="relative mx-auto mt-7 aspect-[16/10] w-full max-w-[22rem] overflow-hidden rounded-sm border border-[#D4AF37]/16 bg-[#0D0D0D] shadow-[0_24px_90px_rgb(0_0_0/.35)] lg:hidden">
        <Image
          alt={mobilePanel.alt}
          className="object-cover opacity-86 transition-opacity duration-700"
          fill
          loading="lazy"
          sizes="(max-width: 767px) 88vw, 22rem"
          src={mobilePanel.src}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgb(13_13_13/.76))]" />
        <figcaption className="absolute bottom-4 left-4 text-[0.64rem] font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
          {mobilePanel.label}
        </figcaption>
      </figure>
    </>
  );
}
