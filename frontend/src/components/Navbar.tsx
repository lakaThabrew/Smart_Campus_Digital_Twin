"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "./auth/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const hideNavbar = ["/", "/login", "/register"].includes(pathname);
  const showLogout = pathname === "/dashboard";

  if (hideNavbar) {
    return null;
  }

  const handleLogout = () => {
    logout();
  };

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
      zIndex: 1000,
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

      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <Link href="/dashboard" style={{ textDecoration: "none", color: "#97FEED", fontWeight: 600, fontSize: "0.9rem" }}>DASHBOARD</Link>
        <span style={{ color: "rgba(151, 254, 237, 0.5)", fontWeight: 600, fontSize: "0.9rem" }}>INDOOR VIEW</span>
        {showLogout && (
          <button
            onClick={handleLogout}
            style={{
              padding: "0.5rem 1rem",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(151, 254, 237, 0.4)",
              borderRadius: 9999,
              color: "#97FEED",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.2)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
