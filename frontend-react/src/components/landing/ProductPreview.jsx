import React from "react";
import { Check, ArrowRight, Sparkles, Calendar, Send, Building2, MapPin, Clock } from "lucide-react";

export function ProductPreview() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "540px",
        margin: "0 auto",
      }}
    >
      {/* Decorative Glow & Shape Backdrop */}
      <div
        style={{
          position: "absolute",
          top: "-30px",
          right: "-30px",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(231, 111, 81, 0.22) 0%, rgba(122, 31, 61, 0.05) 60%, rgba(122, 31, 61, 0) 80%)",
          filter: "blur(24px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-20px",
          left: "-20px",
          width: "240px",
          height: "240px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(122, 31, 61, 0.15) 0%, rgba(255, 247, 237, 0) 70%)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      {/* Main Layered Container Card */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          transform: "rotate(-1.5deg)",
          transition: "transform 0.3s ease",
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "24px",
            padding: "28px",
            boxShadow: "0 20px 50px rgba(62, 29, 39, 0.14)",
            border: "1px solid var(--border)",
          }}
        >
          {/* Header Strip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: "16px",
              marginBottom: "20px",
              borderBottom: "1px solid var(--border-light)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "var(--wine-subtle)",
                  color: "var(--wine)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Building2 size={18} />
              </div>
              <div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.8px",
                    color: "var(--terracotta)",
                    textTransform: "uppercase",
                    display: "block",
                  }}
                >
                  INTERNSHIP OPPORTUNITY
                </span>
                <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 500 }}>
                  College Placement Portal
                </span>
              </div>
            </div>

            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: "20px",
                background: "var(--cream)",
                color: "var(--wine)",
                border: "1px solid rgba(122, 31, 61, 0.15)",
              }}
            >
              Verified Partner
            </span>
          </div>

          {/* Job Details Block */}
          <div style={{ marginBottom: "20px" }}>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: 800,
                color: "var(--charcoal)",
                marginBottom: "4px",
              }}
            >
              Software Developer Intern
            </h3>
            <div
              style={{
                fontSize: "14px",
                color: "var(--muted)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <strong style={{ color: "var(--charcoal)", fontWeight: 600 }}>TechNova Solutions</strong>
              <span>•</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <MapPin size={13} style={{ color: "var(--terracotta)" }} />
                Pune (Hybrid)
              </span>
            </div>
          </div>

          {/* Skill Match Indicator */}
          <div
            style={{
              background: "var(--warm-white)",
              borderRadius: "14px",
              padding: "16px",
              border: "1px solid var(--border-light)",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--charcoal)" }}>
                Skill Match
              </span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 800,
                  color: "var(--wine)",
                }}
              >
                87% Match
              </span>
            </div>

            {/* Skill Pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: "8px",
                  background: "var(--green-bg)",
                  color: "var(--green)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                Java <Check size={13} />
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: "8px",
                  background: "var(--green-bg)",
                  color: "var(--green)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                SQL <Check size={13} />
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: "8px",
                  background: "var(--green-bg)",
                  color: "var(--green)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                Git <Check size={13} />
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: "8px",
                  background: "var(--cream)",
                  color: "var(--wine)",
                  border: "1px dashed var(--wine)",
                }}
              >
                Spring Boot +
              </span>
            </div>
          </div>

          {/* Stipend & Duration Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "14px",
              borderTop: "1px solid var(--border-light)",
            }}
          >
            <div>
              <span style={{ fontSize: "16px", fontWeight: 800, color: "var(--wine)", display: "block" }}>
                ₹20,000 / mo
              </span>
              <span style={{ fontSize: "12px", color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <Clock size={12} /> 3 Months Duration
              </span>
            </div>

            <div
              style={{
                background: "var(--wine)",
                color: "#FFFFFF",
                padding: "8px 16px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 4px 12px rgba(122, 31, 61, 0.25)",
              }}
            >
              View Opportunity <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Floating UI Element 1: Match Found */}
      <div
        style={{
          position: "absolute",
          top: "-18px",
          left: "-24px",
          background: "#FFFFFF",
          borderRadius: "30px",
          padding: "8px 16px",
          boxShadow: "var(--shadow-md)",
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          zIndex: 3,
        }}
      >
        <Sparkles size={16} style={{ color: "var(--terracotta)" }} />
        <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--charcoal)" }}>
          Internship Match Found
        </span>
      </div>

      {/* Subtle Floating UI Element 2: Application Submitted */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          right: "-30px",
          background: "#FFFFFF",
          borderRadius: "16px",
          padding: "10px 16px",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          zIndex: 4,
        }}
      >
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "var(--wine-subtle)",
            color: "var(--wine)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Send size={14} />
        </div>
        <div>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--charcoal)" }}>
            Application Submitted
          </div>
          <div style={{ fontSize: "10px", color: "var(--muted)" }}>
            Shortlisted by Faculty
          </div>
        </div>
      </div>

      {/* Subtle Floating UI Element 3: Interview Scheduled */}
      <div
        style={{
          position: "absolute",
          bottom: "-24px",
          left: "20px",
          background: "var(--cream)",
          borderRadius: "16px",
          padding: "8px 14px",
          boxShadow: "var(--shadow-sm)",
          border: "1px solid rgba(122, 31, 61, 0.15)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          zIndex: 3,
        }}
      >
        <Calendar size={14} style={{ color: "var(--wine)" }} />
        <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--wine)" }}>
          Interview Scheduled • Oct 10
        </span>
      </div>
    </div>
  );
}
