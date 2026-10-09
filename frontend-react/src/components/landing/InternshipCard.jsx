import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../common/Button";
import { Building2, MapPin, Clock, ArrowRight, DollarSign } from "lucide-react";

export function InternshipCard({ internship }) {
  const navigate = useNavigate();

  const title = internship?.title || "Software Engineering Intern";
  const company = internship?.company_name || "TechCorp Innovations";
  const location = internship?.location || "Bangalore / Hybrid";
  const stipend = internship?.stipend ? `₹${internship.stipend}/mo` : "Stipend Disclosed";
  const duration = internship?.duration || "3 - 6 Months";
  const domain = internship?.department || "Computer Science";

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
        gap: "20px",
      }}
      className="card-hover"
    >
      <div>
        {/* Top Badges */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
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
            {company.charAt(0).toUpperCase()}
          </div>

          <span
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "var(--wine)",
              background: "var(--cream)",
              padding: "4px 12px",
              borderRadius: "20px",
            }}
          >
            {stipend}
          </span>
        </div>

        {/* Title & Company */}
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", marginBottom: "6px" }}>
          {title}
        </h3>

        <div style={{ fontSize: "14px", color: "var(--muted)", display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
          <Building2 size={15} />
          {company}
        </div>

        {/* Meta Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
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
            <MapPin size={13} style={{ color: "var(--muted)" }} />
            {location}
          </span>

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
            <Clock size={13} style={{ color: "var(--muted)" }} />
            {duration}
          </span>
        </div>
      </div>

      {/* Footer / Apply Action */}
      <div
        style={{
          paddingTop: "16px",
          borderTop: "1px solid var(--border-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--terracotta)" }}>
          {domain}
        </span>

        <Button
          size="sm"
          variant="primary"
          onClick={() => navigate("/login")}
          icon={ArrowRight}
        >
          View & Apply
        </Button>
      </div>
    </div>
  );
}
