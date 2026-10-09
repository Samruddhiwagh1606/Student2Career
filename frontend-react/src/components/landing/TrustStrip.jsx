import React from "react";
import { ShieldCheck, TrendingUp, GraduationCap, Award } from "lucide-react";

export function TrustStrip() {
  const benefits = [
    {
      icon: ShieldCheck,
      title: "Verified Opportunities",
      desc: "Vetted internships from approved college recruiter partners",
    },
    {
      icon: TrendingUp,
      title: "Application Tracking",
      desc: "Live 4-stage status updates from submission to interview & selection",
    },
    {
      icon: GraduationCap,
      title: "Faculty Mentorship",
      desc: "Direct evaluation, feedback, and academic credit integration",
    },
    {
      icon: Award,
      title: "Career Momentum",
      desc: "Build verified work experience and industry readiness before graduation",
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
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "28px",
        }}
      >
        {benefits.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "var(--wine-subtle)",
                  color: "var(--wine)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: "15px", fontWeight: 700, color: "var(--charcoal)", marginBottom: "4px" }}>
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
