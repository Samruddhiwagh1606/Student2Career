import React from "react";
import { Menu, Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function Topbar({ onMenuToggle, title }) {
  const { student } = useAuth();

  return (
    <header
      style={{
        height: "70px",
        background: "var(--white)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        position: "sticky",
        top: 0,
        zIndex: 80,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          onClick={onMenuToggle}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px",
            borderRadius: "8px",
            color: "var(--charcoal)",
            background: "var(--cream)",
          }}
          className="mobile-menu-btn"
        >
          <Menu size={20} />
        </button>

        {title && (
          <h1
            style={{
              fontSize: "20px",
              fontWeight: 700,
              fontFamily: "DM Sans, sans-serif",
              color: "var(--charcoal)",
              margin: 0,
            }}
          >
            {title}
          </h1>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <button
          style={{
            position: "relative",
            padding: "8px",
            borderRadius: "50%",
            background: "var(--warm-white)",
            color: "var(--charcoal)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="Notifications"
        >
          <Bell size={18} />
          <span
            style={{
              position: "absolute",
              top: "6px",
              right: "6px",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "var(--terracotta)",
            }}
          />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "var(--wine)",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            {student?.name ? student.name.charAt(0).toUpperCase() : "S"}
          </div>
          <div className="topbar-user-info" style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--charcoal)" }}>
              {student?.name || "Student"}
            </span>
            <span style={{ fontSize: "11px", color: "var(--muted)" }}>
              {student?.department || "Department"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
