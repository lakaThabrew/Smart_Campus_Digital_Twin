"use client";

import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { Zone, CAMPUS_LAYOUT, STATUS_COLORS } from "@/types/campus";

type CampusTwinSceneProps = {
  zones: Zone[];
  selectedZoneId: string;
  onSelect: (id: string) => void;
};

export default function CampusTwinScene({
  zones,
  selectedZoneId,
  onSelect,
}: CampusTwinSceneProps) {
  return (
    <Canvas camera={{ position: [10, 8, 12], fov: 55 }} shadows>
      <color attach="background" args={["#071952"]} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[8, 14, 6]} intensity={1.1} castShadow />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        position={[0, -0.01, 0]}
      >
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#071952" roughness={0.9} />
      </mesh>

      <gridHelper args={[24, 24, "#35A29F", "#0B666A"]} position={[0, 0, 0]} />

      {CAMPUS_LAYOUT.map((layout) => {
        const zone = zones.find((z) => z.id === layout.id);
        if (!zone) {
          return null;
        }

        const selected = zone.id === selectedZoneId;
        const height = 1 + zone.occupancy / 28;

        return (
          <group key={zone.id} position={layout.position}>
            <mesh
              castShadow
              receiveShadow
              position={[0, height / 2, 0]}
              onClick={(event) => {
                event.stopPropagation();
                onSelect(zone.id);
              }}
            >
              <boxGeometry args={[2.2, height, 2.2]} />
              <meshStandardMaterial
                color={selected ? "#ffffff" : "#0B666A"}
                emissive={STATUS_COLORS[zone.status]}
                emissiveIntensity={selected ? 0.6 : 0.2}
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>

            <mesh position={[0, height + 0.55, 0]}>
              <sphereGeometry args={[0.25, 24, 24]} />
              <meshStandardMaterial color={STATUS_COLORS[zone.status]} />
            </mesh>

            <Html center position={[0, height + 1.5, 0]}>
              <div className="rounded bg-black/80 px-3 py-1 text-xs font-semibold text-white whitespace-nowrap border border-[#35A29F] shadow-[0_0_10px_#0B666A]">
                {zone.name}
              </div>
            </Html>
          </group>
        );
      })}

      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={8}
        maxDistance={24}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}
