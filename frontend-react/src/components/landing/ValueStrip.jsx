import React from "react";
import { ShieldCheck, TrendingUp, GraduationCap, Award } from "lucide-react";

export function ValueStrip() {
  const points = [
    {
      icon: ShieldCheck,
      title: "VERIFIED OPPORTUNITIES",
      desc: "Vetted internships from approved college recruiter partners",
    },
    {
      icon: TrendingUp,
      title: "APPLICATION TRACKING",
      desc: "Live status updates from submission to interview & decision",
    },
    {
      icon: GraduationCap,
      title: "FACULTY MENTORSHIP",
      desc: "Direct evaluation, feedback & academic credit integration",
    },
    {
      icon: Award,
      title: "CAREER PROGRESS",
      desc: "Build verified work experience before graduation",
    },
  ];

  return (
    <div
      style={{
        background: "var(--cream)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        padding: "36px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "32px",
        }}
      >
        {points.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "#FFFFFF",
                  color: "var(--wine)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 2px 8px rgba(122, 31, 61, 0.08)",
                  border: "1px solid var(--border-light)",
                }}
              >
                <Icon size={22} />
              </div>
              <div>
                <h4
                  style={{
                    fontSize: "13px",
                    fontWeight: 800,
                    letterSpacing: "0.8px",
                    color: "var(--charcoal)",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                  }}
                >
                  {item.title}
                </h4>
                <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.45 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
