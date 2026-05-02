"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { Building2, Navigation, Eye } from "lucide-react";
import * as THREE from "three";
import CampusTrees from "./CampusTrees";

// ─── Types & Config ───────────────────────────────────────────────────────────

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
  name: string;
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

export const CAMPUS_LAYOUT: ZoneLayout[] = [
  {
    id: "lagaan",
    name: "Lagaan",
    position: [-2.5, 0, -2],
    size: [2.5, 0.25, 2.5],
    roofType: "shed",
    roofColor: "#3a5a40",
    wallColor: "#dad7cd",
    label: "Lagaan",
  },
  {
    id: "conference",
    name: "Multipurpose Hall",
    position: [-10.5, 0, 0.5],
    size: [4.2, 3.2, 2.2],
    roofType: "gabled",
    roofColor: "#8b3a3a",
    wallColor: "#f4f1ea",
    label: "Multipurpose Hall",
  },
  {
    id: "hostel_a",
    name: "Hostel A",
    position: [10.5, 0, -14.5],
    size: [6.2, 4.0, 1.8],
    roofType: "hip",
    roofColor: "#2c3e50",
    wallColor: "#e2e8f0",
    label: "Hostel A",
  },
  {
    id: "textile",
    name: "Dept of Textile & Clothing",
    position: [2.5, 0, -9.5],
    size: [2.8, 1.4, 2.6],
    roofType: "flat",
    roofColor: "#475569",
    wallColor: "#f8fafc",
    label: "Depart. of Textile",
  },
  {
    id: "transport",
    name: "Dept of Transport & Logistics",
    position: [12.5, 0, -4.0],
    size: [3.0, 2.0, 2.4],
    roofType: "flat",
    roofColor: "#52525b",
    wallColor: "#e4e4e7",
    label: "Transport & Logistics",
  },
  {
    id: "civil",
    name: "Dept of Civil Engineering",
    position: [17, 0, -9.5],
    size: [1.8, 2.6, 8.5],
    roofType: "flat",
    roofColor: "#3f3f46",
    wallColor: "#d4d4d8",
    label: "Civil Engineering",
  },
  {
    id: "cse",
    name: "Dept of Computer Science & Engineering",
    position: [-5.0, 0, 4.5],
    size: [8.0, 3.2, 2.2],
    roofType: "flat",
    roofColor: "#1e293b",
    wallColor: "#f1f5f9",
    label: "Sumanadasa Building",
  },
  {
    id: "Goda canteen",
    name: "Goda Canteen",
    position: [-5, 0, 7.7],
    size: [1.8, 1.5, 1.2],
    roofType: "hip",
    roofColor: "#9c2a2a",
    wallColor: "#fef3c7",
    label: "Goda Canteen",
  },
  {
    id: "Sentra",
    name: "Sentra Court",
    position: [-2.5, 0, 7.7],
    size: [3, 1.5, 1.2],
    roofType: "gabled",
    roofColor: "#1b4332",
    wallColor: "#d8f3dc",
    label: "Sentra Court",
  },
  {
    id: "canteen",
    name: "L Canteen",
    position: [1.7, 0, -0.5],
    size: [1.8, 1.5, 1.4],
    roofType: "hip",
    roofColor: "#c2410c",
    wallColor: "#ffedd5",
    label: "L Canteen",
  },
  {
    id: "it",
    name: "Faculty of Information Technology",
    position: [7.5, 0, 3],
    size: [1.4, 3.0, 2],
    roofType: "flat",
    roofColor: "#334155",
    wallColor: "#cbd5e1",
    label: "Faculty of IT",
  },
  {
    id: "hostel",
    name: "Hostel C",
    position: [11.0, 0, 3],
    size: [3.4, 1.6, 2.4],
    roofType: "gabled",
    roofColor: "#7f1d1d",
    wallColor: "#fee2e2",
    label: "Hostel",
  },
  {
    id: "buildeco",
    name: "Faculty of Business Science",
    position: [4.0, 0, -0.5],
    size: [2.2, 3.2, 1.2],
    roofType: "flat",
    roofColor: "#374151",
    wallColor: "#f3f4f6",
    label: "Faculty of Business Science",
  },
  {
    id: "maths",
    name: "Dept of Maths",
    position: [4.0, 0, -3.5],
    size: [2.2, 3.0, 2.0],
    roofType: "flat",
    roofColor: "#1f2937",
    wallColor: "#e5e7eb",
    label: "Dept of Maths",
  },
  {
    id: "medicine",
    name: "Faculty of Medicine",
    position: [17, 0, 0],
    size: [2.2, 4, 3.2],
    roofType: "hip",
    roofColor: "#581c87",
    wallColor: "#f3e8ff",
    label: "Faculty of Medicine",
  },
  {
    id: "electronics",
    name: "Dept of Electronics & Telecommunication Engineering",
    position: [3, 0, 5.3],
    size: [1.2, 4, 1.2],
    roofType: "flat",
    roofColor: "#0f172a",
    wallColor: "#e2e8f0",
    label: "Dept of Electronics & Telecommunication Engineering",
  },
  {
    id: "na1",
    name: "NA1&2",
    position: [18.5, 0, 6.0],
    size: [2.4, 2.0, 2.2],
    roofType: "flat",
    roofColor: "#4b5563",
    wallColor: "#f9fafb",
    label: "NA1&2",
  },
  {
    id: "wala_canteen",
    name: "Wala Canteen",
    position: [-10.0, 0, 5],
    size: [1, 0.8, 1],
    roofType: "shed",
    roofColor: "#831843",
    wallColor: "#fce7f3",
    label: "Wala Canteen",
  },
  {
    id: "material",
    name: "Dept of Material Science & Engineering",
    position: [-9.5, 0, 8.0],
    size: [2.0, 2.4, 2],
    roofType: "flat",
    roofColor: "#111827",
    wallColor: "#d1d5db",
    label: "Material Science",
  },
  {
    id: "chemical",
    name: "Dept of Chemical & Process Engineering",
    position: [-6.5, 0, 9.5],
    size: [3.0, 1.2, 2],
    roofType: "flat",
    roofColor: "#172554",
    wallColor: "#dbeafe",
    label: "Chemical & Process Eng",
  },
  {
    id: "mechanical",
    name: "Dept of Mechanical Engineering",
    position: [-11.5, 0, 12.5],
    size: [7.2, 2.4, 2.8],
    roofType: "shed",
    roofColor: "#27272a",
    wallColor: "#f4f4f5",
    label: "Mechanical Engineering",
  },
  {
    id: "registrar",
    name: "Registrar Office & Examination",
    position: [-4, 0, 14.2],
    size: [1.0, 1.5, 2],
    roofType: "gabled",
    roofColor: "#064e3b",
    wallColor: "#d1fae5",
    label: "Registrar Office",
  },
  {
    id: "admin",
    name: "Admin Building",
    position: [-2.0, 0, 14.5],
    size: [2.0, 2.2, 2.4],
    roofType: "hip",
    roofColor: "#7f1d1d",
    wallColor: "#fff1f2",
    label: "Admin",
  },
  {
    id: "intdesign",
    name: "Dept of Integrated Design",
    position: [5.5, 0, 7.5],
    size: [2.8, 2.2, 1],
    roofType: "flat",
    roofColor: "#14532d",
    wallColor: "#e8f5e9",
    label: "Integrated Design",
  },
  {
    id: "graduate",
    name: "Faculty of Graduate Studies",
    position: [3.5, 0, 10.5],
    size: [2.8, 2.2, 2.2],
    roofType: "flat",
    roofColor: "#312e81",
    wallColor: "#e0e7ff",
    label: "Graduate Studies",
  },
  {
    id: "library",
    name: "Library",
    position: [3.5, 0, 13.5],
    size: [2.8, 2.2, 1.8],
    roofType: "gabled",
    roofColor: "#a16207",
    wallColor: "#fefce8",
    label: "Library",
  },
];

const WALK_BOUNDS = {
  minX: -22,
  maxX: 22,
  minZ: -18,
  maxZ: 20,
};

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

// ─── First-Person Walker ──────────────────────────────────────────────────────

function FirstPersonController({ enabled }: { enabled: boolean }) {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const yaw = useRef(0);
  const pitch = useRef(-0.15);
  const pointerLocked = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    // Set initial walk camera position
    camera.position.set(0, 1.7, 6);

    const onKey = (e: KeyboardEvent, down: boolean) => {
      keys.current[e.code] = down;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!pointerLocked.current) return;
      yaw.current -= e.movementX * 0.002;
      pitch.current -= e.movementY * 0.002;
      pitch.current = clamp(pitch.current, -1.2, 0.4);
    };
    const onPointerLockChange = () => {
      pointerLocked.current = document.pointerLockElement !== null;
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const canvas = target?.closest("canvas") as HTMLCanvasElement | null;
      if (canvas) {
        canvas.requestPointerLock?.();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => onKey(e, true);
    const onKeyUp = (e: KeyboardEvent) => onKey(e, false);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("pointerlockchange", onPointerLockChange);
    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("pointerlockchange", onPointerLockChange);
      document.removeEventListener("click", onClick);
      if (document.exitPointerLock) document.exitPointerLock();
    };
  }, [enabled, camera]);

  useFrame((_, delta) => {
    if (!enabled) return;

    const speed =
      keys.current["ShiftLeft"] || keys.current["ShiftRight"] ? 12 : 6;
    const dt = Math.min(delta, 0.05);

    const euler = new THREE.Euler(pitch.current, yaw.current, 0, "YXZ");
    camera.quaternion.setFromEuler(euler);

    const forward = new THREE.Vector3(0, 0, -1).applyEuler(
      new THREE.Euler(0, yaw.current, 0),
    );
    const right = new THREE.Vector3(1, 0, 0).applyEuler(
      new THREE.Euler(0, yaw.current, 0),
    );

    if (keys.current["KeyW"] || keys.current["ArrowUp"])
      camera.position.addScaledVector(forward, speed * dt);
    if (keys.current["KeyS"] || keys.current["ArrowDown"])
      camera.position.addScaledVector(forward, -speed * dt);
    if (keys.current["KeyA"] || keys.current["ArrowLeft"])
      camera.position.addScaledVector(right, -speed * dt);
    if (keys.current["KeyD"] || keys.current["ArrowRight"])
      camera.position.addScaledVector(right, speed * dt);

    // Keep height fixed at eye level
    camera.position.y = 1.7;
    // Clamp to campus bounds
    camera.position.x = clamp(
      camera.position.x,
      WALK_BOUNDS.minX,
      WALK_BOUNDS.maxX,
    );
    camera.position.z = clamp(
      camera.position.z,
      WALK_BOUNDS.minZ,
      WALK_BOUNDS.maxZ,
    );
  });

  return null;
}

// ─── Building ─────────────────────────────────────────────────────────────────

function Building({
  layout,
  zone,
  selected,
  onClick,
}: {
  layout: ZoneLayout;
  zone: Zone;
  selected: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  const [w, h, d] = layout.size;
  const [px, , pz] = layout.position;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const targetY = hovered || selected ? 0.1 : 0;
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      targetY,
      delta * 5,
    );
  });

  const wallColor = selected ? "#d8eeff" : layout.wallColor;
  const emissive = STATUS_COLORS[zone.status];
  const emissiveInt = selected ? 0.5 : hovered ? 0.3 : 0.08;

  let roofHeight = 0.18;
  if (layout.roofType === "gabled") roofHeight = Math.min(w, d) * 0.35;
  else if (layout.roofType === "hip") roofHeight = Math.min(w, d) * 0.45;

  const totalH = h + roofHeight;

  const Roof = () => {
    if (layout.roofType === "flat") {
      return (
        <mesh position={[0, h + 0.09, 0]}>
          <boxGeometry args={[w + 0.15, 0.18, d + 0.15]} />
          <meshStandardMaterial
            color={layout.roofColor}
            roughness={0.5}
            metalness={0.1}
          />
        </mesh>
      );
    }
    if (layout.roofType === "gabled") {
      const run = d / 2;
      const slopeLen = Math.hypot(run, roofHeight);
      const angle = Math.atan2(roofHeight, run);
      return (
        <group position={[0, h, 0]}>
          <mesh
            rotation={[angle, 0, 0]}
            position={[0, roofHeight / 2, run / 2]}
          >
            <boxGeometry args={[w + 0.3, 0.14, slopeLen + 0.1]} />
            <meshStandardMaterial color={layout.roofColor} roughness={0.6} />
          </mesh>
          <mesh
            rotation={[-angle, 0, 0]}
            position={[0, roofHeight / 2, -run / 2]}
          >
            <boxGeometry args={[w + 0.3, 0.14, slopeLen + 0.1]} />
            <meshStandardMaterial color={layout.roofColor} roughness={0.6} />
          </mesh>
        </group>
      );
    }
    if (layout.roofType === "hip") {
      return (
        <mesh
          position={[0, h + roofHeight / 2, 0]}
          rotation={[0, Math.PI / 4, 0]}
        >
          <coneGeometry args={[Math.max(w, d) * 0.75 + 0.15, roofHeight, 4]} />
          <meshStandardMaterial color={layout.roofColor} roughness={0.6} />
        </mesh>
      );
    }
    return (
      <mesh position={[0, h + 0.05, 0]} rotation={[0.12, 0, 0]}>
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
        const wy = 0.55 + r * ((h - 0.5) / rows);
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
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial
            color={wallColor}
            emissive={emissive}
            emissiveIntensity={emissiveInt}
            roughness={0.55}
            metalness={0.08}
          />
        </mesh>
        <Windows />
        <Roof />
        <mesh position={[0, totalH + 0.4, 0]}>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshStandardMaterial
            color={STATUS_COLORS[zone.status]}
            emissive={STATUS_GLOW[zone.status]}
            emissiveIntensity={1.0}
          />
        </mesh>
        <Html center position={[0, totalH + 1.1, 0]}>
          <div
            style={{
              background: "rgba(7,25,82,0.88)",
              border: `1px solid ${selected ? STATUS_COLORS[zone.status] : "#35A29F55"}`,
              color: "#fff",
              fontSize: "10px",
              fontWeight: 600,
              padding: "2px 7px",
              borderRadius: "5px",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              boxShadow: selected
                ? `0 0 10px ${STATUS_COLORS[zone.status]}88`
                : "none",
            }}
          >
            {layout.label}
          </div>
        </Html>
      </group>
    </group>
  );
}

// Roads

function Roads() {
  const road = { color: "#5a5a5a", roughness: 0.95 };
  const pave = { color: "#888888", roughness: 0.9 };
  const markings = { color: "#ffffff", roughness: 0.8 };

  const RoadPlane = ({
    x,
    z,
    w,
    d,
    rot = 0,
    type = "road",
  }: {
    x: number;
    z: number;
    w: number;
    d: number;
    rot?: number;
    type?: "road" | "pave";
  }) => (
    <mesh
      rotation={[-Math.PI / 2, 0, rot]}
      position={[x, 0.006, z]}
      receiveShadow
    >
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial {...(type === "road" ? road : pave)} />
    </mesh>
  );

  // Centre-line dashes for main street
  const Dashes = () => {
    const dashes = [];
    for (let z = -11; z < 16; z += 1.4) {
      dashes.push(
        <mesh
          key={z}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0.0, 0.008, z]}
        >
          <planeGeometry args={[0.06, 0.7]} />
          <meshStandardMaterial {...markings} opacity={0.6} transparent />
        </mesh>,
      );
    }
    return <>{dashes}</>;
  };

  // Centre-line dashes for horizontal roads (X direction)
  const DashesHorizontal = () => {
    const dashes = [];
    for (let x = -19; x < 16; x += 1.4) {
      dashes.push(
        <mesh
          key={x}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]} // rotate to align along X
          position={[2.0 + x, 0.008, 17.0]} // align with your south road
        >
          <planeGeometry args={[0.06, 0.7]} />
          <meshStandardMaterial {...markings} opacity={0.6} transparent />
        </mesh>,
      );
    }
    return <>{dashes}</>;
  };

  return (
    <group>
      {/* ── MAIN STREET — vertical */}
      <RoadPlane x={0} z={3.0} w={1.3} d={30} />
      <Dashes />

      {/* ── Main Road ── */}
      <RoadPlane x={0.0} z={17.0} w={36} d={2.4} />
      <DashesHorizontal />

      {/* ── CROSS ROAD D: Chemical */}
      <RoadPlane x={-3.1} z={9.5} w={5} d={0.6} type="pave" />

      {/* ── BOTTOM RIGHT — Integrated ── */}
      <RoadPlane x={4.5} z={8.5} w={9} d={1.0} />

      {/* ── MECHANICAL / SIDE ENTRANCE spur west ── */}
      <RoadPlane x={-11} z={14.5} w={10} d={0.9} />
      <RoadPlane x={-6.0} z={15.5} w={0.9} d={3} />
      <RoadPlane x={-16.0} z={8.45} w={1.0} d={13} />

      {/* Roads Sumandasa block ── */}
      <RoadPlane x={-6} z={6.5} w={12} d={1} />
      <RoadPlane x={-8} z={2.5} w={16} d={1} />
      <RoadPlane x={-12.0} z={4.5} w={1.0} d={5} />

      {/* Roads Civil and others ── */}
      <RoadPlane x={3.0} z={6.5} w={6} d={1} />
      <RoadPlane x={6.0} z={4} w={1} d={6} />
      <RoadPlane x={10.5} z={1} w={10} d={1} />
      <RoadPlane x={15} z={-8} w={1} d={18} />
      <RoadPlane x={3.0} z={-11.5} w={6} d={1} />
      <RoadPlane x={6.0} z={-14} w={1} d={6} />
      <RoadPlane x={10.0} z={-16.5} w={9} d={1} />

      {/* Roads L canteen and business ── */}
      <RoadPlane x={3.1} z={1} w={4.9} d={1} type="pave" />

      {/* Roads NA1 and NA2 ── */}
      <RoadPlane x={11.5} z={6} w={10} d={1} />

      {/* Roads Fac. of Medicine ── */}
      <RoadPlane x={16.5} z={4} w={1} d={5} />

      {/* Roads dept.of Maths ── */}
      <RoadPlane x={2.1} z={-3} w={3} d={1} type="pave" />
    </group>
  );
}

// ─── Ground ───────────────────────────────────────────────────────────────────

function Ground() {
  return (
    <>
      {/* Main grass */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#4a8a38" roughness={0.96} />
      </mesh>
      {/* Sports field grass (brighter) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-8.5, 0.005, -7]}>
        <planeGeometry args={[7, 5]} />
        <meshStandardMaterial color="#3a9a30" roughness={0.9} />
      </mesh>
      <Html center position={[-8.5, 0.45, -7]}>
        <div
          style={{
            background: "rgba(7,25,82,0.88)",
            border: "1px solid #35A29F55",
            color: "#fff",
            fontSize: "10px",
            fontWeight: 600,
            padding: "2px 7px",
            borderRadius: "5px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          Play Ground
        </div>
      </Html>
      {/* Sports field lines */}
      {[-2, 0, 2].map((x) => (
        <mesh
          key={x}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[x - 8.5, 0.007, -7]}
        >
          <planeGeometry args={[0.06, 4.5]} />
          <meshStandardMaterial color="#ffffff" opacity={0.4} transparent />
        </mesh>
      ))}
    </>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function CampusScene({
  zones,
  selectedId,
  onSelect,
  walkMode,
}: {
  zones: Zone[];
  selectedId: string;
  onSelect: (id: string) => void;
  walkMode: boolean;
}) {
  return (
    <>
      <color attach="background" args={["#c0d4ee"]} />
      <fog attach="fog" args={["#c0d4ee", 30, 70]} />

      <ambientLight intensity={1.1} />
      <directionalLight
        position={[12, 20, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-camera-near={0.5}
        shadow-camera-far={70}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />
      <directionalLight
        position={[-10, 12, -8]}
        intensity={0.35}
        color="#ddeeff"
      />
      <hemisphereLight args={["#c8daf0", "#3a7030", 0.5]} />

      <Ground />
      <Roads />
      <CampusTrees />

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
          maxDistance={38}
          maxPolarAngle={Math.PI / 2.15}
          autoRotate={false}
          target={[1, 0, 1]}
        />
      )}
    </>
  );
}

// Dashboard

const INITIAL_ZONES: Zone[] = [
  {
    id: "lagaan",
    name: "Lagaan",
    energyKw: 46.0,
    occupancy: 52,
    temperatureC: 29.1,
    status: "normal",
  },
  {
    id: "textile",
    name: "Dept of Textile",
    energyKw: 58.4,
    occupancy: 60,
    temperatureC: 29.5,
    status: "normal",
  },
  {
    id: "civil",
    name: "Dept of Civil",
    energyKw: 62.1,
    occupancy: 65,
    temperatureC: 29.8,
    status: "normal",
  },
  {
    id: "transport",
    name: "Dept of Transport",
    energyKw: 35.0,
    occupancy: 45,
    temperatureC: 29.0,
    status: "normal",
  },
  {
    id: "Goda canteen",
    name: "Goda Canteen",
    energyKw: 85.0,
    occupancy: 75,
    temperatureC: 34.5,
    status: "busy",
  },
  {
    id: "Sentra",
    name: "Sentra Court",
    energyKw: 80.0,
    occupancy: 70,
    temperatureC: 33.5,
    status: "busy",
  },
  {
    id: "canteen",
    name: "L Canteen",
    energyKw: 92.0,
    occupancy: 90,
    temperatureC: 36.0,
    status: "critical",
  },
  {
    id: "hostel_a",
    name: "Hostel A",
    energyKw: 95.1,
    occupancy: 78,
    temperatureC: 32.0,
    status: "busy",
  },
  {
    id: "conference",
    name: "Multipurpose Hall",
    energyKw: 38.5,
    occupancy: 55,
    temperatureC: 28.5,
    status: "normal",
  },
  {
    id: "it",
    name: "Faculty of IT",
    energyKw: 76.5,
    occupancy: 72,
    temperatureC: 31.5,
    status: "busy",
  },
  {
    id: "electronics",
    name: "Dept of Electronics",
    energyKw: 54.0,
    occupancy: 60,
    temperatureC: 30.2,
    status: "normal",
  },
  {
    id: "hostel",
    name: "Hostel",
    energyKw: 86.0,
    occupancy: 68,
    temperatureC: 31.0,
    status: "busy",
  },
  {
    id: "na1",
    name: "NA1&NA2",
    energyKw: 79.0,
    occupancy: 66,
    temperatureC: 30.4,
    status: "busy",
  },
  {
    id: "maths",
    name: "Dept of Maths",
    energyKw: 63.0,
    occupancy: 59,
    temperatureC: 29.7,
    status: "normal",
  },
  {
    id: "medicine",
    name: "Faculty of Medicine",
    energyKw: 77.0,
    occupancy: 73,
    temperatureC: 31.8,
    status: "busy",
  },
  {
    id: "admin",
    name: "Admin Building",
    energyKw: 38.5,
    occupancy: 55,
    temperatureC: 28.5,
    status: "normal",
  },
  {
    id: "cse",
    name: "Dept of CSE",
    energyKw: 82.3,
    occupancy: 76,
    temperatureC: 31.2,
    status: "busy",
  },
  {
    id: "wala_canteen",
    name: "Wala Canteen",
    energyKw: 55.0,
    occupancy: 80,
    temperatureC: 33.5,
    status: "busy",
  },
  {
    id: "buildeco",
    name: "Faculty of Business",
    energyKw: 50.0,
    occupancy: 58,
    temperatureC: 29.0,
    status: "normal",
  },
  {
    id: "material",
    name: "Dept of Material",
    energyKw: 65.0,
    occupancy: 62,
    temperatureC: 30.0,
    status: "normal",
  },
  {
    id: "chemical",
    name: "Dept of Chemical",
    energyKw: 70.2,
    occupancy: 67,
    temperatureC: 30.8,
    status: "busy",
  },
  {
    id: "mechanical",
    name: "Dept of Mechanical",
    energyKw: 68.0,
    occupancy: 64,
    temperatureC: 30.4,
    status: "normal",
  },
  {
    id: "registrar",
    name: "Reg. & Exam Office",
    energyKw: 32.0,
    occupancy: 40,
    temperatureC: 28.0,
    status: "normal",
  },
  {
    id: "intdesign",
    name: "Dept of Integrated",
    energyKw: 48.0,
    occupancy: 57,
    temperatureC: 29.2,
    status: "normal",
  },
  {
    id: "graduate",
    name: "Faculty of Graduate Studies",
    energyKw: 52.0,
    occupancy: 62,
    temperatureC: 29.8,
    status: "normal",
  },
  {
    id: "library",
    name: "Library",
    energyKw: 58.0,
    occupancy: 82,
    temperatureC: 30.5,
    status: "busy",
  },
];

export default function DigitalTwinDashboard() {
  const [zones, setZones] = useState<Zone[]>(INITIAL_ZONES);
  const [selectedId, setSelectedId] = useState<string>("it");
  const [walkMode, setWalkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const t = setInterval(() => setZones((prev) => prev.map(updateZone)), 5000);
    return () => clearInterval(t);
  }, []);

  const toggleWalkMode = useCallback(() => {
    setWalkMode((v) => !v);
  }, []);

  const selectedZone = zones.find((z) => z.id === selectedId) ?? zones[0];
  const campusLoad = zones.reduce((a, z) => a + z.energyKw, 0);
  const campusOcc = Math.round(
    zones.reduce((a, z) => a + z.occupancy, 0) / zones.length,
  );
  const criticalCount = zones.filter((z) => z.status === "critical").length;

  const filteredZones = zones.filter((z) =>
    z.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        background: "#071952",
        overflow: "hidden",
        color: "#fff",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* ── Sidebar ── */}
      <nav
        style={{
          width: 300,
          flexShrink: 0,
          background: "rgba(11,102,106,0.18)",
          borderRight: "1px solid rgba(53,162,159,0.3)",
          display: "flex",
          flexDirection: "column",
          padding: 14,
          gap: 10,
          overflowY: "auto",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 2,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "#97FEED",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Building2 color="#071952" size={20} />
          </div>
          <span
            style={{ fontWeight: 700, fontSize: 19, letterSpacing: "-0.5px" }}
          >
            UOM<span style={{ color: "#97FEED" }}>Twin</span>
          </span>
          <span
            style={{
              marginLeft: "auto",
              fontSize: 9,
              color: "#97FEED88",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            UoM
          </span>
        </div>

        {/* Search */}
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search zones"
          placeholder="Search zones..."
          style={{
            background: "rgba(7,25,82,0.5)",
            border: "1px solid rgba(53,162,159,0.3)",
            borderRadius: 8,
            padding: "7px 10px",
            color: "#fff",
            fontSize: 11,
            outline: "none",
          }}
        />

        {/* Zone list */}
        <p
          style={{
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "#97FEED",
            fontWeight: 700,
            marginBottom: 4,
          }}
        >
          Zone Status Panel ({filteredZones.length})
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 6,
            flex: 1,
            alignItems: "start",
          }}
        >
          {filteredZones.map((zone) => {
            const active = zone.id === selectedId;
            return (
              <button
                key={zone.id}
                onClick={() => setSelectedId(zone.id)}
                style={{
                  background: active
                    ? "rgba(11,102,106,0.85)"
                    : "rgba(7,25,82,0.35)",
                  border: `1px solid ${active ? "#97FEED" : "rgba(53,162,159,0.18)"}`,
                  borderRadius: 8,
                  padding: "6px 8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.2s",
                  textAlign: "left",
                  minWidth: 0,
                  minHeight: 36,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: STATUS_COLORS[zone.status],
                    boxShadow: `0 0 4px ${STATUS_COLORS[zone.status]}`,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 9,
                    color: "#fff",
                    lineHeight: 1.2,
                    flex: 1,
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {zone.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Zone detail */}
        <div
          style={{
            borderRadius: 14,
            border: "1px solid #97FEED",
            background: "#0B666A",
            padding: 16,
            flexShrink: 0,
          }}
        >
          <p
            style={{
              fontSize: 9,
              color: "rgba(0,0,0,0.55)",
              fontWeight: 700,
              textTransform: "uppercase",
              marginBottom: 3,
            }}
          >
            Selected Zone
          </p>
          <p
            style={{
              fontSize: 15,
              fontWeight: 700,
              marginBottom: 12,
              lineHeight: 1.3,
            }}
          >
            {selectedZone.name}
          </p>
          <div
            style={{
              background: "rgba(7,25,82,0.5)",
              borderRadius: 8,
              border: "1px solid rgba(53,162,159,0.35)",
              padding: 12,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              fontSize: 12,
              fontFamily: "monospace",
            }}
          >
            {[
              [
                "STATUS",
                selectedZone.status.toUpperCase(),
                STATUS_COLORS[selectedZone.status],
              ],
              ["Energy", `${selectedZone.energyKw.toFixed(1)} kW`, "#97FEED"],
              ["Occupancy", `${selectedZone.occupancy}%`, "#97FEED"],
              ["Temperature", `${selectedZone.temperatureC}°C`, "#97FEED"],
            ].map(([label, value, color], i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: i < 3 ? 8 : 0,
                  borderBottom:
                    i < 3 ? "1px solid rgba(53,162,159,0.2)" : "none",
                }}
              >
                <span style={{ color: "#97FEED" }}>{label}</span>
                <span style={{ color, fontWeight: 700 }}>{value}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <div
              style={{
                fontSize: 9,
                color: "#fff",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 5,
              }}
            >
              Capacity
            </div>
            <div
              style={{
                height: 10,
                borderRadius: 5,
                background: "rgba(7,25,82,0.8)",
                border: "1px solid rgba(53,162,159,0.35)",
                padding: 2,
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 3,
                  background: STATUS_COLORS[selectedZone.status],
                  width: `${selectedZone.occupancy}%`,
                  transition: "width 0.6s ease",
                }}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* ── Main ── */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: 14,
          minWidth: 0,
        }}
      >
        {/* Header */}
        <header
          style={{
            background: "rgba(11,102,106,0.35)",
            border: "1px solid rgba(53,162,159,0.3)",
            borderRadius: 14,
            padding: "12px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
            flexShrink: 0,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 9,
                color: "#97FEED",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                fontWeight: 700,
              }}
            >
              Group I3 Demo • University of Moratuwa
            </p>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: "2px 0" }}>
              Smart Campus Twin Control
            </h1>
            <p style={{ fontSize: 11, color: "rgba(151,254,237,0.75)" }}>
              Real-time 3D campus — occupancy · temperature · energy states
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              minWidth: 300,
            }}
          >
            {[
              ["Campus Energy", `${campusLoad.toFixed(1)} kW`],
              ["Avg Occupancy", `${campusOcc}%`],
              ["Active Zones", `${zones.length}`],
              [
                "Alerts",
                criticalCount > 0 ? `${criticalCount} critical` : "None",
              ],
            ].map(([label, val]) => (
              <div
                key={label}
                style={{
                  background: "rgba(7,25,82,0.55)",
                  border: "1px solid rgba(53,162,159,0.3)",
                  borderRadius: 9,
                  padding: "7px 12px",
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    color: "rgba(151,254,237,0.8)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontWeight: 700,
                    marginBottom: 2,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    fontFamily: "monospace",
                    color:
                      label === "Alerts" && criticalCount > 0
                        ? STATUS_COLORS.critical
                        : "#97FEED",
                  }}
                >
                  {val}
                </div>
              </div>
            ))}
          </div>
        </header>

        {/* 3D Canvas */}
        <section
          style={{
            flex: 1,
            borderRadius: 14,
            border: "1px solid rgba(53,162,159,0.3)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Toolbar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "rgba(11,102,106,0.8)",
              borderBottom: "1px solid rgba(53,162,159,0.4)",
              padding: "7px 14px",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              color: "#97FEED",
              fontWeight: 700,
              gap: 12,
            }}
          >
            <span>3D Campus Twin — University of Moratuwa</span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {walkMode && (
                <span style={{ fontSize: 9, color: "#FAC75A", opacity: 0.9 }}>
                  Click canvas → WASD/Arrow keys to move · Mouse to look · Shift
                  for speed
                </span>
              )}
              <button
                onClick={toggleWalkMode}
                style={{
                  background: walkMode ? "#97FEED" : "rgba(7,25,82,0.7)",
                  border: `1px solid ${walkMode ? "#97FEED" : "rgba(53,162,159,0.5)"}`,
                  borderRadius: 7,
                  padding: "5px 12px",
                  color: walkMode ? "#071952" : "#97FEED",
                  cursor: "pointer",
                  fontSize: 10,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {walkMode ? <Eye size={12} /> : <Navigation size={12} />}
                {walkMode ? "Orbit Mode" : "Walk Mode"}
              </button>
              {!walkMode && (
                <span style={{ fontSize: 9, opacity: 0.7 }}>
                  Drag · Scroll · Click
                </span>
              )}
            </div>
          </div>

          <Canvas
            camera={{ position: [10, 12, 18], fov: 52 }}
            shadows={{type: THREE.PCFShadowMap}}
            style={{ width: "100%", height: "100%" }}
          >
            <CampusScene
              zones={zones}
              selectedId={selectedId}
              onSelect={setSelectedId}
              walkMode={walkMode}
            />
          </Canvas>

          {/* Legend */}
          <div
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
              zIndex: 10,
              background: "rgba(7,25,82,0.85)",
              border: "1px solid rgba(53,162,159,0.3)",
              borderRadius: 8,
              padding: "8px 12px",
              display: "flex",
              gap: 12,
              fontSize: 10,
            }}
          >
            {(["normal", "busy", "critical"] as ZoneStatus[]).map((s) => (
              <div
                key={s}
                style={{ display: "flex", alignItems: "center", gap: 5 }}
              >
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: STATUS_COLORS[s],
                    boxShadow: `0 0 5px ${STATUS_COLORS[s]}`,
                  }}
                />
                <span style={{ color: "#97FEED", textTransform: "capitalize" }}>
                  {s}
                </span>
              </div>
            ))}
          </div>

          {/* Walk mode compass */}
          {walkMode && (
            <div
              style={{
                position: "absolute",
                bottom: 10,
                left: 10,
                zIndex: 10,
                background: "rgba(7,25,82,0.85)",
                border: "1px solid rgba(53,162,159,0.35)",
                borderRadius: 8,
                padding: "8px 14px",
                fontSize: 9,
                color: "#97FEED",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "2px 14px",
                }}
              >
                <span>W / ↑</span>
                <span style={{ color: "#fff" }}>Forward</span>
                <span>S / ↓</span>
                <span style={{ color: "#fff" }}>Backward</span>
                <span>A / ←</span>
                <span style={{ color: "#fff" }}>Left</span>
                <span>D / →</span>
                <span style={{ color: "#fff" }}>Right</span>
                <span>Shift</span>
                <span style={{ color: "#fff" }}>Run</span>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
