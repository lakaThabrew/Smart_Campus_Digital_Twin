"use client";

import { useState } from "react";

import FloorPlan2D from "@/components/indoor/FloorPlan2D";
import FloorNavigator from "@/components/indoor/FloorNavigator";

import { SUMANADASA_FLOORS } from "@/components/indoor/FloorData";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function CSEBuildingPage() {
  const [floor, setFloor] = useState(0);

  return (
    <div
      style={{
        padding: "100px 30px 60px",
        display: "flex",
        flexDirection: "row", // Horizontal layout
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "radial-gradient(circle at center, #0B666A 0%, #071952 100%)",
        color: "white",
        position: "relative",
        gap: "60px" // Space between sidebar and map
      }}
    >
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
          Sumanadasa Building
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
          maxFloor={3}
          goUp={() => setFloor((f) => f + 1)}
          goDown={() => setFloor((f) => f - 1)}
        />
      </div>

      {/* Right Area: Enlarged Map */}
      <FloorPlan2D
        floor={SUMANADASA_FLOORS[floor]}
        floorNumber={floor}
        maxFloor={3}
        goUp={() => setFloor((f) => f + 1)}
        goDown={() => setFloor((f) => f - 1)}
      />
    </div>
  );
}