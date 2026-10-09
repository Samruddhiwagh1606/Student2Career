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
          {/* Brand Column */}
          <div style={{ maxWidth: "380px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "var(--wine)",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "15px",
                }}
              >
                C2C
              </div>
              <div>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: "20px",
                    color: "#FFFFFF",
                    display: "block",
                    lineHeight: 1.1,
                  }}
                >
                  College2Career
                </span>
                <span style={{ fontSize: "11px", color: "var(--terracotta-light)", fontWeight: 500 }}>
                  College Internship Management System
                </span>
              </div>
            </div>

            <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.75)", lineHeight: 1.6 }}>
              A unified academic internship platform connecting students, faculty mentors, and institutional placement offices.
            </p>
          </div>

          {/* Columns */}
          <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
            {/* Column 1: Platform */}
            <div>
              <h4 style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.8px", color: "var(--terracotta-light)", marginBottom: "16px", textTransform: "uppercase" }}>
                Platform
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", color: "rgba(255, 255, 255, 0.85)" }}>
                <li><Link to="/login" style={{ color: "inherit" }}>Students</Link></li>
                <li><Link to="/login" style={{ color: "inherit" }}>Faculty</Link></li>
                <li><Link to="/login" style={{ color: "inherit" }}>Administration</Link></li>
              </ul>
            </div>

            {/* Column 2: Company */}
            <div>
              <h4 style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.8px", color: "var(--terracotta-light)", marginBottom: "16px", textTransform: "uppercase" }}>
                Company
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", color: "rgba(255, 255, 255, 0.85)" }}>
                <li><a href="#home" style={{ color: "inherit" }}>About</a></li>
                <li><a href="#how-it-works" style={{ color: "inherit" }}>How It Works</a></li>
                <li><a href="#internships" style={{ color: "inherit" }}>Opportunities</a></li>
                <li><span>Contact Office</span></li>
              </ul>
            </div>

            {/* Column 3: Account */}
            <div>
              <h4 style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.8px", color: "var(--terracotta-light)", marginBottom: "16px", textTransform: "uppercase" }}>
                Account
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", color: "rgba(255, 255, 255, 0.85)" }}>
                <li><Link to="/login" style={{ color: "inherit" }}>Sign In</Link></li>
                <li><Link to="/login" style={{ color: "inherit" }}>Get Started</Link></li>
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
          <span>Academic Placement Network</span>
        </div>
      </div>
    </footer>
  );
}
