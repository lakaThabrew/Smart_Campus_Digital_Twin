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
  selectedRoomId?: string;
  onSelectRoom?: (roomId: string) => void;
};

type RoomStats = {
  temp: number;
  occ: number;
};

export default function FloorPlan2D({
  floor,
  floorNumber,
  minFloor = 0,
  maxFloor,
  goUp,
  goDown,
  selectedRoomId,
  onSelectRoom,
}: Props) {
  const [stats, setStats] = useState<Record<string, RoomStats>>({});
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  const SCALE = 1.25;

  // Calculate the bounding box of all rooms to center them
  const bounds = {
    minX: Math.min(...floor.rooms.map(r => r.x), 0),
    maxX: Math.max(...floor.rooms.map(r => r.x + r.width), 800),
    minY: Math.min(...floor.rooms.map(r => r.y), 0),
    maxY: Math.max(...floor.rooms.map(r => r.y + r.height), 500),
  };

  const planWidth = (bounds.maxX - bounds.minX) * SCALE;
  const planHeight = (bounds.maxY - bounds.minY) * SCALE;

  useEffect(() => {
    const initialStats: Record<string, RoomStats> = {};
    floor.rooms.forEach((room) => {
      if (room.type !== "stairs" && room.type !== "free") {
        initialStats[room.id] = {
          temp: 24 + Math.random() * 6,
          occ: 20 + Math.random() * 60,
        };
      }
    });
    setStats(initialStats);

    const timer = setInterval(() => {
      setStats((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((id) => {
          next[id] = {
            temp: Math.min(
              35,
              Math.max(20, next[id].temp + (Math.random() - 0.5)),
            ),
            occ: Math.min(
              100,
              Math.max(0, next[id].occ + (Math.random() * 10 - 5)),
            ),
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
        width: floor.planImage ? "auto" : planWidth + 100,
        maxWidth: "90vw",
        height: floor.planImage ? "auto" : planHeight + 100,
        maxHeight: "80vh",
        position: "relative",
        borderRadius: "24px",
        background: "rgba(11, 102, 106, 0.15)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(151, 254, 237, 0.25)",
        boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.6)",
        padding: "40px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "auto",
      }}
    >
      <div
        style={{
          width: floor.planImage ? "100%" : planWidth,
          height: floor.planImage ? "100%" : planHeight,
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        {floor.planImage ? (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src={floor.planImage}
              alt={`Floor ${floorNumber} Plan`}
              style={{
                maxWidth: "100%",
                maxHeight: "70vh",
                borderRadius: "16px",
                objectFit: "contain",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                border: "1px solid rgba(151, 254, 237, 0.2)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            >
            </div>
          </div>
        ) : (
          floor.rooms.map((room) => {
            const isHovered = hoveredRoom === room.id;
            const isSelected = selectedRoomId === room.id;
            const isStairs = room.type === "stairs";
            const isFree = room.type === "free";
            const isOpenArea = room.name === "Open Area";

            return (
              <div
                key={room.id}
                onMouseEnter={() => setHoveredRoom(room.id)}
                onMouseLeave={() => setHoveredRoom(null)}
                onClick={() => onSelectRoom?.(room.id)}
                title={room.name ? `${room.name} (${room.id})` : room.id}
                style={{
                  position: "absolute",
                  left: (room.x - bounds.minX) * SCALE,
                  top: (room.y - bounds.minY) * SCALE,
                  width: room.width * SCALE,
                  height: room.height * SCALE,
                  borderRadius: "0px",
                  border: isSelected
                    ? "3px solid #FFD166"
                    : isHovered
                      ? "2.5px solid #97FEED"
                      : "1.5px solid rgba(0, 0, 0, 0.8)",
                  background: isSelected
                    ? "linear-gradient(135deg, rgba(255, 209, 102, 0.35) 0%, rgba(255, 219, 133, 0.25) 100%)"
                    : isStairs
                      ? "linear-gradient(135deg, #FFD166 0%, #F5A623 100%)"
                      : isFree
                        ? "rgba(255, 255, 255, 0.05)"
                        : isOpenArea
                          ? "linear-gradient(135deg, rgba(144, 238, 144, 0.3) 0%, rgba(53, 162, 159, 0.4) 100%)"
                          : isHovered
                            ? "linear-gradient(135deg, rgba(151, 254, 237, 0.4) 0%, rgba(11, 102, 106, 0.8) 100%)"
                            : "linear-gradient(135deg, rgba(11, 102, 106, 0.75) 0%, rgba(7, 25, 82, 0.9) 100%)",
                  boxShadow: isSelected
                    ? "0 0 30px rgba(255, 209, 102, 0.35)"
                    : isHovered
                      ? "0 0 30px rgba(151, 254, 237, 0.5)"
                      : "0 6px 20px rgba(0,0,0,0.3)",

                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "4px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  zIndex: isHovered ? 10 : 1,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    color: isHovered ? "#97FEED" : "#fff",
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: room.width * SCALE < 100 ? 10 : 13,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      lineHeight: 1.1,
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                      width: "100%",
                      padding: "0 4px",
                    }}
                  >
                    {room.name || "UNNAMED"}
                  </div>

                  {!isStairs && !isOpenArea && !isFree && stats[room.id] && (
                    <div
                      style={{
                        fontSize: room.width * SCALE < 100 ? 9 : 11,
                        marginTop: 6,
                        fontWeight: 600,
                        opacity: isHovered ? 1 : 0.8,
                      }}
                    >
                      <div
                        style={{
                          color:
                            stats[room.id].temp > 30 ? "#FF4B2B" : "#97FEED",
                        }}
                      >
                        {stats[room.id].temp.toFixed(1)}°C
                      </div>
                      <div
                        style={{
                          color:
                            stats[room.id].occ > 70 ? "#F5A623" : "#97FEED",
                        }}
                      >
                        {Math.round(stats[room.id].occ)}%
                      </div>
                    </div>
                  )}

                  {isStairs && (
                    <div
                      style={{ display: "flex", gap: "8px", marginTop: "10px" }}
                    >
                      {floorNumber < maxFloor && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            goUp();
                          }}
                          style={{
                            padding: "6px 12px",
                            cursor: "pointer",
                            borderRadius: "0px",
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
                          onClick={(e) => {
                            e.stopPropagation();
                            goDown();
                          }}
                          style={{
                            padding: "6px 12px",
                            cursor: "pointer",
                            borderRadius: "0px",
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
          })
        )}
      </div>
    </div>
  );
}
