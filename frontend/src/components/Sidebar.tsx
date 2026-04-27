"use client";

import { Building2 } from "lucide-react";
import { Zone } from "@/types/campus";
import ZoneList from "./ZoneList";
import ZoneDetail from "./ZoneDetail";

type SidebarProps = {
  zones: Zone[];
  selectedZoneId: string;
  onSelect: (id: string) => void;
  selectedZone: Zone;
};

export default function Sidebar({ zones, selectedZoneId, onSelect, selectedZone }: SidebarProps) {
  return (
    <nav className="w-80 lg:w-96 bg-[#0B666A]/20 border-r border-[#35A29F]/30 flex flex-col p-4 gap-4 overflow-hidden">
      <div className="flex items-center gap-3 px-2 mb-2 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-[#97FEED] flex items-center justify-center shadow-[0_0_15px_#97FEED]">
          <Building2 className="text-[#071952]" size={24} />
        </div>
        <span className="font-bold text-xl tracking-tight">SCT<span className="text-[#97FEED]">Twin</span></span>
      </div>

      <div className="flex-grow overflow-y-auto min-h-0">
        <ZoneList 
          zones={zones} 
          selectedZoneId={selectedZoneId} 
          onSelect={onSelect} 
        />
      </div>

      <div className="shrink-0">
        <ZoneDetail selectedZone={selectedZone} />
      </div>
    </nav>
  );
}
