"use client";

import { useEffect, useState } from "react";
import { Floor } from "./FloorData";

type Props = {
  floor: Floor;
  floorNumber: number;
  minFloor?: number;
  maxFloor: number;
  goUp: () => void;
  goDown: () => void;
};

type RoomStats = {
  temp: number;
  occ: number;
};

export default function FloorPlan2D({ floor, floorNumber, minFloor = 0, maxFloor, goUp, goDown }: Props) {
  const [stats, setStats] = useState<Record<string, RoomStats>>({});
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  const SCALE = 1.25;

  useEffect(() => {
    const initialStats: Record<string, RoomStats> = {};
    floor.rooms.forEach(room => {
      if (room.type !== "stairs") {
        initialStats[room.id] = {
          temp: 24 + Math.random() * 6,
          occ: 20 + Math.random() * 60
        };
      }
    });
    setStats(initialStats);

    const timer = setInterval(() => {
      setStats(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(id => {
          next[id] = {
            temp: Math.min(35, Math.max(20, next[id].temp + (Math.random() - 0.5))),
            occ: Math.min(100, Math.max(0, next[id].occ + (Math.random() * 10 - 5)))
          };
        });
        return next;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [floor]);

  return (
    <div
      style={{
        width: 1000 * SCALE + 50,
        height: 500 * SCALE + 50,
        position: "relative",
        borderRadius: "24px",
        background: "rgba(11, 102, 106, 0.15)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(151, 254, 237, 0.25)",
        boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.6)",
        padding: "25px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "all 0.5s ease"
      }}
    >
      <div style={{ width: 800 * SCALE, height: 500 * SCALE, position: "relative" }}>
        {floor.rooms.map((room) => {
          const isHovered = hoveredRoom === room.id;
          const isStairs = room.type === "stairs";
          const isOpenArea = room.name === "Open Area";
          
          return (
            <div
              key={room.id}
              onMouseEnter={() => setHoveredRoom(room.id)}
              onMouseLeave={() => setHoveredRoom(null)}
              style={{
                position: "absolute",
                left: room.x * SCALE,
                top: room.y * SCALE,
                width: room.width * SCALE,
                height: room.height * SCALE,
                borderRadius: "10px",
                border: isHovered 
                  ? "2px solid #97FEED" 
                  : "1px solid rgba(151, 254, 237, 0.3)",
                background: isStairs
                  ? "linear-gradient(135deg, #FFD166 0%, #F5A623 100%)"
                  : isOpenArea
                  ? "linear-gradient(135deg, rgba(144, 238, 144, 0.2) 0%, rgba(53, 162, 159, 0.3) 100%)"
                  : isHovered
                  ? "linear-gradient(135deg, rgba(151, 254, 237, 0.2) 0%, rgba(11, 102, 106, 0.6) 100%)"
                  : "linear-gradient(135deg, rgba(11, 102, 106, 0.4) 0%, rgba(7, 25, 82, 0.6) 100%)", // Home page panel style
                boxShadow: isHovered 
                  ? "0 0 25px rgba(151, 254, 237, 0.4)" 
                  : "0 4px 15px rgba(0,0,0,0.2)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
                zIndex: isHovered ? 10 : 1,
                overflow: "hidden"
              }}
            >
              <div style={{ 
                textAlign: "center", 
                color: isHovered ? "#97FEED" : "#fff",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)"
              }}>
                <div style={{ 
                  fontWeight: 700, 
                  fontSize: (room.width * SCALE) < 100 ? 10 : 13,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  lineHeight: 1.1
                }}>
                  {room.name || "UNNAMED"}
                </div>

                {!isStairs && !isOpenArea && stats[room.id] && (
                  <div style={{ 
                    fontSize: (room.width * SCALE) < 100 ? 9 : 11, 
                    marginTop: 6,
                    fontWeight: 600,
                    opacity: isHovered ? 1 : 0.8
                  }}>
                    <div style={{ color: stats[room.id].temp > 30 ? "#FF4B2B" : "#97FEED" }}>
                      {stats[room.id].temp.toFixed(1)}°C
                    </div>
                    <div style={{ color: stats[room.id].occ > 70 ? "#F5A623" : "#97FEED" }}>
                      {Math.round(stats[room.id].occ)}%
                    </div>
                  </div>
                )}
                
                {isStairs && (
                  <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                    {floorNumber < maxFloor && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); goUp(); }} 
                        style={{ 
                          padding: "6px 12px", 
                          cursor: "pointer", 
                          borderRadius: "6px", 
                          border: "none", 
                          background: "#071952", 
                          color: "#97FEED",
                          fontWeight: "bold", 
                          fontSize: 10,
                        }}
                      >
                        UP
                      </button>
                    )}
                    {floorNumber > minFloor && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); goDown(); }} 
                        style={{ 
                          padding: "6px 12px", 
                          cursor: "pointer", 
                          borderRadius: "6px", 
                          border: "none", 
                          background: "#071952", 
                          color: "#97FEED",
                          fontWeight: "bold", 
                          fontSize: 10,
                        }}
                      >
                        DN
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}