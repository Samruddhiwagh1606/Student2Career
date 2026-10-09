import React from "react";
import { Link } from "react-router-dom";

export function LandingFooter() {
  return (
    <footer
      style={{
        background: "var(--charcoal)",
        color: "#FFFFFF",
        padding: "64px 24px 40px",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "44px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "32px",
          }}
        >
          {/* Brand Col */}
          <div style={{ maxWidth: "380px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: "var(--wine)",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "14px",
                }}
              >
                C2C
              </div>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "20px",
                  color: "#FFFFFF",
                }}
              >
                College2Career
              </span>
            </div>

            <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.75)", lineHeight: 1.6 }}>
              College Internship Management System — Empowering students, faculty mentors, and campus administrators with modern career workflow tools.
            </p>
          </div>

          {/* Quick Links */}
          <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
            <div>
              <h4 style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.8px", color: "var(--terracotta-light)", marginBottom: "16px", textTransform: "uppercase" }}>
                Navigation
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", color: "rgba(255, 255, 255, 0.85)" }}>
                <li><a href="#home" style={{ color: "inherit" }}>Home</a></li>
                <li><a href="#internships" style={{ color: "inherit" }}>Internships</a></li>
                <li><a href="#experiences" style={{ color: "inherit" }}>Portals</a></li>
                <li><a href="#how-it-works" style={{ color: "inherit" }}>How It Works</a></li>
                <li><a href="#features" style={{ color: "inherit" }}>Capabilities</a></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.8px", color: "var(--terracotta-light)", marginBottom: "16px", textTransform: "uppercase" }}>
                Portals & Accounts
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", color: "rgba(255, 255, 255, 0.85)" }}>
                <li><Link to="/login" style={{ color: "inherit" }}>Student Portal</Link></li>
                <li><Link to="/login" style={{ color: "inherit" }}>Faculty Portal</Link></li>
                <li><Link to="/login" style={{ color: "inherit" }}>Admin Portal</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.8px", color: "var(--terracotta-light)", marginBottom: "16px", textTransform: "uppercase" }}>
                Contact & Support
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", color: "rgba(255, 255, 255, 0.85)" }}>
                <li><span>College Placement Office</span></li>
                <li><span>support@college2career.edu</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: "24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            fontSize: "13px",
            color: "rgba(255, 255, 255, 0.55)",
          }}
        >
          <span>© {new Date().getFullYear()} College2Career — College Internship Management System. All Rights Reserved.</span>
          <span>Academic Career Placement Platform</span>
        </div>
      </div>
    </footer>
  );
}
