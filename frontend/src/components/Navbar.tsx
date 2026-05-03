"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";

export default function Navbar() {
  return (
    <nav style={{
      width: "100%",
      padding: "1rem 2rem",
      background: "rgba(11, 102, 106, 0.9)",
      backdropFilter: "blur(10px)",
      borderBottom: "1px solid rgba(151, 254, 237, 0.3)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      position: "fixed",
      top: 0,
      zIndex: 20000,
      color: "white"
    }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "inherit" }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "#97FEED",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <Building2 color="#071952" size={18} />
        </div>
        <span style={{ fontWeight: 700, fontSize: "1.2rem", letterSpacing: "-0.5px" }}>
          UOM<span style={{ color: "#97FEED" }}>Twin</span>
        </span>
      </Link>
    </nav>
  );
}
