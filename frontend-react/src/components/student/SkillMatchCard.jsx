import React from "react";
import { Check, AlertTriangle, Sparkles, ShieldCheck } from "lucide-react";

export function SkillMatchCard({ skillMatch }) {
  if (!skillMatch) return null;

  const {
    available,
    match_percentage,
    total_required,
    matched_count,
    matching_skills = [],
    missing_skills = [],
    is_verified = true,
  } = skillMatch;

  if (!available || total_required === 0) {
    return (
      <div
        style={{
          background: "var(--cream)",
          borderRadius: "16px",
          padding: "20px",
          border: "1px solid var(--border)",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.8px", color: "var(--muted)", textTransform: "uppercase" }}>
              SKILL MATCH STATUS
            </span>
            <h4 style={{ fontSize: "16px", fontWeight: 700, color: "var(--charcoal)", marginTop: "4px" }}>
              Skill match unavailable
            </h4>
          </div>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              padding: "4px 12px",
              borderRadius: "20px",
              background: "var(--warm-white)",
              color: "var(--muted)",
              border: "1px solid var(--border)",
            }}
          >
            No Required Skills Listed
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "20px",
        padding: "24px",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
        marginBottom: "24px",
      }}
    >
      {/* Top Header & Percentage Pill */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: "16px",
          borderBottom: "1px solid var(--border-light)",
          marginBottom: "18px",
        }}
      >
        <div>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1px",
              color: "var(--terracotta)",
              textTransform: "uppercase",
              display: "block",
            }}
          >
            YOUR SKILL MATCH
          </span>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "4px" }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "36px",
                fontWeight: 800,
                color: "var(--wine)",
                lineHeight: 1,
              }}
            >
              {match_percentage}%
            </span>
            <span style={{ fontSize: "13px", color: "var(--muted)", fontWeight: 600 }}>
              ({matched_count} of {total_required} required skills matched)
            </span>
          </div>
        </div>

        {is_verified && (
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "20px",
              background: "var(--cream)",
              color: "var(--wine)",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              border: "1px solid rgba(122, 31, 61, 0.15)",
            }}
          >
            <ShieldCheck size={13} /> Verified by Institution
          </span>
        )}
      </div>

      {/* Progress Bar Visualization */}
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            height: "8px",
            width: "100%",
            background: "var(--warm-white)",
            borderRadius: "4px",
            overflow: "hidden",
            border: "1px solid var(--border-light)",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${match_percentage}%`,
              background: match_percentage >= 75 ? "var(--wine)" : match_percentage >= 50 ? "var(--terracotta)" : "var(--yellow)",
              borderRadius: "4px",
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </div>

      {/* Matching Skills */}
      <div style={{ marginBottom: "16px" }}>
        <h5 style={{ fontSize: "12px", fontWeight: 700, color: "var(--charcoal)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Matching Skills ({matching_skills.length})
        </h5>
        {matching_skills.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {matching_skills.map((skill, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "5px 12px",
                  borderRadius: "8px",
                  background: "var(--green-bg)",
                  color: "var(--green)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  border: "1px solid rgba(64, 112, 80, 0.18)",
                }}
              >
                <Check size={13} /> {skill}
              </span>
            ))}
          </div>
        ) : (
          <span style={{ fontSize: "13px", color: "var(--muted)", italic: "true" }}>No matching skills yet</span>
        )}
      </div>

      {/* Missing Skills */}
      {missing_skills.length > 0 && (
        <div>
          <h5 style={{ fontSize: "12px", fontWeight: 700, color: "var(--charcoal)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Missing Skills ({missing_skills.length})
          </h5>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {missing_skills.map((skill, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "5px 12px",
                  borderRadius: "8px",
                  background: "var(--terracotta-subtle)",
                  color: "var(--terracotta)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  border: "1px solid rgba(231, 111, 81, 0.2)",
                }}
              >
                <AlertTriangle size={13} /> {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
