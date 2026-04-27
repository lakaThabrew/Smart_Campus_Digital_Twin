"use client";

import { LayoutDashboard, Building2, ShieldAlert, BarChart3, Settings, HelpCircle } from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Control Center", active: true },
  { icon: Building2, label: "Building Management", active: false },
  { icon: ShieldAlert, label: "Security & Alerts", active: false },
  { icon: BarChart3, label: "Energy Analytics", active: false },
  { icon: Settings, label: "System Settings", active: false },
];

export default function Sidebar() {
  return (
    <nav className="w-20 lg:w-64 bg-[#0B666A]/20 border-r border-[#35A29F]/30 flex flex-col p-4 gap-8">
      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-xl bg-[#97FEED] flex items-center justify-center shadow-[0_0_15px_#97FEED]">
          <Building2 className="text-[#071952]" size={24} />
        </div>
        <span className="hidden lg:block font-bold text-xl tracking-tight">SCT<span className="text-[#97FEED]">Twin</span></span>
      </div>

      <div className="flex-1 flex flex-col gap-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${
              item.active 
                ? "bg-[#35A29F] text-white shadow-lg" 
                : "text-[#97FEED]/60 hover:bg-[#35A29F]/10 hover:text-[#97FEED]"
            }`}
          >
            <item.icon size={22} className="shrink-0" />
            <span className="hidden lg:block font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <button className="flex items-center gap-4 p-3 text-[#97FEED]/60 hover:text-[#97FEED]">
          <HelpCircle size={22} />
          <span className="hidden lg:block">Support</span>
        </button>
        <div className="mt-4 p-4 rounded-2xl bg-[#071952]/40 border border-[#35A29F]/20 hidden lg:block text-center">
            <p className="text-[10px] uppercase text-[#97FEED]/40 font-bold mb-2">System Status</p>
            <p className="text-xs font-mono text-[#97FEED]">Node-01 Active</p>
        </div>
      </div>
    </nav>
  );
}
