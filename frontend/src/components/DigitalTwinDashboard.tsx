"use client";

import { useEffect, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { Navigation, Eye } from "lucide-react";
import { generateInitialZones, Zone } from "./dashboard/DashboardTypes";
import { updateZone } from "./dashboard/DashboardHelpers";
import DashboardSidebar from "./dashboard/DashboardSidebar";
import DashboardHeader from "./dashboard/DashboardHeader";
import DashboardScene from "./dashboard/DashboardScene";

export default function DigitalTwinDashboard() {
  const [zones, setZones] = useState<Zone[]>(generateInitialZones());
  const [selectedId, setSelectedId] = useState<string>("it");
  const [walkMode, setWalkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "Departments",
  ]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const categories = {
    Departments: [
      "cse",
      "it",
      "civil",
      "textile",
      "transport",
      "electronics",
      "maths",
      "medicine",
      "material",
      "chemical",
      "mechanical",
      "intdesign",
      "graduate",
      "buildeco",
    ],
    Canteens: ["Goda canteen", "Sentra", "canteen", "wala_canteen"],
    Hostels: ["hostel_a", "hostel"],
    "Admin & Services": ["admin", "registrar", "library"],
    Facilities: ["lagaan", "conference", "na1"],
  };

  useEffect(() => {
    const t = setInterval(() => setZones((prev) => prev.map(updateZone)), 5000);
    return () => clearInterval(t);
  }, []);

  const toggleWalkMode = useCallback(() => {
    setWalkMode((v) => !v);
  }, []);

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
        background:
          "radial-gradient(circle at center, #0B666A 0%, #071952 100%)",
        overflow: "hidden",
        color: "#fff",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        paddingTop: "64px",
      }}
    >
      <DashboardSidebar
        zones={zones}
        filteredZones={filteredZones}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        expandedCategories={expandedCategories}
        toggleCategory={toggleCategory}
        categories={categories}
      />

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: 24,
          gap: 24,
          overflow: "hidden",
        }}
      >
        <DashboardHeader
          campusLoad={campusLoad}
          campusOcc={campusOcc}
          activeZonesCount={zones.length}
          criticalCount={criticalCount}
        />

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
                  to run · Esc to exit
                </span>
              )}
              <button
                onClick={toggleWalkMode}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: walkMode ? "#FAC75A" : "rgba(7,25,82,0.6)",
                  border: "1px solid rgba(151,254,237,0.3)",
                  color: walkMode ? "#071952" : "#fff",
                  fontSize: 9,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {walkMode ? <Navigation size={12} /> : <Eye size={12} />}
                {walkMode ? "EXIT WALK MODE" : "FIRST-PERSON VIEW"}
              </button>
            </div>
          </div>

          <Canvas shadows dpr={[1, 2]} camera={{ position: [20, 20, 20], fov: 40 }}>
            <DashboardScene
              zones={zones}
              selectedId={selectedId}
              onSelect={setSelectedId}
              walkMode={walkMode}
            />
          </Canvas>
        </section>
      </main>
    </div>
  );
}
