"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { RootLineFallback } from "@/components/three/RootLineFallback";
import { useRootLineProgress } from "@/components/three/use-root-line-progress";
import { shouldRenderWebGL } from "@/lib/device";

const RootLineScene = dynamic(
  () => import("@/components/three/RootLineScene").then((mod) => mod.RootLineScene),
  {
    loading: () => <RootLineFallback />,
    ssr: false,
  },
);

type SceneGateProps = {
  className?: string | undefined;
  onProgressChange?: ((progress: number) => void) | undefined;
};

export function SceneGate({ className, onProgressChange }: SceneGateProps) {
  const fallbackProgress = useRootLineProgress();
  const [canRenderWebGL, setCanRenderWebGL] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setCanRenderWebGL(shouldRenderWebGL());
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (!canRenderWebGL) {
    return (
      <RootLineFallback
        className={className}
        onProgressChange={onProgressChange}
        progress={fallbackProgress}
      />
    );
  }

  return <RootLineScene className={className} onProgressChange={onProgressChange} />;
}
