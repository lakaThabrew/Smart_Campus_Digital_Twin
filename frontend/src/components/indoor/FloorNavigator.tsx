"use client";

type Props = {
  floor: number;
  minFloor?: number;
  maxFloor: number;
  goUp: () => void;
  goDown: () => void;
};

export default function FloorNavigator({
  floor,
  minFloor = 0,
  maxFloor,
  goUp,
  goDown,
}: Props) {
  const buttonStyle = (active: boolean) => ({
    padding: "20px 0",
    width: "100px",
    borderRadius: "16px",
    border: "1px solid rgba(151, 254, 237, 0.4)",
    background: active 
      ? "linear-gradient(135deg, #0B666A 0%, #071952 100%)" 
      : "rgba(255, 255, 255, 0.05)",
    color: "#97FEED",
    fontWeight: 700,
    fontSize: "0.8rem",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.3s ease",
    boxShadow: active ? "0 4px 15px rgba(151, 254, 237, 0.2)" : "none",
    backdropFilter: "blur(5px)",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 20,
      }}
    >
      {floor < maxFloor && (
        <button 
          onClick={goUp} 
          style={buttonStyle(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 10px 30px rgba(151, 254, 237, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(151, 254, 237, 0.2)";
          }}
        >
          <span style={{ fontSize: "1.5rem" }}>↑</span>
          UP
        </button>
      )}

      {floor > minFloor && (
        <button 
          onClick={goDown} 
          style={buttonStyle(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(4px)";
            e.currentTarget.style.boxShadow = "0 10px 30px rgba(151, 254, 237, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(151, 254, 237, 0.2)";
          }}
        >
          <span style={{ fontSize: "1.5rem" }}>↓</span>
          DOWN
        </button>
      )}
    </div>
  );
}