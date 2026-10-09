import React from "react";
import { Button } from "../common/Button";
import { Building2, MapPin, Clock, ArrowRight, ShieldCheck, Check, AlertTriangle } from "lucide-react";

export function RecommendedInternshipCard({ internship = {}, onView }) {
  if (!internship) return null;

  const {
    title = "Internship Opportunity",
    company_name = "Partner Company",
    domain = "General",
    stipend,
    duration_weeks,
    location,
    skill_match = {},
    is_verified = true,
  } = internship || {};

  const {
    available = false,
    match_percentage = null,
    total_required = 0,
    matched_count = 0,
    matching_skills = [],
    missing_skills = [],
  } = skill_match || {};

  const safeMatching = Array.isArray(matching_skills) ? matching_skills : [];
  const safeMissing = Array.isArray(missing_skills) ? missing_skills : [];

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "20px",
        padding: "24px",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "18px",
      }}
      className="card-hover"
    >
      <div>
        {/* Top Header: Company Avatar & Match Badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "var(--wine)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "16px",
              }}
            >
              {(company_name || title || "C").charAt(0).toUpperCase()}
            </div>
            <div>
              <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 500, display: "block" }}>
                {domain || "General"}
              </span>
              <strong style={{ fontSize: "14px", color: "var(--charcoal)", fontWeight: 700 }}>
                {company_name}
              </strong>
            </div>
          </div>

          {available && match_percentage !== null ? (
            <span
              style={{
                fontSize: "13px",
                fontWeight: 800,
                color: match_percentage >= 75 ? "var(--wine)" : "var(--terracotta)",
                background: match_percentage >= 75 ? "var(--cream)" : "var(--terracotta-subtle)",
                padding: "4px 12px",
                borderRadius: "20px",
                border: match_percentage >= 75 ? "1px solid rgba(122, 31, 61, 0.2)" : "1px solid rgba(231, 111, 81, 0.2)",
              }}
            >
              {match_percentage}% Match
            </span>
          ) : (
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--muted)",
                background: "var(--warm-white)",
                padding: "4px 10px",
                borderRadius: "20px",
                border: "1px solid var(--border)",
              }}
            >
              Skill Match Unavailable
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--charcoal)", marginBottom: "8px" }}>
          {title}
        </h3>

        {/* Location & Duration Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
          {location && (
            <span
              style={{
                fontSize: "12px",
                color: "var(--charcoal)",
                background: "var(--warm-white)",
                padding: "4px 10px",
                borderRadius: "8px",
                border: "1px solid var(--border-light)",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <MapPin size={12} style={{ color: "var(--terracotta)" }} />
              {location}
            </span>
          )}

          {duration_weeks && (
            <span
              style={{
                fontSize: "12px",
                color: "var(--charcoal)",
                background: "var(--warm-white)",
                padding: "4px 10px",
                borderRadius: "8px",
                border: "1px solid var(--border-light)",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Clock size={12} style={{ color: "var(--muted)" }} />
              {duration_weeks} Weeks
            </span>
          )}

          {is_verified && (
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--wine)",
                background: "var(--cream)",
                padding: "4px 10px",
                borderRadius: "8px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <ShieldCheck size={13} /> Verified by Institution
            </span>
          )}
        </div>

        {/* Skill Breakdown Summary */}
        {available && total_required > 0 && (
          <div
            style={{
              background: "var(--warm-white)",
              borderRadius: "12px",
              padding: "12px",
              border: "1px solid var(--border-light)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--muted)", fontWeight: 600, marginBottom: "8px" }}>
              <span>Matched: {matched_count} / {total_required} skills</span>
              {safeMissing.length > 0 && (
                <span style={{ color: "var(--terracotta)" }}>{safeMissing.length} missing</span>
              )}
            </div>

            {/* Matching skill tags preview */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {safeMatching.slice(0, 3).map((sk, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: "6px",
                    background: "var(--green-bg)",
                    color: "var(--green)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Check size={11} /> {sk}
                </span>
              ))}
              {safeMissing.slice(0, 1).map((sk, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: "6px",
                    background: "var(--terracotta-subtle)",
                    color: "var(--terracotta)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <AlertTriangle size={11} /> {sk}
                </span>
              ))}
              {safeMatching.length > 3 && (
                <span style={{ fontSize: "11px", color: "var(--muted)", alignSelf: "center" }}>
                  +{safeMatching.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div
        style={{
          paddingTop: "14px",
          borderTop: "1px solid var(--border-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: "15px", fontWeight: 800, color: "var(--wine)" }}>
          {stipend ? `₹${Number(stipend).toLocaleString()}/mo` : "Stipend Disclosed"}
        </span>

        <Button
          size="sm"
          variant="primary"
          onClick={() => onView && onView(internship)}
          icon={ArrowRight}
        >
          View Opportunity
        </Button>
      </div>
    </div>
  );
}
