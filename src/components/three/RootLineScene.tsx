"use client";

import { ScrollControls, useScroll } from "@react-three/drei/web/ScrollControls";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type RootLineSceneProps = {
  className?: string | undefined;
  onProgressChange?: ((progress: number) => void) | undefined;
};

function clampProgress(value: number) {
  return Math.min(1, Math.max(0, value));
}

function RootTube({ onProgressChange }: Pick<RootLineSceneProps, "onProgressChange">) {
  const meshRef = useRef<THREE.Mesh>(null);
  const scroll = useScroll();
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.3, -1.8, 0),
      new THREE.Vector3(-1.55, -1.08, 0.08),
      new THREE.Vector3(-1.02, -0.32, -0.05),
      new THREE.Vector3(-0.28, 0.02, 0.06),
      new THREE.Vector3(0.22, 0.62, -0.03),
      new THREE.Vector3(0.98, 1.12, 0.07),
      new THREE.Vector3(2.08, 1.78, 0),
    ]);

    return new THREE.TubeGeometry(curve, 144, 0.022, 10, false);
  }, []);

  useFrame(() => {
    const progress = clampProgress(scroll.offset);
    const position = geometry.getAttribute("position");
    const indexCount = geometry.index?.count ?? position.count;
    geometry.setDrawRange(0, Math.floor(indexCount * progress));
    meshRef.current?.rotation.set(0.08, -0.22, 0.03);
    onProgressChange?.(progress);
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        color="#C9A24B"
        emissive="#4B3514"
        emissiveIntensity={0.38}
        metalness={0.62}
        roughness={0.34}
      />
    </mesh>
  );
}

export function RootLineScene({ className, onProgressChange }: RootLineSceneProps) {
  return (
    <div className={className} data-root-line="webgl">
      <Canvas
        camera={{ fov: 38, position: [0, 0, 6.5] }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.45} />
        <directionalLight color="#F7E2A0" intensity={1.8} position={[3, 4, 5]} />
        <ScrollControls damping={0.18} pages={1.4}>
          <RootTube onProgressChange={onProgressChange} />
        </ScrollControls>
      </Canvas>
    </div>
  );
}
