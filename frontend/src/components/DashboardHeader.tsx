"use client";

type DashboardHeaderProps = {
  campusLoad: number;
  campusOccupancy: number;
  activeZonesCount: number;
};

export default function DashboardHeader({
  campusLoad,
  campusOccupancy,
  activeZonesCount,
}: DashboardHeaderProps) {
  return (
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
            {activeZonesCount}
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
  );
}
