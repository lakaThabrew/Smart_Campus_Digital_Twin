"use client";

import { useState, use } from "react";
import FloorPlan2D from "@/components/indoor/FloorPlan2D";
import FloorNavigator from "@/components/indoor/FloorNavigator";
import { BUILDING_DATA } from "@/components/indoor/FloorData";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default function DynamicBuildingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const building = BUILDING_DATA[id];

  if (!building) {
    return notFound();
  }

  const [floor, setFloor] = useState(building.minFloor);

  // Calculate index for floor array (offset by minFloor if necessary)
  const floorIndex = floor - building.minFloor;

  return (
    <div style={{ 
      padding: "100px 30px 60px", 
      background: "radial-gradient(circle at center, #0B666A 0%, #071952 100%)", 
      minHeight: "100vh", 
      color: "white", 
      display: "flex", 
      flexDirection: "row", 
      alignItems: "center", 
      justifyContent: "center",
      position: "relative",
      gap: "60px"
    }}>
      <Link 
        href="/" 
        style={{ 
          position: "absolute", 
          top: 100, 
          left: 30, 
          display: "flex", 
          alignItems: "center", 
          gap: 5, 
          color: "#97FEED", 
          textDecoration: "none",
          fontSize: 14,
          fontWeight: 600
        }}
      >
        <ChevronLeft size={20} />
        Back to Dashboard
      </Link>

      {/* Left Sidebar: Controls & Info */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "350px" }}>
        <h1 style={{ 
          marginBottom: "0.2rem", 
          color: "#97FEED", 
          fontSize: "2.8rem", 
          fontWeight: 800, 
          letterSpacing: "-1px",
          textShadow: "0 4px 10px rgba(0,0,0,0.3)",
          lineHeight: 1.1
        }}>
          {building.name}
        </h1>
        <div style={{ 
          marginBottom: "2.5rem", 
          background: "rgba(151, 254, 237, 0.1)", 
          padding: "6px 16px", 
          borderRadius: "100px", 
          border: "1px solid rgba(151, 254, 237, 0.3)",
          color: "#97FEED",
          fontSize: "0.9rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "2px"
        }}>
          Level {floor === -1 ? "Basement" : floor}
        </div>

        <FloorNavigator
          floor={floor}
          minFloor={building.minFloor}
          maxFloor={building.maxFloor}
          goUp={() => setFloor((f) => f + 1)}
          goDown={() => setFloor((f) => f - 1)}
        />
      </div>

      {/* Right Area: Enlarged Map */}
      <FloorPlan2D
        floor={building.floors[floorIndex]}
        floorNumber={floor}
        minFloor={building.minFloor}
        maxFloor={building.maxFloor}
        goUp={() => setFloor((f) => f + 1)}
        goDown={() => setFloor((f) => f - 1)}
      />
    </div>
  );
}
