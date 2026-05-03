"use client";

import { useState, use, useEffect } from "react";
import FloorPlan2D from "@/components/indoor/FloorPlan2D";
import FloorNavigator from "@/components/indoor/FloorNavigator";
import { BUILDING_DATA } from "@/components/indoor/FloorData";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default function DynamicBuildingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const building = BUILDING_DATA[id];
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!building) {
    return notFound();
  }

  const [floor, setFloor] = useState(building.minFloor);

  // Calculate index for floor array (offset by minFloor if necessary)
  const floorIndex = floor - building.minFloor;

  return (
    <div style={{ 
      padding: isMobile ? "80px 20px 40px" : "100px 30px 60px", 
      minHeight: "100vh",
      background: "radial-gradient(circle at center, #0B666A 0%, #071952 100%)", 
      color: "white", 
      display: "flex", 
      flexDirection: isMobile ? "column" : "row", 
      alignItems: isMobile ? "flex-start" : "center", 
      justifyContent: isMobile ? "flex-start" : "center",
      position: "relative",
      gap: isMobile ? "30px" : "60px"
    }}>
      <Link 
        href="/" 
        style={{ 
          position: isMobile ? "fixed" : "absolute", 
          top: isMobile ? 80 : 100, 
          left: isMobile ? 20 : 30, 
          display: "flex", 
          alignItems: "center", 
          gap: 5, 
          color: "#97FEED", 
          textDecoration: "none",
          fontSize: isMobile ? 12 : 14,
          fontWeight: 600,
          zIndex: 50,
          background: isMobile ? "rgba(7,25,82,0.8)" : "transparent",
          padding: isMobile ? "6px 12px" : "0",
          borderRadius: "100px",
          border: isMobile ? "1px solid rgba(151,254,237,0.3)" : "none",
          backdropFilter: isMobile ? "blur(5px)" : "none"
        }}
      >
        <ChevronLeft size={isMobile ? 16 : 20} />
        Back
      </Link>

      {/* Left Sidebar: Controls & Info */}
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "flex-start", 
        width: isMobile ? "100%" : "350px",
        marginTop: isMobile ? "40px" : 0
      }}>
        <h1 style={{ 
          marginBottom: "0.2rem", 
          color: "#97FEED", 
          fontSize: isMobile ? "2rem" : "2.8rem", 
          fontWeight: 800, 
          letterSpacing: "-1px",
          textShadow: "0 4px 10px rgba(0,0,0,0.3)",
          lineHeight: 1.1
        }}>
          {building.name}
        </h1>
        <div style={{ 
          marginBottom: isMobile ? "1.5rem" : "2.5rem", 
          background: "rgba(151, 254, 237, 0.1)", 
          padding: "6px 16px", 
          borderRadius: "100px", 
          border: "1px solid rgba(151, 254, 237, 0.3)",
          color: "#97FEED",
          fontSize: isMobile ? "0.8rem" : "0.9rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "2px"
        }}>
          Level {floor === -1 ? "Basement" : floor}
        </div>

        {!isMobile && (
          <FloorNavigator
            floor={floor}
            minFloor={building.minFloor}
            maxFloor={building.maxFloor}
            goUp={() => setFloor((f) => f + 1)}
            goDown={() => setFloor((f) => f - 1)}
          />
        )}
      </div>

      {/* Right Area: Enlarged Map */}
      <FloorPlan2D
        floor={building.floors[floorIndex]}
        floorNumber={floor}
        minFloor={building.minFloor}
        maxFloor={building.maxFloor}
        goUp={() => setFloor((f) => f + 1)}
        goDown={() => setFloor((f) => f - 1)}
        isMobile={isMobile}
      />
      
      {isMobile && (
        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "10px" }}>
          <FloorNavigator
            floor={floor}
            minFloor={building.minFloor}
            maxFloor={building.maxFloor}
            goUp={() => setFloor((f) => f + 1)}
            goDown={() => setFloor((f) => f - 1)}
            isMobile={isMobile}
          />
        </div>
      )}
    </div>
  );
}
