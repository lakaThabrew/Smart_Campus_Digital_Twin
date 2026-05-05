"use client";

import { use, useEffect, useState, useMemo } from "react";
import FloorPlan2D from "@/components/indoor/FloorPlan2D";
import { BUILDING_DATA } from "@/components/indoor/FloorData";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

type RoomTypeLabelMap = Record<string, string>;

const ROOM_TYPE_LABELS: RoomTypeLabelMap = {
  room: "Room",
  lab: "Lab",
  office: "Office",
  stairs: "Stairs",
  free: "Open Area",
};

function getRoomTypeLabel(type: string) {
  return ROOM_TYPE_LABELS[type] ?? "Space";
}

export default function DynamicBuildingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const building = BUILDING_DATA[id];

  if (!building) {
    return notFound();
  }

  const [floor, setFloor] = useState(building.minFloor);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const currentFloor = building.floors[floor - building.minFloor];
  const floorIndex = floor - building.minFloor;

  useEffect(() => {
    if (selectedRoomId && !currentFloor.rooms.some((room) => room.id === selectedRoomId)) {
      setSelectedRoomId(null);
    }
  }, [currentFloor, selectedRoomId]);

  const roomResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return currentFloor.rooms;

    return currentFloor.rooms.filter((room) => {
      return (
        room.id.toLowerCase().includes(query) ||
        room.name.toLowerCase().includes(query) ||
        room.type.toLowerCase().includes(query)
      );
    });
  }, [currentFloor.rooms, searchQuery]);

  const selectedRoom = selectedRoomId
    ? currentFloor.rooms.find((room) => room.id === selectedRoomId) ?? null
    : null;

  const bounds = {
    minX: Math.min(...currentFloor.rooms.map((r) => r.x), 0),
    maxX: Math.max(...currentFloor.rooms.map((r) => r.x + r.width), 800),
    minY: Math.min(...currentFloor.rooms.map((r) => r.y), 0),
    maxY: Math.max(...currentFloor.rooms.map((r) => r.y + r.height), 500),
  };

  const previewScale = 0.12;

  const handleFloorChange = (next: number) => {
    setFloor(next);
    setSelectedRoomId(null);
  };

  return (
    <div style={{ 
      padding: "100px 30px 60px", 
      background: "radial-gradient(circle at center, #0B666A 0%, #071952 100%)", 
      color: "white", 
      display: "flex", 
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
      gap: "40px"
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

      {/* Breadcrumb */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", color: "#97FEED", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
        <Link href="/" style={{ color: "#97FEED", textDecoration: "none" }}>
          Home
        </Link>
        <span>/</span>
        <span>{building.name}</span>
        <span>/</span>
        <span>Floor {floor === -1 ? "Basement" : floor}</span>
      </div>

      {/* Top Row: Search and Floor Plan */}
      <div style={{ display: "flex", gap: 40, width: "100%", maxWidth: "1400px", alignItems: "flex-start" }}>
        {/* Left Column: Search Bar and Building Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28, width: "400px" }}>
          {/* Room Search - Top */}
          <div style={{ padding: "22px", borderRadius: 28, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(151, 254, 237, 0.15)", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div>
                <div style={{ color: "#97FEED", fontSize: "0.9rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                  Room Search
                </div>
                <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 4 }}>
                  Search by name, type, or ID.
                </div>
              </div>
            </div>

            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search rooms, labs, offices..."
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 18,
                border: "1px solid rgba(151, 254, 237, 0.2)",
                background: "rgba(255,255,255,0.07)",
                color: "white",
                outline: "none",
                fontSize: "0.95rem",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.03)",
              }}
            />

            <div style={{ maxHeight: 250, overflowY: "auto", paddingRight: 4, display: "grid", gap: 10 }}>
              {roomResults.length === 0 ? (
                <div style={{ padding: "18px", borderRadius: 18, background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.75)", fontSize: "0.95rem" }}>
                  No rooms match that search. Try another room name or ID.
                </div>
              ) : (
                roomResults.slice(0, 8).map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 6,
                      width: "100%",
                      padding: "14px 16px",
                      borderRadius: 20,
                      border: room.id === selectedRoomId ? "1px solid #FFD166" : "1px solid rgba(151, 254, 237, 0.15)",
                      background: room.id === selectedRoomId ? "rgba(255,209,102,0.12)" : "rgba(255,255,255,0.04)",
                      color: "white",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span style={{ fontSize: "0.98rem", fontWeight: 700 }}>{room.name || room.id}</span>
                    <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.7)" }}>{room.id} · {getRoomTypeLabel(room.type)}</span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Building Details - Bottom */}
          <div style={{ padding: "28px", borderRadius: 28, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(151, 254, 237, 0.18)", boxShadow: "0 30px 60px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column", gap: 28 }}>
            <div>
              <h1 style={{ margin: 0, color: "#97FEED", fontSize: "2.8rem", fontWeight: 800, lineHeight: 1.05 }}>
                {building.name}
              </h1>
              <p style={{ marginTop: 12, color: "rgba(151, 254, 237, 0.8)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                Explore the indoor layout, jump between floors, and locate any room instantly.
              </p>
              <div style={{ marginTop: 20, display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 999, background: "rgba(151, 254, 237, 0.12)", color: "#97FEED", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "1px" }}>
                Current Floor: {floor === -1 ? "Basement" : floor}
              </div>
            </div>

            {/* Minimap and Floor Navigator */}
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                  <div style={{ color: "#97FEED", fontSize: "0.9rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                    Minimap
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.82rem" }}>
                    {currentFloor.rooms.length} spaces
                  </div>
                </div>
                <div style={{ position: "relative", minHeight: 180, width: "100%", borderRadius: 20, background: "rgba(0, 0, 0, 0.2)", border: "1px solid rgba(151, 254, 237, 0.18)" }}>
                  {currentFloor.rooms.map((room) => {
                    const left = (room.x - bounds.minX) * previewScale;
                    const top = (room.y - bounds.minY) * previewScale;
                    const width = room.width * previewScale;
                    const height = room.height * previewScale;
                    const isSelected = room.id === selectedRoomId;
                    const isStairs = room.type === "stairs";
                    const isFree = room.type === "free";

                    return (
                      <button
                        key={room.id}
                        onClick={() => setSelectedRoomId(room.id)}
                        title={room.name || room.id}
                        style={{
                          position: "absolute",
                          left,
                          top,
                          width,
                          height,
                          borderRadius: 4,
                          border: isSelected ? "1px solid #FFD166" : "1px solid rgba(255,255,255,0.08)",
                          background: isSelected ? "rgba(255, 209, 102, 0.3)" : isStairs ? "rgba(255, 209, 102, 0.25)" : isFree ? "rgba(255,255,255,0.1)" : "rgba(151, 254, 237, 0.16)",
                          cursor: "pointer",
                          padding: 0,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Floor Plan */}
        <div style={{ position: "relative", flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
          <FloorPlan2D
            floor={currentFloor}
            floorNumber={floor}
            minFloor={building.minFloor}
            maxFloor={building.maxFloor}
            goUp={() => handleFloorChange(floor + 1)}
            goDown={() => handleFloorChange(floor - 1)}
            selectedRoomId={selectedRoomId ?? undefined}
            onSelectRoom={(roomId) => setSelectedRoomId(roomId)}
          />

          {selectedRoom && (
            <div style={{ position: "absolute", top: 20, right: 20, width: 300, padding: 24, borderRadius: 28, background: "rgba(4, 19, 45, 0.92)", border: "1px solid rgba(151, 254, 237, 0.18)", boxShadow: "0 30px 80px rgba(0,0,0,0.45)", zIndex: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div>
                  <div style={{ color: "#97FEED", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                    Room details
                  </div>
                  <div style={{ marginTop: 8, fontSize: "1.15rem", fontWeight: 800, color: "white" }}>
                    {selectedRoom.name || selectedRoom.id}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRoomId(null)}
                  style={{
                    border: "none",
                    background: "rgba(255,255,255,0.08)",
                    color: "white",
                    borderRadius: 14,
                    width: 32,
                    height: 32,
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ marginTop: 18, display: "grid", gap: 12, color: "rgba(255,255,255,0.85)", fontSize: "0.95rem" }}>
                <div>
                  <span style={{ color: "rgba(151, 254, 237, 0.9)", fontWeight: 700 }}>ID:</span> {selectedRoom.id}
                </div>
                <div>
                  <span style={{ color: "rgba(151, 254, 237, 0.9)", fontWeight: 700 }}>Type:</span> {getRoomTypeLabel(selectedRoom.type)}
                </div>
                <div>
                  <span style={{ color: "rgba(151, 254, 237, 0.9)", fontWeight: 700 }}>Floor:</span> {floor === -1 ? "Basement" : floor}
                </div>
                <div style={{ padding: "14px 16px", borderRadius: 20, background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.85)" }}>
                  This room is highlighted on the map. Use the search box or click a room block to navigate quickly.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

