"use client";

import { Zone, STATUS_COLORS } from "@/types/campus";

type ZoneDetailProps = {
  selectedZone: Zone;
};

export default function ZoneDetail({ selectedZone }: ZoneDetailProps) {
  return (
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
  );
}
