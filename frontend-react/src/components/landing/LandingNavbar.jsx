import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../common/Button";
import { ArrowRight, Menu, X } from "lucide-react";

export function LandingNavbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(250, 249, 247, 0.94)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        transition: "all var(--transition-normal)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left: Brand Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "var(--wine)",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "16px",
              boxShadow: "0 4px 14px rgba(122, 31, 61, 0.25)",
              letterSpacing: "-0.02em",
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
                color: "var(--charcoal)",
                display: "block",
                lineHeight: 1.1,
              }}
            >
              College2Career
            </span>
            <span style={{ fontSize: "11px", color: "var(--muted)", fontWeight: 500 }}>
              College Internship Management System
            </span>
          </div>
        </Link>

        {/* Center/Right: Nav Links */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
          }}
          className="desktop-nav-links"
        >
          <a
            href="#home"
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--charcoal)",
            }}
          >
            Home
          </a>
          <a
            href="#internships"
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--muted)",
            }}
          >
            Internships
          </a>
          <a
            href="#how-it-works"
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--muted)",
            }}
          >
            How It Works
          </a>
          <a
            href="#students"
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--muted)",
            }}
          >
            For Students
          </a>
          <a
            href="#roles"
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--muted)",
            }}
          >
            Portals
          </a>
        </nav>

        {/* Right: Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/login")}
            style={{ borderColor: "var(--wine)", color: "var(--wine)", fontWeight: 600 }}
          >
            Sign In
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate("/login")}
            icon={ArrowRight}
          >
            Get Started
          </Button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              padding: "6px",
              color: "var(--charcoal)",
              display: "none",
            }}
            className="landing-mobile-menu-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            background: "var(--warm-white)",
            borderBottom: "1px solid var(--border)",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <a
            href="#home"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: "15px", fontWeight: 600, color: "var(--charcoal)" }}
          >
            Home
          </a>
          <a
            href="#internships"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: "15px", fontWeight: 500, color: "var(--muted)" }}
          >
            Internships
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: "15px", fontWeight: 500, color: "var(--muted)" }}
          >
            How It Works
          </a>
          <a
            href="#students"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: "15px", fontWeight: 500, color: "var(--muted)" }}
          >
            For Students
          </a>
          <a
            href="#roles"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: "15px", fontWeight: 500, color: "var(--muted)" }}
          >
            Portals
          </a>
        </div>
      )}
    </header>
  );
}
