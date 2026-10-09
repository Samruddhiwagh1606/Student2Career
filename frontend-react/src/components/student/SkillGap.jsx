import React from "react";
import { AlertCircle, Lightbulb } from "lucide-react";

export function SkillGap({ missingSkills = [] }) {
  if (!missingSkills || missingSkills.length === 0) return null;

  const count = missingSkills.length;
  const skillLabel = count === 1 ? "1 skill" : `${count} skills`;

  return (
    <div
      style={{
        background: "var(--cream)",
        borderRadius: "16px",
        padding: "20px 24px",
        border: "1px solid rgba(231, 111, 81, 0.25)",
        marginBottom: "24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "var(--terracotta-subtle)",
            color: "var(--terracotta)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <AlertCircle size={20} />
        </div>
        <div>
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.8px", color: "var(--terracotta)", textTransform: "uppercase" }}>
            YOUR SKILL GAP
          </span>
          <h4 style={{ fontSize: "15px", fontWeight: 700, color: "var(--charcoal)", marginTop: "2px" }}>
            You're missing {skillLabel} commonly required for this internship.
          </h4>
        </div>
      </div>

      {/* Skill Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px", paddingLeft: "48px" }}>
        {missingSkills.map((skill, idx) => (
          <span
            key={idx}
            style={{
              fontSize: "12px",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "6px",
              background: "#FFFFFF",
              color: "var(--wine)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-xs)",
            }}
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Guidance Message */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          paddingLeft: "48px",
          fontSize: "12px",
          color: "var(--muted)",
          fontWeight: 500,
        }}
      >
        <Lightbulb size={14} style={{ color: "var(--terracotta)" }} />
        Developing these skills could improve your internship readiness.
      </div>
    </div>
  );
}
