import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../common/Button";
import { ProductPreview } from "./ProductPreview";
import { ArrowRight, ShieldCheck } from "lucide-react";

export function HeroSection() {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    const el = document.getElementById("how-it-works");
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
        padding: "80px 24px 90px",
        maxWidth: "1280px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
        gap: "56px",
        alignItems: "center",
      }}
    >
      {/* Left Column: Editorial Hero Typography & CTAs */}
      <div>
        {/* Eyebrow Tag */}
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

        {/* Large Editorial Headline */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(42px, 5.2vw, 64px)",
            fontWeight: 800,
            lineHeight: 1.1,
            color: "var(--charcoal)",
            letterSpacing: "-0.03em",
            marginBottom: "24px",
          }}
        >
          Your College Journey. <br />
          <span style={{ color: "var(--wine)" }}>Your Career, Next.</span>
        </h1>

        {/* Supporting Copy */}
        <p
          style={{
            fontSize: "18px",
            color: "var(--muted)",
            lineHeight: 1.6,
            maxWidth: "540px",
            marginBottom: "38px",
          }}
        >
          Discover internships that match your skills, manage applications, connect with faculty, and turn your college experience into real career opportunities.
        </p>

        {/* Primary & Secondary Action CTAs */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate("/login")}
            icon={ArrowRight}
            style={{ padding: "14px 28px", fontSize: "16px", fontWeight: 700 }}
          >
            Start Your Journey
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={scrollToHowItWorks}
            style={{ borderColor: "var(--wine)", color: "var(--wine)", padding: "14px 24px", fontSize: "15px", fontWeight: 600 }}
          >
            See How It Works
          </Button>
        </div>

        {/* Micro Credibility Strip */}
        <div
          style={{
            marginTop: "48px",
            paddingTop: "28px",
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

      {/* Right Column: Layered Product Preview */}
      <div>
        <ProductPreview />
      </div>
    </section>
  );
}
