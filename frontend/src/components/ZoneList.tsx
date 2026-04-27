"use client";

import { Zap, Users, Thermometer } from "lucide-react";
import { Zone, STATUS_COLORS } from "@/types/campus";

type ZoneListProps = {
  zones: Zone[];
  selectedZoneId: string;
  onSelect: (id: string) => void;
};

export default function ZoneList({ zones, selectedZoneId, onSelect }: ZoneListProps) {
  return (
    <div className="flex flex-col flex-grow min-h-0">
      <h2 className="text-xs uppercase tracking-[0.2em] text-[#97FEED] font-bold mb-4">
        Zone Status Panel
      </h2>
      <div className="grid gap-3 flex-1 overflow-y-auto pr-1">
        {zones.map((zone) => {
          const active = selectedZoneId === zone.id;
          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => onSelect(zone.id)}
              className={`rounded-xl border p-4 text-left transition-all duration-300 ${
                active
                  ? "border-[#97FEED] bg-[#0B666A]/90 shadow-[0_0_15px_rgba(151,254,237,0.2)]"
                  : "border-[#35A29F]/40 bg-[#071952]/50 hover:border-[#97FEED]/60"
              }`}
            >
              <div className="flex items-center justify-between text-base font-semibold text-white">
                <span>{zone.name}</span>
                <span
                  className="h-3 w-3 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                  style={{ backgroundColor: STATUS_COLORS[zone.status] }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
