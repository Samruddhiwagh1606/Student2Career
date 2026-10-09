import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../common/Button";
import { ProductPreview } from "./ProductPreview";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";

export function Hero() {
  const navigate = useNavigate();

  const scrollToInternships = () => {
    const el = document.getElementById("internships");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/login");
    }
  };

  return (
    <section
      id="home"
      style={{
        padding: "70px 24px 80px",
        maxWidth: "1280px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
        gap: "48px",
        alignItems: "center",
      }}
    >
      {/* Left Text Area */}
      <div>
        {/* Brand Tag Pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "20px",
            background: "var(--cream)",
            border: "1px solid rgba(122, 31, 61, 0.15)",
            marginBottom: "24px",
          }}
        >
          <ShieldCheck size={16} style={{ color: "var(--wine)" }} />
          <span
            style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.8px",
              color: "var(--wine)",
              textTransform: "uppercase",
            }}
          >
            COLLEGE INTERNSHIP MANAGEMENT PLATFORM
          </span>
        </div>

        {/* Hero Display Headline */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(38px, 4.5vw, 56px)",
            fontWeight: 800,
            lineHeight: 1.12,
            color: "var(--charcoal)",
            letterSpacing: "-0.03em",
            marginBottom: "20px",
          }}
        >
          Turn Your College Experience <br />
          <span style={{ color: "var(--wine)" }}>Into Your Career.</span>
        </h1>

        {/* Supporting Text */}
        <p
          style={{
            fontSize: "17px",
            color: "var(--muted)",
            lineHeight: 1.6,
            maxWidth: "520px",
            marginBottom: "36px",
          }}
        >
          College2Career connects students, faculty mentors, and verified recruiters in a unified portal. Discover verified internships, track applications live, and convert academic performance into career momentum.
        </p>

        {/* Action CTAs */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <Button
            variant="primary"
            size="lg"
            onClick={scrollToInternships}
            icon={Search}
          >
            Explore Internships
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/login")}
            icon={ArrowRight}
          >
            Get Started
          </Button>
        </div>

        {/* Quick Micro Stats */}
        <div
          style={{
            marginTop: "44px",
            paddingTop: "24px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: "32px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <span style={{ fontSize: "24px", fontWeight: 800, color: "var(--wine)", display: "block" }}>100+</span>
            <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 500 }}>Approved Openings</span>
          </div>
          <div style={{ width: "1px", height: "30px", background: "var(--border)" }} />
          <div>
            <span style={{ fontSize: "24px", fontWeight: 800, color: "var(--terracotta)", display: "block" }}>100%</span>
            <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 500 }}>Verified Recruiter Listings</span>
          </div>
          <div style={{ width: "1px", height: "30px", background: "var(--border)" }} />
          <div>
            <span style={{ fontSize: "24px", fontWeight: 800, color: "var(--charcoal)", display: "block" }}>Direct</span>
            <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 500 }}>Faculty Guidance</span>
          </div>
        </div>
      </div>

      {/* Right Interactive Product Preview */}
      <div>
        <ProductPreview />
      </div>
    </section>
  );
}
