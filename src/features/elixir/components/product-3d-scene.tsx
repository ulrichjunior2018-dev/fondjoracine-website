"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Product3DSceneProps = {
  fallbackImage?:
    | {
        alt: string;
        src: string;
      }
    | undefined;
  label: string;
};

type NetworkInformation = {
  effectiveType?: string;
  saveData?: boolean;
};

type NavigatorWithPerformanceHints = Navigator & {
  connection?: NetworkInformation;
  deviceMemory?: number;
};

type SceneMode = "loading" | "webgl" | "fallback";

const blurDataUrl =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTYnIGhlaWdodD0nMTYnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3QgZmlsbD0nIzA4MDcwNicgd2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PC9zdmc+";

const PARTICLES = [
  { delay: 0, duration: 9, left: "12%", scale: 0.78, top: "22%" },
  { delay: 1.4, duration: 10, left: "82%", scale: 0.92, top: "18%" },
  { delay: 2.2, duration: 8.5, left: "18%", scale: 0.65, top: "66%" },
  { delay: 0.8, duration: 11, left: "76%", scale: 0.72, top: "72%" },
  { delay: 3.1, duration: 10.5, left: "50%", scale: 0.58, top: "12%" },
  { delay: 1.9, duration: 9.7, left: "62%", scale: 0.82, top: "86%" },
];

function shouldUseLiteExperience(reducedMotion: boolean) {
  const nav = navigator as NavigatorWithPerformanceHints;
  const connection = nav.connection;
  const params = new URLSearchParams(window.location.search);
  const isMobileViewport = window.matchMedia("(max-width: 640px)").matches;
  const constrainedNetwork =
    connection?.saveData === true ||
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g" ||
    (connection?.effectiveType === "3g" && isMobileViewport);
  const constrainedDevice =
    isMobileViewport && ((nav.deviceMemory ?? 8) <= 4 || navigator.hardwareConcurrency <= 4);

  return reducedMotion || params.has("lite3d") || constrainedNetwork || constrainedDevice;
}

function hasWebGlSupport() {
  const testCanvas = document.createElement("canvas");

  return Boolean(testCanvas.getContext("webgl2") ?? testCanvas.getContext("webgl"));
}

function BotanicalParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.span
        animate={{ rotate: 360 }}
        className="absolute left-[9%] top-[16%] h-[64%] w-[86%] rounded-[100%] border border-[#f0dfb7]/28 shadow-[0_0_42px_rgb(184_134_11/.24)]"
        initial={false}
        transition={{ duration: 18, ease: "linear", repeat: Infinity }}
      />
      <motion.span
        animate={{ rotate: -360 }}
        className="absolute left-[18%] top-[28%] h-[38%] w-[66%] rounded-[100%] border border-[#b8860b]/32 shadow-[0_0_22px_rgb(240_223_183/.22)]"
        initial={false}
        transition={{ duration: 13, ease: "linear", repeat: Infinity }}
      />
      {PARTICLES.map((particle) => (
        <motion.span
          animate={{
            opacity: [0.16, 0.62, 0.18],
            rotate: [12, 42, 18],
            y: [-8, 18, -8],
          }}
          className="absolute h-8 w-3 rounded-[999px_999px_999px_0] border border-[#F0DFB7]/35 bg-[#FAF7F0]/12 shadow-[0_0_24px_rgb(184_134_11/.24)]"
          initial={false}
          key={`${particle.left}-${particle.top}`}
          style={{
            left: particle.left,
            scale: particle.scale,
            top: particle.top,
          }}
          transition={{
            delay: particle.delay,
            duration: particle.duration,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
}

function LayeredBottleFallback({ fallbackImage, label }: Product3DSceneProps) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center px-8"
      data-product-fallback="true"
    >
      {fallbackImage ? (
        <Image
          alt={fallbackImage.alt}
          blurDataURL={blurDataUrl}
          className="absolute inset-0 object-cover opacity-10 mix-blend-screen"
          fill
          placeholder="blur"
          priority
          sizes="(min-width: 1024px) 42vw, 100vw"
          src={fallbackImage.src}
        />
      ) : null}
      <motion.div
        animate={{
          rotate: [-2, 2, -2],
          y: [-8, 8, -8],
        }}
        className="relative h-[78%] min-h-80 w-[56%] min-w-44 max-w-72"
        initial={false}
        transition={{ duration: 6.5, ease: "easeInOut", repeat: Infinity }}
      >
        <div className="absolute left-1/2 top-0 h-[13%] w-[28%] -translate-x-1/2 rounded-t-md bg-[linear-gradient(90deg,#5b4208,#f0dfb7,#8e6610)] shadow-[0_0_34px_rgb(184_134_11/.42)]" />
        <div className="absolute left-1/2 top-[10%] h-[13%] w-[21%] -translate-x-1/2 rounded-t-full bg-[linear-gradient(90deg,#0f2415,#2e6b3e,#15351d)]" />
        <div className="absolute inset-x-0 bottom-[4%] top-[18%] overflow-hidden rounded-[48%_48%_34%_34%/12%_12%_8%_8%] border border-[#F0DFB7]/28 bg-[radial-gradient(circle_at_30%_16%,rgb(255_255_255/.34),transparent_18%),linear-gradient(96deg,#0b2010,#2e6b3e_45%,#102915_72%,#071009)] shadow-[32px_30px_70px_rgb(0_0_0/.34)]">
          <div className="absolute inset-y-0 left-[16%] w-[14%] bg-[linear-gradient(90deg,transparent,rgb(250_247_240/.22),transparent)] blur-sm" />
          <motion.div
            animate={{ x: ["-45%", "180%"] }}
            className="absolute inset-y-0 w-[18%] -skew-x-12 bg-[linear-gradient(90deg,transparent,rgb(240_223_183/.28),transparent)] blur-[1px]"
            initial={false}
            transition={{ duration: 4.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.5 }}
          />
          <div className="absolute left-1/2 top-[36%] w-[62%] -translate-x-1/2 rounded-md border border-[#B8860B]/48 bg-[#FAF7F0]/92 px-4 py-5 text-center shadow-[0_18px_40px_rgb(0_0_0/.18)]">
            <p className="text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-[#2E6B3E]">
              FONDJO
            </p>
            <p className="mt-3 text-sm font-semibold leading-5 text-[#1C1C1C]">{label}</p>
            <p className="mt-3 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#B8860B]">
              100ml
            </p>
          </div>
          <div className="absolute inset-x-[8%] bottom-[5%] h-1 rounded-full bg-[#B8860B]/60" />
        </div>
        <div className="absolute inset-x-[2%] bottom-0 h-10 rounded-full bg-black/36 blur-xl" />
      </motion.div>
    </div>
  );
}

export function Product3DScene({ fallbackImage, label }: Product3DSceneProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollProgressRef = useRef(0);
  const reducedMotion = useReducedMotion();
  const [isReady, setIsReady] = useState(false);
  const [mode, setMode] = useState<SceneMode>("loading");
  const { scrollYProgress } = useScroll({
    offset: ["start end", "end start"],
    target: stageRef,
  });
  const stageY = useTransform(scrollYProgress, [0, 1], [18, -20]);
  const stageRotate = useTransform(scrollYProgress, [0, 1], [1.2, -1.2]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    scrollProgressRef.current = latest;
  });

  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;

    async function renderScene() {
      const canvas = canvasRef.current;

      if (!canvas) {
        return;
      }

      if (shouldUseLiteExperience(Boolean(reducedMotion)) || !hasWebGlSupport()) {
        setMode("fallback");
        setIsReady(false);
        return;
      }

      const activeCanvas = canvas;

      try {
        const THREE = await import("three");

        if (cancelled) {
          return;
        }

        const isMobileViewport = window.matchMedia("(max-width: 640px)").matches;
        const radialSegments = isMobileViewport ? 40 : 56;
        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: !isMobileViewport,
          canvas: activeCanvas,
          powerPreference: "high-performance",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobileViewport ? 1.15 : 1.45));
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
        camera.position.set(0, 0.36, 7);

        const group = new THREE.Group();
        scene.add(group);

        const bottleMaterial = new THREE.MeshPhysicalMaterial({
          clearcoat: 0.9,
          clearcoatRoughness: 0.16,
          color: new THREE.Color("#14391f"),
          metalness: 0.08,
          roughness: 0.22,
          sheen: 0.22,
        });
        const goldMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#B8860B"),
          metalness: 0.78,
          roughness: 0.16,
        });
        const labelMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#FAF7F0"),
          metalness: 0.02,
          roughness: 0.42,
        });
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: "#F0DFB7",
          opacity: 0.16,
          transparent: true,
        });

        const body = new THREE.Mesh(
          new THREE.CylinderGeometry(0.86, 0.98, 3.9, radialSegments),
          bottleMaterial,
        );
        const shoulder = new THREE.Mesh(
          new THREE.SphereGeometry(0.86, radialSegments, 16, 0, Math.PI * 2, 0, Math.PI / 2),
          bottleMaterial,
        );
        const neck = new THREE.Mesh(
          new THREE.CylinderGeometry(0.32, 0.42, 0.72, radialSegments),
          bottleMaterial,
        );
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.58, 40), goldMaterial);
        const labelPlate = new THREE.Mesh(new THREE.BoxGeometry(1.25, 1.34, 0.035), labelMaterial);
        const baseRing = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.035, 12, 56), goldMaterial);
        const haloRing = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.012, 8, 96), glowMaterial);

        shoulder.position.y = 1.95;
        shoulder.scale.y = 0.46;
        neck.position.y = 2.35;
        cap.position.y = 2.96;
        labelPlate.position.set(0, -0.16, 0.986);
        baseRing.position.y = -1.96;
        baseRing.rotation.x = Math.PI / 2;
        haloRing.position.y = -2.1;
        haloRing.rotation.x = Math.PI / 2;

        group.add(body, shoulder, neck, cap, labelPlate, baseRing, haloRing);
        group.rotation.set(-0.03, -0.38, 0.04);

        const ambient = new THREE.HemisphereLight("#fff5df", "#1f4227", 1.9);
        const key = new THREE.DirectionalLight("#fff0c8", 5);
        const rim = new THREE.DirectionalLight("#b7f0c0", 1.55);
        const goldSweep = new THREE.PointLight("#F0DFB7", 4, 7);
        key.position.set(3.5, 5, 4);
        rim.position.set(-4, 2, -2);
        goldSweep.position.set(-1.2, 0.6, 3.2);
        scene.add(ambient, key, rim, goldSweep);

        const floorGeometry = new THREE.CircleGeometry(1.8, 72);
        const floorMaterial = new THREE.MeshBasicMaterial({
          color: "#B8860B",
          opacity: 0.12,
          transparent: true,
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.y = -2.25;
        floor.rotation.x = -Math.PI / 2;
        scene.add(floor);

        function resize() {
          const rect = activeCanvas.getBoundingClientRect();
          const width = Math.max(1, Math.floor(rect.width));
          const height = Math.max(1, Math.floor(rect.height));
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        }

        let frame = 0;
        function animate() {
          frame = window.requestAnimationFrame(animate);

          const elapsed = performance.now();
          const progress = scrollProgressRef.current;
          group.rotation.y += isMobileViewport ? 0.0028 : 0.004;
          group.rotation.z = 0.04 + (progress - 0.5) * 0.08;
          group.position.y = Math.sin(elapsed / 1300) * 0.045 + (progress - 0.5) * 0.12;
          goldSweep.position.x = Math.sin(elapsed / 1400) * 2.2;
          goldSweep.position.y = 0.6 + Math.cos(elapsed / 1800) * 0.45;
          haloRing.rotation.z += 0.0035;
          renderer.render(scene, camera);
        }

        resize();
        window.addEventListener("resize", resize);
        animate();
        setMode("webgl");
        setIsReady(true);

        cleanup = () => {
          window.cancelAnimationFrame(frame);
          window.removeEventListener("resize", resize);
          renderer.dispose();
          body.geometry.dispose();
          shoulder.geometry.dispose();
          neck.geometry.dispose();
          cap.geometry.dispose();
          labelPlate.geometry.dispose();
          baseRing.geometry.dispose();
          haloRing.geometry.dispose();
          floorGeometry.dispose();
          bottleMaterial.dispose();
          goldMaterial.dispose();
          labelMaterial.dispose();
          glowMaterial.dispose();
          floorMaterial.dispose();
        };
      } catch {
        setMode("fallback");
        setIsReady(false);
      }
    }

    const usesIdleCallback = "requestIdleCallback" in window;
    const idleId: number | ReturnType<typeof globalThis.setTimeout> = usesIdleCallback
      ? window.requestIdleCallback(() => void renderScene(), { timeout: 900 })
      : globalThis.setTimeout(() => void renderScene(), 220);

    return () => {
      cancelled = true;
      if (usesIdleCallback && "cancelIdleCallback" in window && typeof idleId === "number") {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
      cleanup();
    };
  }, [reducedMotion]);

  return (
    <motion.div
      className="relative aspect-[4/5] min-h-[26rem] overflow-hidden rounded-lg border border-border bg-[radial-gradient(circle_at_50%_25%,rgb(184_134_11/.28),transparent_34%),linear-gradient(150deg,#0f1b12,#2e6b3e_58%,#111611)] shadow-lifted"
      data-cursor="rotate"
      data-mode={mode}
      data-product-stage="true"
      ref={stageRef}
      style={{ rotateX: stageRotate, y: stageY }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_52%_18%,rgb(250_247_240/.22),transparent_23%),radial-gradient(circle_at_78%_42%,rgb(184_134_11/.22),transparent_28%),radial-gradient(circle_at_20%_70%,rgb(184_134_11/.18),transparent_31%)]" />
      <div className="pointer-events-none absolute inset-x-[17%] bottom-[8%] h-[12%] rounded-[100%] border border-[#f0dfb7]/45 bg-[#b8860b]/12 shadow-[0_0_52px_rgb(184_134_11/.38)]" />
      <BotanicalParticles />
      {mode !== "webgl" || !isReady ? (
        <LayeredBottleFallback fallbackImage={fallbackImage} label={label} />
      ) : null}
      <canvas
        ref={canvasRef}
        aria-label={label}
        className="absolute inset-0 h-full w-full transition-opacity duration-700"
        data-ready={isReady ? "true" : "false"}
      />
      <motion.div
        animate={{ x: ["-35%", "135%"] }}
        className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgb(240_223_183/.16),transparent)] blur-xl"
        initial={false}
        transition={{ duration: 5.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.2 }}
      />
      <div className="pointer-events-none absolute inset-x-6 bottom-6 flex items-center justify-between gap-3 rounded-full border border-[#f0dfb7]/26 bg-black/22 px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#FAF7F0] backdrop-blur">
        <span>FONDJO</span>
        <span className="inline-flex items-center gap-1 text-[0.64rem] text-[#f0dfb7]">
          360
          <span className="h-px w-8 bg-[#f0dfb7]/60" />
        </span>
      </div>
    </motion.div>
  );
}
