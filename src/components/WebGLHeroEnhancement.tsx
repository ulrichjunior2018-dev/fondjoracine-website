"use client";

import { Volume2, VolumeX } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";

const MaisonFondjoWebGLScene = dynamic(
  () =>
    import("@/components/MaisonFondjoWebGLScene").then((module) => module.MaisonFondjoWebGLScene),
  { ssr: false },
);

const SOUND_KEY = "fondjo-ambient-sound";

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function shouldUseFallback() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
  ).connection;
  const slowConnection = connection?.saveData || connection?.effectiveType === "2g";
  const lowCpuMobile =
    window.innerWidth < 768 &&
    typeof navigator.hardwareConcurrency === "number" &&
    navigator.hardwareConcurrency <= 4;

  return reducedMotion || slowConnection || lowCpuMobile || !supportsWebGL();
}

export function WebGLHeroEnhancement() {
  const [enabled] = useState(() => (typeof window === "undefined" ? false : !shouldUseFallback()));
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === "undefined" ? false : window.innerWidth < 768,
  );
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [soundOn, setSoundOn] = useState(() =>
    typeof window === "undefined" ? false : sessionStorage.getItem(SOUND_KEY) === "on",
  );
  const howlRef = useRef<{
    pause: () => void;
    play: () => void;
    stop: () => void;
    unload: () => void;
  } | null>(null);

  const running = enabled && isVisible;
  const canvasOpacity = useMemo(() => clamp((progress - 0.04) / 0.18), [progress]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const hero = document.getElementById("hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.02 },
    );

    observer.observe(hero);

    return () => {
      observer.disconnect();
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    let animationFrame = 0;

    const updateProgress = () => {
      const hero = document.getElementById("hero");
      if (!hero) return;

      const rect = hero.getBoundingClientRect();
      const scrollable = Math.max(1, rect.height - window.innerHeight);
      setProgress(clamp(Math.abs(Math.min(rect.top, 0)) / scrollable));
    };

    const requestUpdate = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [enabled]);

  useEffect(() => {
    if (!running && howlRef.current) {
      howlRef.current.pause();
    }
  }, [running]);

  useEffect(
    () => () => {
      howlRef.current?.unload();
    },
    [],
  );

  if (!enabled) return null;

  const toggleSound = async () => {
    if (!howlRef.current) {
      const { Howl } = await import("howler");
      howlRef.current = new Howl({
        loop: true,
        preload: true,
        src: ["/audio/fondjo-ambient.wav"],
        volume: 0.18,
      });
    }

    const howl = howlRef.current;
    if (!howl) return;

    if (soundOn) {
      howl.pause();
      sessionStorage.setItem(SOUND_KEY, "off");
      setSoundOn(false);
      return;
    }

    howl.play();
    sessionStorage.setItem(SOUND_KEY, "on");
    setSoundOn(true);
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: canvasOpacity }}
      >
        {isVisible ? (
          <MaisonFondjoWebGLScene isMobile={isMobile} progress={progress} running={running} />
        ) : null}
      </div>
      <button
        aria-label={soundOn ? "Turn ambient sound off" : "Turn ambient sound on"}
        className="pointer-events-auto absolute right-4 top-24 inline-flex size-10 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#0D0D0D]/52 text-[#D4AF37] shadow-[0_18px_60px_rgb(0_0_0/.35)] backdrop-blur-md transition-transform duration-100 ease-out hover:scale-105 active:scale-[0.98] md:right-8 md:top-28"
        onClick={toggleSound}
        type="button"
      >
        {soundOn ? (
          <Volume2 className="size-4" aria-hidden="true" />
        ) : (
          <VolumeX className="size-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
