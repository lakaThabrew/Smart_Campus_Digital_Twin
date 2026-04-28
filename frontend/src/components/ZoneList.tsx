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
      <div className="grid grid-cols-2 gap-2 flex-1 overflow-y-auto pr-1">
        {zones.map((zone) => {
          const active = selectedZoneId === zone.id;
          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => onSelect(zone.id)}
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
  );
}
