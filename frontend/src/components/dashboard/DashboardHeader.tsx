import React from "react";
import { Zone } from "./DashboardTypes";

interface DashboardHeaderProps {
  campusLoad: number;
  campusOcc: number;
  activeZonesCount: number;
  criticalCount: number;
}

export default function DashboardHeader({
  campusLoad,
  campusOcc,
  activeZonesCount,
  criticalCount,
}: DashboardHeaderProps) {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        background: "rgba(11, 102, 106, 0.15)",
        backdropFilter: "blur(10px)",
        padding: "24px 30px",
        borderRadius: 24,
        border: "1px solid rgba(151, 254, 237, 0.2)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      }}
    >
      <div>
        <p
          style={{
            fontSize: 11,
            color: "#97FEED",
            fontWeight: 800,
            letterSpacing: "2px",
            textTransform: "uppercase",
            opacity: 0.8,
          }}
        >
          Group I3 Demo • University of Moratuwa
        </p>
        <h1
          style={{
            fontSize: 42,
            fontWeight: 900,
            color: "#fff",
            letterSpacing: "-1.5px",
            margin: "4px 0",
            textShadow: "0 4px 20px rgba(151, 254, 237, 0.3)",
          }}
        >
          Smart Campus{" "}
          <span style={{ color: "#97FEED" }}>Twin Control</span>
        </h1>
        <p
          style={{
            color: "rgba(151, 254, 237, 0.6)",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          Real-time 3D campus infrastructure monitoring — occupancy ·
          temperature · energy states
        </p>
      </div>

      <div style={{ display: "flex", gap: 16 }}>
        {[
          { label: "CAMPUS ENERGY", value: `${campusLoad.toFixed(1)} kW` },
          { label: "AVG OCCUPANCY", value: `${campusOcc}%` },
          { label: "ACTIVE ZONES", value: activeZonesCount },
          { label: "ALERTS", value: `${criticalCount} critical` },
        ].map((stat, i) => {
          const isAlert = stat.label === "ALERTS" && criticalCount > 0;
          return (
            <div
              key={i}
              style={{
                background: "rgba(7, 25, 82, 0.4)",
                border: `1px solid ${isAlert ? "rgba(255, 75, 43, 0.5)" : "rgba(151, 254, 237, 0.2)"}`,
                padding: "12px 20px",
                borderRadius: 16,
                minWidth: 140,
                boxShadow: isAlert
                  ? "0 0 20px rgba(255, 75, 43, 0.15)"
                  : "none",
              }}
            >
              <p
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  color: "rgba(151, 254, 237, 0.5)",
                  marginBottom: 4,
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: isAlert ? "#FF4B2B" : "#97FEED",
                }}
              >
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>
    </header>
  );
}
