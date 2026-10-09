import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../common/Button";
import { ArrowRight, Search } from "lucide-react";

export function CTASection() {
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
      style={{
        padding: "90px 24px",
        maxWidth: "1280px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, var(--wine) 0%, #5B1730 65%, #3E1020 100%)",
          borderRadius: "28px",
          padding: "64px 40px",
          textAlign: "center",
          color: "#FFFFFF",
          boxShadow: "var(--shadow-xl)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle Ambient CSS Glow Elements */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(231, 111, 81, 0.25) 0%, rgba(122, 31, 61, 0) 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 2, maxWidth: "660px", margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(30px, 4vw, 44px)",
              fontWeight: 800,
              marginBottom: "16px",
              color: "#FFFFFF",
            }}
          >
            Your Next Opportunity Starts Here.
          </h2>

          <p
            style={{
              fontSize: "16px",
              color: "var(--cream)",
              lineHeight: 1.6,
              opacity: 0.95,
              marginBottom: "36px",
            }}
          >
            Join students, faculty mentors, and administrators using College2Career to discover opportunities, track applications, and launch successful careers.
          </p>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <Button
              variant="secondary"
              size="lg"
              onClick={scrollToInternships}
              icon={Search}
              style={{ background: "#FFFFFF", color: "var(--wine)", border: "none" }}
            >
              Explore Internships
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/login")}
              icon={ArrowRight}
              style={{ borderColor: "rgba(255, 255, 255, 0.5)", color: "#FFFFFF" }}
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
