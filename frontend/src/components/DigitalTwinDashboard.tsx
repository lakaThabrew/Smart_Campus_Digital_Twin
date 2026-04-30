"use client";

import { useEffect, useMemo, useState } from "react";
import { Zone, updateZone, STATUS_COLORS, CAMPUS_LAYOUT } from "@/types/campus";
import { Building2 } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";

export default function DigitalTwinDashboard() {
  const initialZones = useMemo<Zone[]>(
    () => [
      {
        id: "eng",
        name: "Engineering Block",
        energyKw: 74.5,
        occupancy: 58,
        temperatureC: 29.4,
        status: "normal",
      },
      {
        id: "library",
        name: "Central Library",
        energyKw: 63.8,
        occupancy: 78,
        temperatureC: 30.1,
        status: "busy",
      },
      {
        id: "hostel",
        name: "Hostel Cluster",
        energyKw: 88.3,
        occupancy: 71,
        temperatureC: 31.7,
        status: "busy",
      },
      {
        id: "sports",
        name: "Sports Complex",
        energyKw: 43.6,
        occupancy: 34,
        temperatureC: 27.8,
        status: "normal",
      },
    ],
    [],
  );

  const [zones, setZones] = useState<Zone[]>(initialZones);
  const [selectedZoneId, setSelectedZoneId] = useState<string>(
    initialZones[0].id,
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setZones((prev) => prev.map(updateZone));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const selectedZone =
    zones.find((zone) => zone.id === selectedZoneId) ?? zones[0];
  const campusLoad = zones.reduce((acc, zone) => acc + zone.energyKw, 0);
  const campusOccupancy = Math.round(
    zones.reduce((acc, zone) => acc + zone.occupancy, 0) / zones.length,
  );

  return (
    <div className="flex h-screen w-full bg-[#071952] overflow-hidden text-white font-sans">
      {/* Sidebar */}
      <nav className="w-80 lg:w-96 bg-[#0B666A]/20 border-r border-[#35A29F]/30 flex flex-col p-4 gap-4 overflow-hidden">
        <div className="flex items-center gap-3 px-2 mb-2 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#97FEED] flex items-center justify-center shadow-[0_0_15px_#97FEED]">
            <Building2 className="text-[#071952]" size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight">SCT<span className="text-[#97FEED]">Twin</span></span>
        </div>

        {/* Zone List */}
        <div className="flex-grow overflow-y-auto min-h-0">
          <div className="flex flex-col flex-grow min-h-0">
            <h2 className="text-xs uppercase tracking-[0.2em] text-[#97FEED] font-bold mb-4">
              Zone Status Panel
            </h2>
            <div className="grid grid-cols-2 gap-2 flex-1 overflow-y-auto pr-1">
              {zones.map((zone) => {
                const active = selectedZoneId === zone.id;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setSelectedZoneId(zone.id)}
                    className={`rounded-lg border p-1.5 text-left transition-all duration-300 flex flex-col items-center gap-1 ${
                      active
                        ? "border-[#97FEED] bg-[#0B666A]/90 shadow-[0_0_10px_rgba(151,254,237,0.2)]"
                        : "border-[#35A29F]/20 bg-[#071952]/30 hover:border-[#97FEED]/40"
                    }`}
                  >
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: STATUS_COLORS[zone.status] }}
                    />
                    <span className="text-[10px] font-medium text-white text-center leading-tight break-words w-full">
                      {zone.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Zone Detail */}
        <div className="shrink-0">
          <div className="rounded-2xl border border-[#97FEED] bg-[#0B666A] p-6 shadow-[0_0_30px_rgba(53,162,159,0.3)] relative overflow-hidden shrink-0 min-h-[250px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#97FEED] opacity-10 rounded-full blur-3xl" />
            <h3 className="text-xs uppercase tracking-[0.2em] text-black font-bold mb-1 opacity-70">
              Selected Zone Detail
            </h3>
            <p className="text-2xl font-bold text-white mb-4">
              {selectedZone.name}
            </p>
            
            <div className="space-y-4 text-sm text-white font-mono bg-[#071952]/60 p-4 rounded-xl border border-[#35A29F]/50 shadow-inner">
              <div className="flex justify-between items-center pb-3 border-b border-[#35A29F]/30">
                  <span className="text-[#97FEED] font-bold tracking-wider">STATUS</span> 
                  <span className="font-bold border px-2 py-0.5 rounded" style={{color: STATUS_COLORS[selectedZone.status], borderColor: STATUS_COLORS[selectedZone.status]}}>{selectedZone.status.toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#35A29F]/30">
                  <span className="text-[#97FEED]">Energy Load</span>
                  <span className="text-white font-bold">{selectedZone.energyKw.toFixed(1)} kW</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#35A29F]/30">
                  <span className="text-[#97FEED]">Occupancy</span>
                  <span className="text-white font-bold">{selectedZone.occupancy}%</span>
              </div>
              <div className="flex justify-between items-center">
                  <span className="text-[#97FEED]">Temperature</span>
                  <span className="text-white font-bold">{selectedZone.temperatureC}&deg;C</span>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col gap-2">
              <div className="flex justify-between text-[10px] uppercase font-bold text-white tracking-widest">
                  <span>Capacity</span>
              </div>
              <div className="h-3 rounded-full bg-[#071952] border border-[#35A29F]/50 p-0.5">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-in-out relative flex items-center justify-end pr-1"
                  style={{
                    width: `${selectedZone.occupancy}%`,
                    backgroundColor: STATUS_COLORS[selectedZone.status],
                  }}
                >
                    <span className="text-[8px] font-bold text-[#071952] opacity-50 block leading-none">{selectedZone.occupancy}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="flex-1 flex flex-col gap-4 p-4 lg:p-6 min-w-0">
        {/* Dashboard Header */}
        <header className="grid gap-4 rounded-2xl border border-[#35A29F]/30 bg-[#0B666A]/40 backdrop-blur-md p-5 shadow-[0_0_20px_rgba(11,102,106,0.3)] md:grid-cols-[1fr_auto] z-10 shrink-0">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#97FEED] font-bold">
              Group I3 Demo
            </p>
            <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl tracking-wide">
              Smart Campus Twin Control
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-[#97FEED]/80">
              Real-time 3D campus visualization with live occupancy, temperature, and energy states.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm min-w-[400px]">
            <div className="rounded-xl border border-[#35A29F] bg-[#071952]/60 px-4 py-2 flex flex-col justify-center shadow-inner">
              <div className="text-[#97FEED]/80 text-[10px] uppercase tracking-wider mb-1 font-bold">Campus Energy</div>
              <div className="text-lg font-mono font-bold text-white">
                {campusLoad.toFixed(1)} kW
              </div>
            </div>
            <div className="rounded-xl border border-[#35A29F] bg-[#071952]/60 px-4 py-2 flex flex-col justify-center shadow-inner">
              <div className="text-[#97FEED]/80 text-[10px] uppercase tracking-wider mb-1 font-bold">Avg Occupancy</div>
              <div className="text-lg font-mono font-bold text-white">
                {campusOccupancy}%
              </div>
            </div>
            <div className="rounded-xl border border-[#35A29F] bg-[#071952]/60 px-4 py-2 flex flex-col justify-center shadow-inner">
              <div className="text-[#97FEED]/80 text-[10px] uppercase tracking-wider mb-1 font-bold">Active Zones</div>
              <div className="text-lg font-mono font-bold text-white">
                {zones.length}
              </div>
            </div>
            <div className="rounded-xl border border-[#35A29F] bg-[#071952]/60 px-4 py-2 flex flex-col justify-center shadow-inner relative overflow-hidden">
              <div className="text-[#97FEED]/80 text-[10px] uppercase tracking-wider mb-1 font-bold">System Status</div>
              <div className="text-lg font-mono font-bold text-[#97FEED] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#97FEED] animate-ping" /> ONLINE
              </div>
            </div>
          </div>
        </header>

        <section className="flex-1 min-h-0">
          <div className="relative h-full w-full rounded-2xl border border-[#35A29F]/30 bg-[#071952] shadow-[0_0_20px_rgba(11,102,106,0.3)] overflow-hidden flex flex-col">
            <div className="absolute top-0 w-full flex items-center justify-between bg-[#0B666A]/80 backdrop-blur-sm border-b border-[#35A29F]/50 z-10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#97FEED] font-bold">
              <span>3D Campus Twin Visualization</span>
              <span>Rotate & Click to Inspect</span>
            </div>
            <div className="flex-1 w-full bg-[#071952]">
              {/* Campus Twin Scene */}
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
                          setSelectedZoneId(zone.id);
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
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
