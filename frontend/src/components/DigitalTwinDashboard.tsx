"use client";

import { useEffect, useMemo, useState } from "react";
import { Zone, updateZone } from "@/types/campus";
import CampusTwinScene from "./CampusTwinScene";
import ZoneList from "./ZoneList";
import ZoneDetail from "./ZoneDetail";
import DashboardHeader from "./DashboardHeader";

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
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const selectedZone =
    zones.find((zone) => zone.id === selectedZoneId) ?? zones[0];
  const campusLoad = zones.reduce((acc, zone) => acc + zone.energyKw, 0);
  const campusOccupancy = Math.round(
    zones.reduce((acc, zone) => acc + zone.occupancy, 0) / zones.length,
  );

  return (
    <div className="mx-auto flex h-screen w-full flex-col gap-4 p-4 lg:p-6 bg-[#071952] overflow-hidden text-white font-sans">
      <DashboardHeader 
        campusLoad={campusLoad} 
        campusOccupancy={campusOccupancy} 
        activeZonesCount={zones.length} 
      />

      <section className="grid flex-1 gap-4 lg:grid-cols-[1.5fr_0.8fr] min-h-0">
        <div className="relative rounded-2xl border border-[#35A29F]/30 bg-[#071952] shadow-[0_0_20px_rgba(11,102,106,0.3)] overflow-hidden flex flex-col">
          <div className="absolute top-0 w-full flex items-center justify-between bg-[#0B666A]/80 backdrop-blur-sm border-b border-[#35A29F]/50 z-10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#97FEED] font-bold">
            <span>3D Campus Twin</span>
            <span>Orbit + Click Building</span>
          </div>
          <div className="flex-1 w-full bg-[#071952]">
            <CampusTwinScene
              zones={zones}
              selectedZoneId={selectedZoneId}
              onSelect={setSelectedZoneId}
            />
          </div>
        </div>

        <aside className="grid gap-4 overflow-y-auto pr-1">
          <ZoneList 
            zones={zones} 
            selectedZoneId={selectedZoneId} 
            onSelect={setSelectedZoneId} 
          />
          <ZoneDetail selectedZone={selectedZone} />
        </aside>
      </section>
    </div>
  );
}
