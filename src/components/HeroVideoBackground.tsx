"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type HeroVideoBackgroundProps = {
  desktopVideoSrc?: string;
  fallbackAlt: string;
  fallbackSrc: string;
  mobileVideoSrc?: string;
  posterSrc: string;
  textureAlt: string;
  textureSrc: string;
};

function useMediaQuery(query: string, initialValue: boolean) {
  const [matches, setMatches] = useState(initialValue);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}

function useReducedMotionPreference() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  return prefersReducedMotion;
}

export function HeroVideoBackground({
  desktopVideoSrc,
  fallbackAlt,
  fallbackSrc,
  mobileVideoSrc,
  posterSrc,
  textureAlt,
  textureSrc,
}: HeroVideoBackgroundProps) {
  const prefersReducedMotion = useReducedMotionPreference();
  const isDesktop = useMediaQuery("(min-width: 1024px)", false);
  const [videoFailed, setVideoFailed] = useState(false);
  const canRenderVideo =
    !prefersReducedMotion && !videoFailed && (desktopVideoSrc || mobileVideoSrc);

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-[#0B0B0B]">
      {canRenderVideo && desktopVideoSrc ? (
        <video
          autoPlay
          className="absolute inset-0 hidden h-full w-full object-cover md:block"
          loop
          muted
          playsInline
          poster={posterSrc}
          preload="metadata"
          onError={() => setVideoFailed(true)}
        >
          <source src={desktopVideoSrc} type="video/webm" />
        </video>
      ) : null}

      {canRenderVideo && mobileVideoSrc ? (
        <video
          autoPlay
          className="absolute inset-0 h-full w-full object-cover md:hidden"
          loop
          muted
          playsInline
          poster={posterSrc}
          preload="metadata"
          onError={() => setVideoFailed(true)}
        >
          <source src={mobileVideoSrc} type="video/mp4" />
        </video>
      ) : null}

      <div className="absolute inset-0">
        <Image
          alt={fallbackAlt}
          className="object-cover"
          fill
          priority
          sizes="100vw"
          src={fallbackSrc}
        />
      </div>

      {isDesktop ? (
        <div className="absolute inset-y-0 right-0 w-[46%] overflow-hidden">
          <Image
            alt={textureAlt}
            className="object-cover opacity-72"
            fill
            loading="lazy"
            sizes="46vw"
            src={textureSrc}
          />
        </div>
      ) : null}
    </div>
  );
}
