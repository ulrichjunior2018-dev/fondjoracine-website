"use client";

import { Html, ScrollControls, useScroll } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import {
  BRANCH_INGREDIENTS,
  BRANCH_LO,
  BRANCH_HI,
  getBranchPhase,
  getNodePhase,
} from "@/components/three/use-root-line-progress";

type RootLineSceneProps = {
  className?: string | undefined;
  onProgressChange?: ((progress: number) => void) | undefined;
};

function clampProgress(value: number) {
  return Math.min(1, Math.max(0, value));
}

// Branch root on the tube curve at ~47% progress
const ROOT_3D: [number, number, number] = [-0.39, -0.01, 0];

// 11 branch endpoints — semicircle in world space, R≈0.55
const NODES_3D: [number, number, number][] = [
  [-0.94, -0.01, 0.18], // Menthe
  [-0.91, 0.16, 0.12], // Moringa
  [-0.84, 0.31, 0.15], // Graine noire
  [-0.71, 0.44, 0.1], // Laurier
  [-0.56, 0.51, 0.18], // Ricin
  [-0.39, 0.54, 0.12], // Coco
  [-0.22, 0.51, 0.18], // Olive
  [-0.07, 0.44, 0.1], // Amande douce
  [0.06, 0.31, 0.15], // Avocat
  [0.13, 0.16, 0.12], // Argan
  [0.16, -0.01, 0.18], // Jojoba
];

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
        color="#B8935A"
        emissive="#3A2816"
        emissiveIntensity={0.38}
        metalness={0.62}
        roughness={0.34}
      />
    </mesh>
  );
}

function BranchNodes() {
  const scroll = useScroll();

  const { pointsGeo, linesGeo } = useMemo(() => {
    const pts = new Float32Array(NODES_3D.flat());
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pts, 3));

    const lineVerts = new Float32Array(NODES_3D.flatMap(([x, y, z]) => [...ROOT_3D, x, y, z]));
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute("position", new THREE.BufferAttribute(lineVerts, 3));

    return { pointsGeo: pGeo, linesGeo: lGeo };
  }, []);

  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const rootDotRef = useRef<THREE.Mesh>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>(Array(11).fill(null));
  const progressRef = useRef(0);

  useFrame(() => {
    const progress = clampProgress(scroll.offset);
    progressRef.current = progress;
    const phase = getBranchPhase(progress);
    const visible = phase > 0.01;

    if (pointsRef.current) {
      pointsRef.current.visible = visible;
      (pointsRef.current.material as THREE.PointsMaterial).opacity = phase;
    }
    if (linesRef.current) {
      linesRef.current.visible = visible;
      (linesRef.current.material as THREE.LineBasicMaterial).opacity = phase * 0.45;
    }
    if (rootDotRef.current) {
      rootDotRef.current.visible = visible;
      (rootDotRef.current.material as THREE.MeshBasicMaterial).opacity = phase;
    }
    labelRefs.current.forEach((el, i) => {
      if (!el) return;
      const nodeOpacity = visible ? getNodePhase(progress, phase, i) : 0;
      el.style.opacity = String(nodeOpacity);
    });
  });

  return (
    <>
      {/* Branch lines */}
      <lineSegments ref={linesRef} geometry={linesGeo} visible={false}>
        <lineBasicMaterial color="#B8935A" opacity={0} transparent />
      </lineSegments>

      {/* Node dots */}
      <points ref={pointsRef} geometry={pointsGeo} visible={false}>
        <pointsMaterial color="#B8935A" opacity={0} size={0.055} sizeAttenuation transparent />
      </points>

      {/* Branch root dot */}
      <mesh position={ROOT_3D} ref={rootDotRef} visible={false}>
        <sphereGeometry args={[0.028, 6, 6]} />
        <meshBasicMaterial color="#B8935A" opacity={0} transparent />
      </mesh>

      {/* Labels */}
      {NODES_3D.map(([x, y, z], i) => {
        const name = (BRANCH_INGREDIENTS as readonly string[])[i] ?? "";
        return (
          <Html
            center
            key={i}
            position={[x + (x > ROOT_3D[0] ? 0.08 : -0.08), y, z]}
            style={{ pointerEvents: "none" }}
            zIndexRange={[0, 0]}
          >
            <span
              ref={(el) => {
                labelRefs.current[i] = el;
              }}
              style={{
                color: "#F5F0E6",
                fontFamily: "var(--fr-font-display, Georgia, serif)",
                fontStyle: "italic",
                fontSize: "9px",
                letterSpacing: "0.04em",
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
                whiteSpace: "nowrap",
              }}
            >
              {name}
            </span>
          </Html>
        );
      })}
    </>
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
          <BranchNodes />
        </ScrollControls>
      </Canvas>
    </div>
  );
}

export { BRANCH_LO, BRANCH_HI };
