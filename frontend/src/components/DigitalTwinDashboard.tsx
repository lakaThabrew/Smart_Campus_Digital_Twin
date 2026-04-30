"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { Building2, Navigation, Eye } from "lucide-react";
import * as THREE from "three";

export type ZoneStatus = "normal" | "busy" | "critical";

export type Zone = {
  id: string;
  name: string;
  energyKw: number;
  occupancy: number;
  temperatureC: number;
  status: ZoneStatus;
};

export type ZoneLayout = {
  id: string;
  position: [number, number, number];
  size: [number, number, number];
  roofType: "flat" | "gabled" | "hip" | "shed";
  roofColor: string;
  wallColor: string;
  label: string;
};

export const STATUS_COLORS: Record<ZoneStatus, string> = {
  normal: "#35A29F",
  busy: "#F5A623",
  critical: "#E85D24",
};

export const STATUS_GLOW: Record<ZoneStatus, string> = {
  normal: "#97FEED",
  busy: "#FAC75A",
  critical: "#FF8B6E",
};

// ─── REVISED CAMPUS LAYOUT ────────────────────────────────────────────────────
// Road system uses a clear grid:
//   Main N-S spine:   X = 0,  Z = -12 to +14
//   East perimeter:   X = 13, Z = -12 to +14
//   West perimeter:   X = -13, Z = -12 to +14
//   South perimeter:  Z = 14, X = -13 to +13
//   North boundary:   Z = -12
//   E-W cross roads at Z = -9, -5, -1, 3, 7, 11
//   Secondary N-S at X = -7 (west block) and X = 7 (east block)
//
// Buildings are placed BETWEEN roads with adequate clearance (≥1.2 units from road centres)

export const CAMPUS_LAYOUT: ZoneLayout[] = [
  // ── NORTHWEST QUAD (X: -13 to -2, Z: -12 to -2) ─────────────────────────
  {
    id: "sports",
    position: [-9.5, 0, -9.5],
    size: [5.5, 0.3, 4.5],
    roofType: "shed",
    roofColor: "#2d6e2d",
    wallColor: "#3a8a3a",
    label: "Sports Ground",
    name: "Sports Ground",
  },
  {
    id: "pavilion",
    position: [-9.5, 0, -5.8],
    size: [1.8, 1.8, 1.4],
    roofType: "hip",
    roofColor: "#7a5535",
    wallColor: "#c8b090",
    label: "Pavilion",
    name: "Pavilion",
  },
  {
    id: "civil",
    position: [-4.5, 0, -9.5],
    size: [3.0, 2.8, 2.6],
    roofType: "flat",
    roofColor: "#707080",
    wallColor: "#b0b0c0",
    label: "Civil Engineering",
    name: "Dept of Civil Engineering",
  },
  {
    id: "textile",
    position: [-4.5, 0, -6.2],
    size: [3.2, 2.4, 2.6],
    roofType: "flat",
    roofColor: "#808080",
    wallColor: "#b8b8b8",
    label: "Textile & Clothing",
    name: "Dept of Textile & Clothing",
  },
  // ── NORTHEAST QUAD (X: 2 to 13, Z: -12 to -2) ────────────────────────────
  {
    id: "transport",
    position: [4.0, 0, -9.5],
    size: [2.8, 2.2, 2.4],
    roofType: "flat",
    roofColor: "#909090",
    wallColor: "#c0c0c0",
    label: "Transport & Logistics",
    name: "New Transport & Logistics",
  },
  {
    id: "hostel_a",
    position: [9.5, 0, -9.5],
    size: [2.8, 4.2, 2.8],
    roofType: "flat",
    roofColor: "#dcdcdc",
    wallColor: "#f0f0f0",
    label: "A Hostel",
    name: "A Hostel",
  },
  {
    id: "lblock",
    position: [4.0, 0, -6.2],
    size: [2.4, 2.8, 2.2],
    roofType: "flat",
    roofColor: "#888888",
    wallColor: "#bbbbbb",
    label: "L Block",
    name: "L Block",
  },
  {
    id: "female_hostel",
    position: [9.5, 0, -6.2],
    size: [2.4, 3.4, 2.4],
    roofType: "flat",
    roofColor: "#e0ccd0",
    wallColor: "#f5e8ea",
    label: "Female Hostel",
    name: "Female Hostel",
  },
  // ── WEST-CENTER QUAD (X: -13 to -2, Z: -2 to 6) ─────────────────────────
  {
    id: "admin",
    position: [-9.5, 0, -2.5],
    size: [2.8, 2.4, 2.4],
    roofType: "gabled",
    roofColor: "#7a6040",
    wallColor: "#c8b090",
    label: "Conference Hall",
    name: "New Conference Hall",
  },
  {
    id: "maritime",
    position: [-9.5, 0, 0.8],
    size: [2.6, 2.2, 2.2],
    roofType: "flat",
    roofColor: "#607080",
    wallColor: "#90a8b8",
    label: "Maritime Studies",
    name: "Division of Maritime Studies",
  },
  {
    id: "wala_canteen",
    position: [-4.5, 0, -2.5],
    size: [2.0, 1.6, 1.8],
    roofType: "hip",
    roofColor: "#a05030",
    wallColor: "#d0a060",
    label: "Wala Canteen",
    name: "Wala Canteen",
  },
  {
    id: "material",
    position: [-9.5, 0, 4.0],
    size: [3.0, 2.6, 2.6],
    roofType: "flat",
    roofColor: "#806050",
    wallColor: "#b09080",
    label: "Material Science",
    name: "Dept of Material Science & Engineering",
  },
  {
    id: "buildeco",
    position: [-4.5, 0, 1.5],
    size: [3.0, 2.4, 2.4],
    roofType: "gabled",
    roofColor: "#6b5030",
    wallColor: "#a89070",
    label: "Building Economics",
    name: "Dept of Building Economics",
  },
  // ── EAST-CENTER QUAD (X: 2 to 13, Z: -2 to 6) ───────────────────────────
  {
    id: "canteen",
    position: [4.0, 0, -2.5],
    size: [2.0, 1.6, 1.8],
    roofType: "hip",
    roofColor: "#b05030",
    wallColor: "#d4aa60",
    label: "Canteen",
    name: "Canteen",
  },
  {
    id: "cse",
    position: [4.0, 0, 0.5],
    size: [3.8, 3.0, 3.0],
    roofType: "flat",
    roofColor: "#6a7a8a",
    wallColor: "#a0b0c0",
    label: "CS & Engineering",
    name: "Dept of CS & Engineering",
  },
  {
    id: "it",
    position: [9.5, 0, -2.5],
    size: [3.4, 3.2, 2.8],
    roofType: "flat",
    roofColor: "#8090a0",
    wallColor: "#b0c0d0",
    label: "Faculty of IT",
    name: "Faculty of Information Technology",
  },
  {
    id: "bh1",
    position: [9.5, 0, 1.0],
    size: [2.2, 3.2, 2.2],
    roofType: "flat",
    roofColor: "#d0c8c0",
    wallColor: "#ede8e0",
    label: "BH1",
    name: "BH1",
  },
  // ── SOUTH-WEST QUAD (X: -13 to -2, Z: 6 to 14) ───────────────────────────
  {
    id: "chemical",
    position: [-9.5, 0, 7.5],
    size: [3.2, 2.6, 2.6],
    roofType: "flat",
    roofColor: "#607090",
    wallColor: "#9ab0c8",
    label: "Chemical & Process Eng",
    name: "Dept of Chemical & Process Engineering",
  },
  {
    id: "mechanical",
    position: [-9.5, 0, 11.0],
    size: [3.2, 2.6, 2.6],
    roofType: "flat",
    roofColor: "#706050",
    wallColor: "#a89070",
    label: "Mechanical Engineering",
    name: "Dept of Mechanical Engineering",
  },
  {
    id: "registrar",
    position: [-4.5, 0, 7.5],
    size: [2.8, 2.2, 2.2],
    roofType: "gabled",
    roofColor: "#5a4a30",
    wallColor: "#9a8060",
    label: "Registrar Office",
    name: "Registrar Office & Examination",
  },
  // ── SOUTH-EAST QUAD (X: 2 to 13, Z: 6 to 14) ────────────────────────────
  {
    id: "medicine",
    position: [9.5, 0, 4.5],
    size: [3.2, 3.0, 3.0],
    roofType: "flat",
    roofColor: "#a07060",
    wallColor: "#d0a090",
    label: "Faculty of Medicine",
    name: "Faculty of Medicine",
  },
  {
    id: "intdesign",
    position: [4.0, 0, 7.5],
    size: [2.8, 2.4, 2.4],
    roofType: "flat",
    roofColor: "#808090",
    wallColor: "#b0b0cc",
    label: "Integrated Design",
    name: "Dept of Integrated Design",
  },
  {
    id: "majlis",
    position: [9.5, 0, 7.5],
    size: [2.2, 2.0, 2.0],
    roofType: "hip",
    roofColor: "#406040",
    wallColor: "#709870",
    label: "Majlis Ul Islam",
    name: "Majlis Ul Islam",
  },
  {
    id: "graduate",
    position: [4.0, 0, 11.0],
    size: [2.8, 2.4, 2.4],
    roofType: "flat",
    roofColor: "#706870",
    wallColor: "#a898a8",
    label: "Graduate Studies",
    name: "Faculty of Graduate Studies",
  },
  {
    id: "library",
    position: [9.5, 0, 11.0],
    size: [3.0, 2.4, 2.8],
    roofType: "gabled",
    roofColor: "#4a3820",
    wallColor: "#9a7850",
    label: "Library",
    name: "Library",
  },
];

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function deriveStatus(occ: number, temp: number): ZoneStatus {
  if (occ > 86 || temp > 34) return "critical";
  if (occ > 65 || temp > 31) return "busy";
  return "normal";
}

function updateZone(zone: Zone): Zone {
  const e = clamp(zone.energyKw + (Math.random() * 11 - 5.5), 15, 140);
  const o = clamp(zone.occupancy + (Math.random() * 10 - 5), 5, 98);
  const t = clamp(zone.temperatureC + (Math.random() * 1.8 - 0.9), 22, 38);
  return {
    ...zone,
    energyKw: +e.toFixed(1),
    occupancy: Math.round(o),
    temperatureC: +t.toFixed(1),
    status: deriveStatus(o, t),
  };
}

// ─── Street Lamp ──────────────────────────────────────────────────────────────
function StreetLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 3.0, 8]} />
        <meshStandardMaterial color="#555566" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Horizontal arm */}
      <mesh position={[0.35, 3.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.7, 6]} />
        <meshStandardMaterial color="#555566" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Lamp head */}
      <mesh position={[0.7, 3.05, 0]}>
        <boxGeometry args={[0.28, 0.12, 0.2]} />
        <meshStandardMaterial color="#333344" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Light bulb glow */}
      <mesh position={[0.7, 2.98, 0]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial
          color="#fffbe0"
          emissive="#ffe88a"
          emissiveIntensity={2.5}
        />
      </mesh>
      {/* Actual point light */}
      <pointLight
        position={[0.7, 2.9, 0]}
        intensity={4}
        distance={6}
        color="#ffe8a0"
        decay={2}
      />
    </group>
  );
}

// ─── Park Bench ───────────────────────────────────────────────────────────────
function ParkBench({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Seat slats */}
      {[-0.12, 0, 0.12].map((z) => (
        <mesh key={z} position={[0, 0.4, z]}>
          <boxGeometry args={[0.9, 0.06, 0.1]} />
          <meshStandardMaterial color="#8B5E3C" roughness={0.8} />
        </mesh>
      ))}
      {/* Backrest */}
      {[-0.08, 0.08].map((z) => (
        <mesh key={z} position={[0, 0.72, z - 0.28]}>
          <boxGeometry args={[0.9, 0.06, 0.08]} />
          <meshStandardMaterial color="#8B5E3C" roughness={0.8} />
        </mesh>
      ))}
      {/* Back support post */}
      <mesh position={[0, 0.57, -0.33]}>
        <boxGeometry args={[0.85, 0.32, 0.05]} />
        <meshStandardMaterial color="#6B4423" roughness={0.85} />
      </mesh>
      {/* Legs (4) */}
      {[
        [-0.37, -0.32],
        [0.37, -0.32],
        [-0.37, 0.22],
        [0.37, 0.22],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.22, z]}>
          <boxGeometry args={[0.06, 0.44, 0.06]} />
          <meshStandardMaterial color="#444" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Outdoor Chair ────────────────────────────────────────────────────────────
function OutdoorChair({
  position,
  rotation = 0,
  color = "#e8c87a",
}: {
  position: [number, number, number];
  rotation?: number;
  color?: string;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Seat */}
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[0.35, 0.05, 0.35]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Back */}
      <mesh position={[0, 0.6, -0.15]}>
        <boxGeometry args={[0.35, 0.4, 0.04]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Legs */}
      {[
        [-0.14, -0.14],
        [0.14, -0.14],
        [-0.14, 0.14],
        [0.14, 0.14],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.19, z]}>
          <cylinderGeometry args={[0.025, 0.025, 0.38, 6]} />
          <meshStandardMaterial color="#555" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Round Table ──────────────────────────────────────────────────────────────
function RoundTable({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.52, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
        <meshStandardMaterial color="#ccc" metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.5, 8]} />
        <meshStandardMaterial color="#888" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.04, 12]} />
        <meshStandardMaterial color="#888" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

// ─── Outdoor Furniture Clusters ───────────────────────────────────────────────
function FurnitureScene() {
  // Seating area clusters placed in open areas between buildings
  const clusters = [
    // Near canteen area
    { pos: [1.8, 0, -1.5] as [number, number, number], type: "canteen" },
    // Near Wala canteen
    { pos: [-2.8, 0, -1.5] as [number, number, number], type: "wala" },
    // Open square near CSE
    { pos: [1.8, 0, 2.0] as [number, number, number], type: "cse" },
    // Near library entrance
    { pos: [7.8, 0, 12.5] as [number, number, number], type: "library" },
    // Near conference hall
    { pos: [-7.5, 0, -0.5] as [number, number, number], type: "conf" },
  ];

  return (
    <>
      {clusters.map((c, ci) => (
        <group key={ci} position={c.pos}>
          <RoundTable position={[0, 0, 0]} />
          <OutdoorChair
            position={[0.55, 0, 0]}
            rotation={-Math.PI / 2}
            color="#e8c87a"
          />
          <OutdoorChair
            position={[-0.55, 0, 0]}
            rotation={Math.PI / 2}
            color="#e8c87a"
          />
          <OutdoorChair
            position={[0, 0, 0.55]}
            rotation={Math.PI}
            color="#e8c87a"
          />
          <OutdoorChair
            position={[0, 0, -0.55]}
            rotation={0}
            color="#e8c87a"
          />
        </group>
      ))}

      {/* Benches along main spine at regular intervals */}
      {[-7.5, -3.5, 0.5, 4.5, 9.0].map((z, i) => (
        <ParkBench
          key={`bench-west-${i}`}
          position={[-1.1, 0, z]}
          rotation={Math.PI / 2}
        />
      ))}
      {[-7.5, -3.5, 0.5, 4.5, 9.0].map((z, i) => (
        <ParkBench
          key={`bench-east-${i}`}
          position={[1.1, 0, z]}
          rotation={-Math.PI / 2}
        />
      ))}
      {/* East side benches */}
      {[-7.5, -4.0, 0.5, 4.5, 9.0].map((z, i) => (
        <ParkBench
          key={`bench-east2-${i}`}
          position={[7.0, 0, z]}
          rotation={0}
        />
      ))}
    </>
  );
}

// ─── Street Lamps ─────────────────────────────────────────────────────────────
function LampsScene() {
  // Along main N-S spine (X=0) at Z intervals
  const spineZs = [-11, -8, -5, -2, 1, 4, 7, 10, 13];
  // Along east perimeter (X=13)
  const eastZs = [-10, -6, -2, 2, 6, 10];
  // Along west perimeter (X=-13)
  const westZs = [-10, -6, -2, 2, 6, 10];
  // Along cross roads
  const crossX = [-11, -7, 7, 11];

  return (
    <>
      {spineZs.map((z) => (
        <StreetLamp key={`sp-${z}`} position={[-0.9, 0, z]} />
      ))}
      {spineZs.map((z) => (
        <StreetLamp key={`sp2-${z}`} position={[0.9, 0, z]} />
      ))}
      {eastZs.map((z) => (
        <StreetLamp key={`ep-${z}`} position={[12.2, 0, z]} />
      ))}
      {westZs.map((z) => (
        <StreetLamp key={`wp-${z}`} position={[-12.2, 0, z]} />
      ))}
      {crossX.map((x) => (
        <StreetLamp key={`cr-n-${x}`} position={[x, 0, -9]} />
      ))}
      {crossX.map((x) => (
        <StreetLamp key={`cr-m-${x}`} position={[x, 0, -5]} />
      ))}
      {crossX.map((x) => (
        <StreetLamp key={`cr-c-${x}`} position={[x, 0, -1]} />
      ))}
      {crossX.map((x) => (
        <StreetLamp key={`cr-s-${x}`} position={[x, 0, 3]} />
      ))}
      {crossX.map((x) => (
        <StreetLamp key={`cr-ss-${x}`} position={[x, 0, 7]} />
      ))}
      {crossX.map((x) => (
        <StreetLamp key={`cr-sss-${x}`} position={[x, 0, 11]} />
      ))}
    </>
  );
}

// ─── Roads (clean grid) ───────────────────────────────────────────────────────
function Roads() {
  const road = "#5a5a66";
  const pave = "#7a7a88";

  const RoadPlane = ({
    x, z, w, d, rot = 0, type = "road",
  }: {
    x: number; z: number; w: number; d: number; rot?: number; type?: string;
  }) => (
    <mesh rotation={[-Math.PI / 2, 0, rot]} position={[x, 0.006, z]} receiveShadow>
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial color={type === "road" ? road : pave} roughness={0.9} />
    </mesh>
  );

  // Centre-line dashes for main N-S spine
  const Dashes = () => (
    <>
      {Array.from({ length: 26 }, (_, i) => -12 + i * 1.4).map((z) => (
        <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.009, z]}>
          <planeGeometry args={[0.07, 0.75]} />
          <meshStandardMaterial color="#ffffffaa" transparent opacity={0.55} />
        </mesh>
      ))}
    </>
  );

  const CrossDashes = ({ z }: { z: number }) => (
    <>
      {Array.from({ length: 18 }, (_, i) => -13 + i * 1.5).map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.009, z]}>
          <planeGeometry args={[0.75, 0.07]} />
          <meshStandardMaterial color="#ffffff88" transparent opacity={0.45} />
        </mesh>
      ))}
    </>
  );

  return (
    <group>
      {/* Main N-S spine */}
      <RoadPlane x={0} z={1} w={1.4} d={28} />
      <Dashes />

      {/* Secondary N-S roads */}
      <RoadPlane x={-7} z={1} w={1.2} d={28} />
      <RoadPlane x={7} z={1} w={1.2} d={28} />

      {/* East & West perimeter N-S */}
      <RoadPlane x={13} z={1} w={1.2} d={28} />
      <RoadPlane x={-13} z={1} w={1.2} d={28} />

      {/* E-W cross roads */}
      {[-9, -5, -1, 3, 7, 11].map((z) => (
        <group key={z}>
          <RoadPlane x={0} z={z} w={28} d={1.1} />
          <CrossDashes z={z} />
        </group>
      ))}

      {/* South perimeter E-W */}
      <RoadPlane x={0} z={13.5} w={28} d={1.2} />

      {/* North boundary E-W */}
      <RoadPlane x={0} z={-12} w={28} d={1.0} />

      {/* Pavement strips at building edges */}
      {/* West block inner */}
      <RoadPlane x={-5.7} z={1} w={0.5} d={28} type="pave" />
      {/* East block inner */}
      <RoadPlane x={5.7} z={1} w={0.5} d={28} type="pave" />
    </group>
  );
}

// ─── Ground ───────────────────────────────────────────────────────────────────
function Ground() {
  return (
    <>
      {/* Base grass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[42, 42]} />
        <meshStandardMaterial color="#4a7a38" roughness={0.95} />
      </mesh>
      {/* Sports field bright grass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-9.5, 0.005, -9.5]}>
        <planeGeometry args={[6, 5]} />
        <meshStandardMaterial color="#3a9530" roughness={0.88} />
      </mesh>
      {/* Field markings */}
      {[-2, 0, 2].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x - 9.5, 0.007, -9.5]}>
          <planeGeometry args={[0.07, 4.5]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.4} />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-9.5, 0.007, -9.5]}>
        <planeGeometry args={[6, 0.07]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.4} />
      </mesh>
      {/* Plaza / courtyard areas */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, -0.5]}>
        <planeGeometry args={[2.8, 4.0]} />
        <meshStandardMaterial color="#b0a890" roughness={0.92} />
      </mesh>
      {/* Paved quad near canteen */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.8, 0.003, -2]}>
        <planeGeometry args={[3.5, 2.5]} />
        <meshStandardMaterial color="#a8a090" roughness={0.9} />
      </mesh>
    </>
  );
}

// ─── First-Person Walker ──────────────────────────────────────────────────────
function FirstPersonController({ enabled }: { enabled: boolean }) {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const yaw = useRef(0);
  const pitch = useRef(-0.15);
  const pointerLocked = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    camera.position.set(0, 1.7, 6);
    const onKey = (e: KeyboardEvent, down: boolean) => { keys.current[e.code] = down; };
    const onMouseMove = (e: MouseEvent) => {
      if (!pointerLocked.current) return;
      yaw.current -= e.movementX * 0.002;
      pitch.current = clamp(pitch.current - e.movementY * 0.002, -1.2, 0.4);
    };
    const onPointerLockChange = () => { pointerLocked.current = document.pointerLockElement !== null; };
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest("canvas")) document.documentElement.requestPointerLock?.();
    };
    window.addEventListener("keydown", (e) => onKey(e, true));
    window.addEventListener("keyup", (e) => onKey(e, false));
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("pointerlockchange", onPointerLockChange);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", (e) => onKey(e, true));
      window.removeEventListener("keyup", (e) => onKey(e, false));
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("pointerlockchange", onPointerLockChange);
      document.removeEventListener("click", onClick);
      document.exitPointerLock?.();
    };
  }, [enabled, camera]);

  useFrame((_, delta) => {
    if (!enabled) return;
    const speed = (keys.current["ShiftLeft"] || keys.current["ShiftRight"]) ? 12 : 6;
    const dt = Math.min(delta, 0.05);
    camera.quaternion.setFromEuler(new THREE.Euler(pitch.current, yaw.current, 0, "YXZ"));
    const forward = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(0, yaw.current, 0));
    const right = new THREE.Vector3(1, 0, 0).applyEuler(new THREE.Euler(0, yaw.current, 0));
    if (keys.current["KeyW"] || keys.current["ArrowUp"]) camera.position.addScaledVector(forward, speed * dt);
    if (keys.current["KeyS"] || keys.current["ArrowDown"]) camera.position.addScaledVector(forward, -speed * dt);
    if (keys.current["KeyA"] || keys.current["ArrowLeft"]) camera.position.addScaledVector(right, -speed * dt);
    if (keys.current["KeyD"] || keys.current["ArrowRight"]) camera.position.addScaledVector(right, speed * dt);
    camera.position.y = 1.7;
    camera.position.x = clamp(camera.position.x, -15, 15);
    camera.position.z = clamp(camera.position.z, -13, 15);
  });

  return null;
}

// ─── Building ─────────────────────────────────────────────────────────────────
function Building({
  layout, zone, selected, onClick,
}: {
  layout: ZoneLayout; zone: Zone; selected: boolean; onClick: () => void;
}) {
  const meshRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  const [w, h, d] = layout.size;
  const [px, , pz] = layout.position;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      hovered || selected ? 0.12 : 0,
      delta * 6,
    );
  });

  const wallColor = selected ? "#d8eeff" : layout.wallColor;
  const emissiveInt = selected ? 0.5 : hovered ? 0.28 : 0.07;

  const Roof = () => {
    if (layout.roofType === "flat") {
      return (
        <mesh position={[0, h / 2 + 0.09, 0]}>
          <boxGeometry args={[w + 0.15, 0.18, d + 0.15]} />
          <meshStandardMaterial color={layout.roofColor} roughness={0.5} metalness={0.1} />
        </mesh>
      );
    }
    if (layout.roofType === "gabled") {
      const ridge = h * 0.38;
      const slopeAngle = Math.atan2(ridge, w / 2);
      const slopeLen = Math.sqrt((w / 2) ** 2 + ridge ** 2);
      return (
        <group position={[0, h / 2, 0]}>
          <mesh rotation={[slopeAngle, 0, 0]} position={[0, ridge / 2, slopeLen / 2]}>
            <boxGeometry args={[w + 0.3, 0.14, slopeLen * 2 + 0.1]} />
            <meshStandardMaterial color={layout.roofColor} roughness={0.6} />
          </mesh>
          <mesh rotation={[-slopeAngle, 0, 0]} position={[0, ridge / 2, -slopeLen / 2]}>
            <boxGeometry args={[w + 0.3, 0.14, slopeLen * 2 + 0.1]} />
            <meshStandardMaterial color={layout.roofColor} roughness={0.6} />
          </mesh>
        </group>
      );
    }
    if (layout.roofType === "hip") {
      return (
        <mesh position={[0, h / 2 + 0.12, 0]}>
          <coneGeometry args={[(w / 2 + d / 2) * 0.52 + 0.2, h * 0.48, 4]} />
          <meshStandardMaterial color={layout.roofColor} roughness={0.6} />
        </mesh>
      );
    }
    return (
      <mesh position={[0, h / 2 + 0.05, 0]} rotation={[0.12, 0, 0]}>
        <boxGeometry args={[w + 0.2, 0.18, d + 0.3]} />
        <meshStandardMaterial color={layout.roofColor} roughness={0.5} />
      </mesh>
    );
  };

  const Windows = () => {
    const rows = Math.max(1, Math.floor(h / 1.5));
    const cols = Math.max(2, Math.floor(w / 1.1));
    const wins = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const wx = -w / 2 + 0.55 + c * ((w - 0.55) / cols);
        const wy = -h / 2 + 0.55 + r * ((h - 0.5) / rows);
        wins.push(
          <mesh key={`${r}-${c}`} position={[wx, wy, d / 2 + 0.015]}>
            <boxGeometry args={[0.28, 0.32, 0.04]} />
            <meshStandardMaterial
              color={selected ? "#aaddff" : "#88bbee"}
              emissive={selected ? "#4488cc" : "#1a3366"}
              emissiveIntensity={0.5}
              roughness={0.1}
              metalness={0.4}
            />
          </mesh>,
        );
      }
    }
    return <>{wins}</>;
  };

  return (
    <group position={[px, 0, pz]}>
      <group
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial
            color={wallColor}
            emissive={STATUS_COLORS[zone.status]}
            emissiveIntensity={emissiveInt}
            roughness={0.55}
            metalness={0.08}
          />
        </mesh>
        <Windows />
        <Roof />
        {/* Status beacon */}
        <mesh position={[0, h + 0.6 + (layout.roofType === "hip" ? h * 0.25 : layout.roofType === "gabled" ? h * 0.22 : 0), 0]}>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshStandardMaterial
            color={STATUS_COLORS[zone.status]}
            emissive={STATUS_GLOW[zone.status]}
            emissiveIntensity={1.2}
          />
        </mesh>
        <Html
          center
          position={[0, h + 1.4 + (layout.roofType === "hip" ? h * 0.25 : layout.roofType === "gabled" ? h * 0.22 : 0), 0]}
        >
          <div style={{
            background: "rgba(7,25,82,0.9)",
            border: `1px solid ${selected ? STATUS_COLORS[zone.status] : "#35A29F44"}`,
            color: "#fff",
            fontSize: "10px",
            fontWeight: 600,
            padding: "2px 7px",
            borderRadius: "5px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            boxShadow: selected ? `0 0 12px ${STATUS_COLORS[zone.status]}88` : "none",
          }}>
            {layout.label}
          </div>
        </Html>
      </group>
    </group>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function CampusScene({
  zones, selectedId, onSelect, walkMode,
}: {
  zones: Zone[]; selectedId: string; onSelect: (id: string) => void; walkMode: boolean;
}) {
  return (
    <>
      <color attach="background" args={["#b8ccdf"]} />
      <fog attach="fog" args={["#b8ccdf", 32, 72]} />
      <ambientLight intensity={1.2} />
      <directionalLight
        position={[14, 22, 12]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={70}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <directionalLight position={[-12, 14, -10]} intensity={0.4} color="#ddeeff" />
      <hemisphereLight args={["#bbd4f0", "#3a6e28", 0.55]} />

      <Ground />
      <Roads />
      <LampsScene />
      <FurnitureScene />

      {CAMPUS_LAYOUT.map((layout) => {
        const zone = zones.find((z) => z.id === layout.id);
        if (!zone) return null;
        return (
          <Building
            key={layout.id}
            layout={layout}
            zone={zone}
            selected={selectedId === layout.id}
            onClick={() => onSelect(layout.id)}
          />
        );
      })}

      {walkMode ? (
        <FirstPersonController enabled={walkMode} />
      ) : (
        <OrbitControls
          makeDefault
          enablePan
          panSpeed={1.5}
          minDistance={6}
          maxDistance={42}
          maxPolarAngle={Math.PI / 2.12}
          autoRotate={false}
          target={[0, 0, 1]}
        />
      )}
    </>
  );
}

// ─── Initial Data ─────────────────────────────────────────────────────────────
const INITIAL_ZONES: Zone[] = [
  { id: "sports", name: "Sports Ground", energyKw: 20.0, occupancy: 15, temperatureC: 27.0, status: "normal" },
  { id: "pavilion", name: "Pavilion", energyKw: 12.0, occupancy: 10, temperatureC: 27.5, status: "normal" },
  { id: "textile", name: "Dept of Textile & Clothing", energyKw: 58.4, occupancy: 60, temperatureC: 29.5, status: "normal" },
  { id: "civil", name: "Dept of Civil Engineering", energyKw: 62.1, occupancy: 65, temperatureC: 29.8, status: "normal" },
  { id: "lblock", name: "L Block", energyKw: 44.0, occupancy: 70, temperatureC: 30.5, status: "busy" },
  { id: "transport", name: "New Transport & Logistics", energyKw: 35.0, occupancy: 45, temperatureC: 29.0, status: "normal" },
  { id: "canteen", name: "Canteen", energyKw: 92.0, occupancy: 90, temperatureC: 36.0, status: "critical" },
  { id: "hostel_a", name: "A Hostel", energyKw: 95.1, occupancy: 78, temperatureC: 32.0, status: "busy" },
  { id: "it", name: "Faculty of Information Technology", energyKw: 76.5, occupancy: 72, temperatureC: 31.5, status: "busy" },
  { id: "female_hostel", name: "Female Hostel", energyKw: 88.0, occupancy: 74, temperatureC: 31.0, status: "busy" },
  { id: "bh1", name: "BH1", energyKw: 72.0, occupancy: 68, temperatureC: 30.5, status: "busy" },
  { id: "medicine", name: "Faculty of Medicine", energyKw: 77.0, occupancy: 73, temperatureC: 31.8, status: "busy" },
  { id: "admin", name: "New Conference Hall", energyKw: 38.5, occupancy: 55, temperatureC: 28.5, status: "normal" },
  { id: "cse", name: "Dept of CS & Engineering", energyKw: 82.3, occupancy: 76, temperatureC: 31.2, status: "busy" },
  { id: "maritime", name: "Division of Maritime Studies", energyKw: 42.0, occupancy: 50, temperatureC: 28.8, status: "normal" },
  { id: "wala_canteen", name: "Wala Canteen", energyKw: 55.0, occupancy: 80, temperatureC: 33.5, status: "busy" },
  { id: "buildeco", name: "Dept of Building Economics", energyKw: 50.0, occupancy: 58, temperatureC: 29.0, status: "normal" },
  { id: "material", name: "Dept of Material Science", energyKw: 65.0, occupancy: 62, temperatureC: 30.0, status: "normal" },
  { id: "chemical", name: "Dept of Chemical & Process Eng", energyKw: 70.2, occupancy: 67, temperatureC: 30.8, status: "busy" },
  { id: "mechanical", name: "Dept of Mechanical Engineering", energyKw: 68.0, occupancy: 64, temperatureC: 30.4, status: "normal" },
  { id: "registrar", name: "Registrar Office & Examination", energyKw: 32.0, occupancy: 40, temperatureC: 28.0, status: "normal" },
  { id: "intdesign", name: "Dept of Integrated Design", energyKw: 48.0, occupancy: 57, temperatureC: 29.2, status: "normal" },
  { id: "graduate", name: "Faculty of Graduate Studies", energyKw: 52.0, occupancy: 62, temperatureC: 29.8, status: "normal" },
  { id: "library", name: "Library", energyKw: 58.0, occupancy: 82, temperatureC: 30.5, status: "busy" },
  { id: "majlis", name: "Majlis Ul Islam", energyKw: 18.0, occupancy: 30, temperatureC: 28.0, status: "normal" },
];

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function DigitalTwinDashboard() {
  const [zones, setZones] = useState<Zone[]>(INITIAL_ZONES);
  const [selectedId, setSelectedId] = useState<string>("it");
  const [walkMode, setWalkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const t = setInterval(() => setZones((prev) => prev.map(updateZone)), 5000);
    return () => clearInterval(t);
  }, []);

  const toggleWalkMode = useCallback(() => setWalkMode((v) => !v), []);
  const selectedZone = zones.find((z) => z.id === selectedId) ?? zones[0];
  const campusLoad = zones.reduce((a, z) => a + z.energyKw, 0);
  const campusOcc = Math.round(zones.reduce((a, z) => a + z.occupancy, 0) / zones.length);
  const criticalCount = zones.filter((z) => z.status === "critical").length;
  const filteredZones = zones.filter((z) =>
    z.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100%",
      background: "#071952",
      overflow: "hidden",
      color: "#fff",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      {/* ── Sidebar ── */}
      <nav style={{
        width: 300,
        flexShrink: 0,
        background: "rgba(11,102,106,0.18)",
        borderRight: "1px solid rgba(53,162,159,0.3)",
        display: "flex",
        flexDirection: "column",
        padding: 14,
        gap: 10,
        overflowY: "auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "#97FEED", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Building2 color="#071952" size={20} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 19, letterSpacing: "-0.5px" }}>
            UOM<span style={{ color: "#97FEED" }}>Twin</span>
          </span>
          <span style={{ marginLeft: "auto", fontSize: 9, color: "#97FEED88", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            UoM
          </span>
        </div>

        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search zones..."
          style={{
            background: "rgba(7,25,82,0.5)",
            border: "1px solid rgba(53,162,159,0.3)",
            borderRadius: 8, padding: "7px 10px",
            color: "#fff", fontSize: 11, outline: "none",
          }}
        />

        <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.18em", color: "#97FEED", fontWeight: 700, marginBottom: 4 }}>
          Zone Status Panel ({filteredZones.length})
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 6, flex: 1, alignItems: "start" }}>
          {filteredZones.map((zone) => {
            const active = zone.id === selectedId;
            return (
              <button
                key={zone.id}
                onClick={() => setSelectedId(zone.id)}
                style={{
                  background: active ? "rgba(11,102,106,0.85)" : "rgba(7,25,82,0.35)",
                  border: `1px solid ${active ? "#97FEED" : "rgba(53,162,159,0.18)"}`,
                  borderRadius: 8, padding: "6px 8px",
                  cursor: "pointer", display: "flex", alignItems: "center",
                  gap: 6, transition: "all 0.2s", textAlign: "left",
                  minWidth: 0, minHeight: 36,
                }}
              >
                <span style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: STATUS_COLORS[zone.status],
                  boxShadow: `0 0 4px ${STATUS_COLORS[zone.status]}`,
                  flexShrink: 0,
                }} />
                <span style={{ fontSize: 9, color: "#fff", lineHeight: 1.2, flex: 1, minWidth: 0 }}>
                  {zone.name}
                </span>
                <span style={{ fontSize: 7, color: STATUS_COLORS[zone.status], fontWeight: 700, textTransform: "uppercase", flexShrink: 0, letterSpacing: "0.04em" }}>
                  {zone.status}
                </span>
              </button>
            );
          })}
        </div>

        {/* Zone detail */}
        <div style={{ borderRadius: 14, border: "1px solid #97FEED", background: "#0B666A", padding: 16, flexShrink: 0 }}>
          <p style={{ fontSize: 9, color: "rgba(0,0,0,0.55)", fontWeight: 700, textTransform: "uppercase", marginBottom: 3 }}>
            Selected Zone
          </p>
          <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, lineHeight: 1.3 }}>
            {selectedZone.name}
          </p>
          <div style={{
            background: "rgba(7,25,82,0.5)", borderRadius: 8,
            border: "1px solid rgba(53,162,159,0.35)",
            padding: 12, display: "flex", flexDirection: "column", gap: 8, fontSize: 12, fontFamily: "monospace",
          }}>
            {[
              ["STATUS", selectedZone.status.toUpperCase(), STATUS_COLORS[selectedZone.status]],
              ["Energy", `${selectedZone.energyKw.toFixed(1)} kW`, "#97FEED"],
              ["Occupancy", `${selectedZone.occupancy}%`, "#97FEED"],
              ["Temperature", `${selectedZone.temperatureC}°C`, "#97FEED"],
            ].map(([label, value, color], i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between",
                paddingBottom: i < 3 ? 8 : 0,
                borderBottom: i < 3 ? "1px solid rgba(53,162,159,0.2)" : "none",
              }}>
                <span style={{ color: "#97FEED" }}>{label}</span>
                <span style={{ color, fontWeight: 700 }}>{value}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 9, color: "#fff", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5 }}>
              Capacity
            </div>
            <div style={{ height: 10, borderRadius: 5, background: "rgba(7,25,82,0.8)", border: "1px solid rgba(53,162,159,0.35)", padding: 2 }}>
              <div style={{
                height: "100%", borderRadius: 3,
                background: STATUS_COLORS[selectedZone.status],
                width: `${selectedZone.occupancy}%`,
                transition: "width 0.6s ease",
              }} />
            </div>
          </div>
        </div>
      </nav>

      {/* ── Main ── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, padding: 14, minWidth: 0 }}>
        {/* Header */}
        <header style={{
          background: "rgba(11,102,106,0.35)",
          border: "1px solid rgba(53,162,159,0.3)",
          borderRadius: 14, padding: "12px 18px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 14, flexShrink: 0,
        }}>
          <div>
            <p style={{ fontSize: 9, color: "#97FEED", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700 }}>
              Group I3 Demo • University of Moratuwa
            </p>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: "2px 0" }}>
              Smart Campus Twin Control
            </h1>
            <p style={{ fontSize: 11, color: "rgba(151,254,237,0.75)" }}>
              Real-time 3D campus — occupancy · temperature · energy · street lamps · seating
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, minWidth: 300 }}>
            {[
              ["Campus Energy", `${campusLoad.toFixed(1)} kW`],
              ["Avg Occupancy", `${campusOcc}%`],
              ["Active Zones", `${zones.length}`],
              ["Alerts", criticalCount > 0 ? `${criticalCount} critical` : "None"],
            ].map(([label, val]) => (
              <div key={label} style={{ background: "rgba(7,25,82,0.55)", border: "1px solid rgba(53,162,159,0.3)", borderRadius: 9, padding: "7px 12px" }}>
                <div style={{ fontSize: 9, color: "rgba(151,254,237,0.8)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 2 }}>
                  {label}
                </div>
                <div style={{
                  fontSize: 15, fontWeight: 700, fontFamily: "monospace",
                  color: label === "Alerts" && criticalCount > 0 ? STATUS_COLORS.critical : "#97FEED",
                }}>
                  {val}
                </div>
              </div>
            ))}
          </div>
        </header>

        {/* 3D Canvas */}
        <section style={{ flex: 1, borderRadius: 14, border: "1px solid rgba(53,162,159,0.3)", overflow: "hidden", position: "relative" }}>
          {/* Toolbar */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            background: "rgba(11,102,106,0.82)", borderBottom: "1px solid rgba(53,162,159,0.4)",
            padding: "7px 14px", fontSize: 10,
            textTransform: "uppercase", letterSpacing: "0.16em", color: "#97FEED", fontWeight: 700, gap: 12,
          }}>
            <span>3D Campus Twin — University of Moratuwa</span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {walkMode && (
                <span style={{ fontSize: 9, color: "#FAC75A", opacity: 0.9 }}>
                  Click canvas → WASD/Arrows · Mouse to look · Shift for speed
                </span>
              )}
              <button
                onClick={toggleWalkMode}
                style={{
                  background: walkMode ? "#97FEED" : "rgba(7,25,82,0.7)",
                  border: `1px solid ${walkMode ? "#97FEED" : "rgba(53,162,159,0.5)"}`,
                  borderRadius: 7, padding: "5px 12px",
                  color: walkMode ? "#071952" : "#97FEED",
                  cursor: "pointer", fontSize: 10, fontWeight: 700,
                  display: "flex", alignItems: "center", gap: 5,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                }}
              >
                {walkMode ? <Eye size={12} /> : <Navigation size={12} />}
                {walkMode ? "Orbit Mode" : "Walk Mode"}
              </button>
              {!walkMode && <span style={{ fontSize: 9, opacity: 0.7 }}>Drag · Scroll · Click</span>}
            </div>
          </div>

          <Canvas camera={{ position: [12, 16, 22], fov: 50 }} shadows style={{ width: "100%", height: "100%" }}>
            <CampusScene zones={zones} selectedId={selectedId} onSelect={setSelectedId} walkMode={walkMode} />
          </Canvas>

          {/* Legend */}
          <div style={{
            position: "absolute", bottom: 10, right: 10, zIndex: 10,
            background: "rgba(7,25,82,0.88)", border: "1px solid rgba(53,162,159,0.3)",
            borderRadius: 8, padding: "8px 12px",
            display: "flex", gap: 16, fontSize: 10,
          }}>
            {(["normal", "busy", "critical"] as ZoneStatus[]).map((s) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: STATUS_COLORS[s], boxShadow: `0 0 5px ${STATUS_COLORS[s]}`, display: "inline-block" }} />
                <span style={{ color: "#97FEED", textTransform: "capitalize" }}>{s}</span>
              </div>
            ))}
            <div style={{ width: 1, background: "rgba(53,162,159,0.3)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 12 }}>💡</span>
              <span style={{ color: "#97FEED" }}>Lamps</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 12 }}>🪑</span>
              <span style={{ color: "#97FEED" }}>Seating</span>
            </div>
          </div>

          {/* Walk controls */}
          {walkMode && (
            <div style={{
              position: "absolute", bottom: 10, left: 10, zIndex: 10,
              background: "rgba(7,25,82,0.88)", border: "1px solid rgba(53,162,159,0.35)",
              borderRadius: 8, padding: "8px 14px",
              fontSize: 9, color: "#97FEED", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.1em",
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 14px" }}>
                <span>W / ↑</span><span style={{ color: "#fff" }}>Forward</span>
                <span>S / ↓</span><span style={{ color: "#fff" }}>Backward</span>
                <span>A / ←</span><span style={{ color: "#fff" }}>Left</span>
                <span>D / →</span><span style={{ color: "#fff" }}>Right</span>
                <span>Shift</span><span style={{ color: "#fff" }}>Run</span>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}