"use client";

/* eslint-disable react-hooks/immutability */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  CylinderGeometry,
  Group,
  MeshStandardMaterial,
  PlaneGeometry,
  Points,
  PointsMaterial,
  SphereGeometry,
  TubeGeometry,
  Vector3,
} from "three";

type MaisonFondjoWebGLSceneProps = {
  isMobile: boolean;
  progress: number;
  running: boolean;
};

type SceneProps = {
  isMobile: boolean;
  progress: number;
};

const soilMaterial = new MeshStandardMaterial({
  color: "#100d09",
  metalness: 0.04,
  roughness: 0.96,
});

const vineMaterial = new MeshStandardMaterial({
  color: "#1f6a32",
  emissive: "#08170d",
  metalness: 0.08,
  roughness: 0.62,
});

const leafMaterial = new MeshStandardMaterial({
  color: "#2f7d3a",
  emissive: "#071209",
  metalness: 0.03,
  roughness: 0.72,
  transparent: true,
});

const goldMaterial = new MeshStandardMaterial({
  color: "#B8935A",
  emissive: "#251a05",
  metalness: 0.64,
  roughness: 0.26,
});

const glassMaterial = new MeshStandardMaterial({
  color: "#20120a",
  emissive: "#140804",
  metalness: 0.18,
  roughness: 0.34,
  transparent: true,
  opacity: 0.82,
});

const labelMaterial = new MeshStandardMaterial({
  color: "#f5f0e6",
  metalness: 0.05,
  roughness: 0.42,
});

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function easeOut(value: number) {
  return 1 - Math.pow(1 - clamp(value), 3);
}

function seededRandom(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function SceneCamera({ isMobile, progress }: SceneProps) {
  const { camera } = useThree();

  useFrame(() => {
    const settled = easeOut(progress);
    camera.position.x = isMobile ? 0 : -0.65 + settled * 0.55;
    camera.position.y = isMobile ? 1.3 + settled * 0.28 : 0.72 + settled * 0.7;
    camera.position.z = isMobile ? 5.1 - settled * 0.52 : 4.55 - settled * 0.82;
    camera.lookAt(0, 1.15 + settled * 0.36, 0);
  });

  return null;
}

function VolcanicSoil() {
  const geometry = useMemo(() => new PlaneGeometry(9, 7, 22, 18), []);

  return (
    <mesh
      geometry={geometry}
      material={soilMaterial}
      position={[0, -0.7, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    />
  );
}

function DustField({ isMobile, progress }: SceneProps) {
  const pointsRef = useRef<Points>(null);
  const { geometry, material } = useMemo(() => {
    const count = isMobile ? 46 : 96;
    const positions = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      positions[index * 3] = (seededRandom(index + 11) - 0.5) * 6.8;
      positions[index * 3 + 1] = seededRandom(index + 37) * 3.4 - 0.45;
      positions[index * 3 + 2] = (seededRandom(index + 83) - 0.5) * 3.8;
    }

    const fieldGeometry = new BufferGeometry();
    fieldGeometry.setAttribute("position", new BufferAttribute(positions, 3));

    return {
      geometry: fieldGeometry,
      material: new PointsMaterial({
        color: "#d8b75b",
        opacity: isMobile ? 0.16 : 0.22,
        size: isMobile ? 0.014 : 0.018,
        transparent: true,
      }),
    };
  }, [isMobile]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = clock.elapsedTime * 0.018;
    pointsRef.current.position.y = Math.sin(clock.elapsedTime * 0.34) * 0.035 + progress * 0.16;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

function RootVine({ isMobile, progress }: SceneProps) {
  const path = useMemo(
    () =>
      new CatmullRomCurve3([
        new Vector3(-0.55, -0.64, 0),
        new Vector3(-0.48, -0.12, 0.04),
        new Vector3(-0.24, 0.34, -0.02),
        new Vector3(0.08, 0.82, 0.05),
        new Vector3(0.2, 1.31, -0.02),
        new Vector3(0.04, 1.76, 0.06),
        new Vector3(0.18, 2.08, 0.02),
      ]),
    [],
  );

  const geometry = useMemo(() => {
    const visible = Math.max(2, Math.round(8 + easeOut(progress) * (isMobile ? 34 : 52)));
    const points = path.getPoints(isMobile ? 42 : 66).slice(0, visible);
    return new TubeGeometry(
      new CatmullRomCurve3(points),
      points.length * 2,
      isMobile ? 0.018 : 0.024,
      8,
      false,
    );
  }, [isMobile, path, progress]);

  return <mesh geometry={geometry} material={vineMaterial} />;
}

function LeafCluster({
  index,
  position,
  progress,
  rotation = 0,
}: {
  index: number;
  position: [number, number, number];
  progress: number;
  rotation?: number;
}) {
  const groupRef = useRef<Group>(null);
  const leafGeometry = useMemo(() => new SphereGeometry(0.09, 12, 6), []);
  const revealed = easeOut((progress - (0.2 + index * 0.13)) / 0.24);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.scale.setScalar(0.2 + revealed * 0.86);
    groupRef.current.rotation.z = rotation + Math.sin(clock.elapsedTime * 0.8 + index) * 0.035;
  });

  return (
    <group ref={groupRef} position={position} rotation={[0, 0, rotation]}>
      <mesh
        geometry={leafGeometry}
        material={leafMaterial}
        scale={[1.2, 0.34, 0.08]}
        position={[-0.09, 0.02, 0]}
      />
      <mesh
        geometry={leafGeometry}
        material={leafMaterial}
        scale={[1.0, 0.3, 0.08]}
        position={[0.1, 0.06, 0]}
      />
      <mesh
        geometry={leafGeometry}
        material={leafMaterial}
        scale={[0.82, 0.26, 0.08]}
        position={[0.0, 0.17, 0]}
      />
    </group>
  );
}

function Bottle({ isMobile, progress }: SceneProps) {
  const groupRef = useRef<Group>(null);
  const bodyGeometry = useMemo(() => new CylinderGeometry(0.34, 0.38, 1.42, 28, 1), []);
  const shoulderGeometry = useMemo(() => new SphereGeometry(0.34, 28, 10), []);
  const neckGeometry = useMemo(() => new CylinderGeometry(0.13, 0.15, 0.34, 20, 1), []);
  const capGeometry = useMemo(() => new CylinderGeometry(0.17, 0.17, 0.24, 20, 1), []);
  const labelGeometry = useMemo(() => new PlaneGeometry(0.48, 0.52), []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const reveal = easeOut((progress - 0.58) / 0.28);
    groupRef.current.visible = reveal > 0.01;
    groupRef.current.position.y =
      1.16 + reveal * 0.18 + Math.sin(clock.elapsedTime * 0.72) * (isMobile ? 0.014 : 0.026);
    groupRef.current.rotation.y = -0.28 + reveal * 0.26 + Math.sin(clock.elapsedTime * 0.28) * 0.12;
    groupRef.current.scale.setScalar((isMobile ? 0.78 : 0.94) * (0.72 + reveal * 0.28));
  });

  return (
    <group ref={groupRef} position={[isMobile ? 0 : 0.58, 1.22, 0.02]}>
      <mesh geometry={bodyGeometry} material={glassMaterial} />
      <mesh
        geometry={shoulderGeometry}
        material={glassMaterial}
        position={[0, 0.71, 0]}
        scale={[1, 0.28, 1]}
      />
      <mesh geometry={neckGeometry} material={glassMaterial} position={[0, 0.94, 0]} />
      <mesh geometry={capGeometry} material={goldMaterial} position={[0, 1.23, 0]} />
      <mesh geometry={labelGeometry} material={labelMaterial} position={[0, -0.08, 0.346]} />
    </group>
  );
}

function MaisonScene({ isMobile, progress }: SceneProps) {
  return (
    <>
      <SceneCamera isMobile={isMobile} progress={progress} />
      <ambientLight color="#f5f0e6" intensity={0.38} />
      <directionalLight color="#B8935A" intensity={2.35} position={[2.2, 3.4, 2.8]} />
      <pointLight color="#0e2a1c" intensity={3.2} position={[-2.4, 1.8, 1.4]} />
      <VolcanicSoil />
      <DustField isMobile={isMobile} progress={progress} />
      <RootVine isMobile={isMobile} progress={progress} />
      <LeafCluster index={0} position={[-0.32, 0.2, 0.06]} progress={progress} rotation={-0.6} />
      <LeafCluster index={1} position={[0.12, 0.9, 0.05]} progress={progress} rotation={0.52} />
      {!isMobile ? (
        <LeafCluster
          index={2}
          position={[-0.05, 1.42, 0.05]}
          progress={progress}
          rotation={-0.28}
        />
      ) : null}
      <Bottle isMobile={isMobile} progress={progress} />
    </>
  );
}

export function MaisonFondjoWebGLScene({
  isMobile,
  progress,
  running,
}: MaisonFondjoWebGLSceneProps) {
  return (
    <Canvas
      aria-hidden="true"
      camera={{ fov: isMobile ? 48 : 42, position: [0, 1.1, 4.7] }}
      className="h-full w-full"
      dpr={isMobile ? [1, 1.15] : [1, 1.35]}
      frameloop={running ? "always" : "demand"}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    >
      <MaisonScene isMobile={isMobile} progress={progress} />
    </Canvas>
  );
}
