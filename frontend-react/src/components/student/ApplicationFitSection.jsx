import React from "react";
import { Check, ShieldCheck, AlertCircle, Info, FileText, Calendar, GraduationCap } from "lucide-react";

export function ApplicationFitSection({ fitData, skillMatch }) {
  if (!fitData) return null;

  const {
    department_match,
    student_department,
    internship_domain,
    deadline_open,
    deadline_date,
    resume_available,
    gpa_available,
    student_gpa,
  } = fitData;

  const matchPct = skillMatch?.match_percentage;
  const isSkillAvailable = skillMatch?.available;

  return (
    <div
      style={{
        background: "var(--warm-white)",
        borderRadius: "16px",
        padding: "20px 24px",
        border: "1px solid var(--border)",
        marginBottom: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: "12px",
          borderBottom: "1px solid var(--border-light)",
          marginBottom: "14px",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "1px",
            color: "var(--wine)",
            textTransform: "uppercase",
          }}
        >
          YOUR APPLICATION FIT
        </span>

        {isSkillAvailable && matchPct !== null && (
          <span
            style={{
              fontSize: "12px",
              fontWeight: 800,
              padding: "4px 10px",
              borderRadius: "20px",
              background: "var(--cream)",
              color: "var(--wine)",
              border: "1px solid rgba(122, 31, 61, 0.15)",
            }}
          >
            {matchPct}% Skill Match
          </span>
        )}
      </div>

      {/* Checklist items */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
        {/* Department Fit */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
          {department_match ? (
            <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "var(--green-bg)", color: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={12} />
            </div>
          ) : (
            <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "var(--yellow-bg)", color: "var(--yellow)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Info size={12} />
            </div>
          )}
          <span style={{ color: "var(--charcoal)", fontWeight: 500 }}>
            {department_match
              ? `Department match (${student_department} → ${internship_domain})`
              : `Department: ${student_department || "Not specified"}`}
          </span>
        </div>

        {/* Deadline Status */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
          {deadline_open ? (
            <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "var(--green-bg)", color: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={12} />
            </div>
          ) : (
            <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "var(--red-bg)", color: "var(--red)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AlertCircle size={12} />
            </div>
          )}
          <span style={{ color: "var(--charcoal)", fontWeight: 500 }}>
            {deadline_open ? "Application deadline open" : "Application deadline passed"}
            {deadline_date && ` (${new Date(deadline_date).toLocaleDateString()})`}
          </span>
        </div>

        {/* Resume Availability */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
          {resume_available ? (
            <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "var(--green-bg)", color: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={12} />
            </div>
          ) : (
            <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "var(--yellow-bg)", color: "var(--yellow)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Info size={12} />
            </div>
          )}
          <span style={{ color: "var(--charcoal)", fontWeight: 500 }}>
            {resume_available ? "Resume profile attached" : "No uploaded resume found in profile"}
          </span>
        </div>

        {/* Verified Institution Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
          <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "var(--cream)", color: "var(--wine)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShieldCheck size={12} />
          </div>
          <span style={{ color: "var(--charcoal)", fontWeight: 500 }}>
            Verified by Institution
          </span>
        </div>
      </div>

      {/* Non-blocking Notice */}
      <div style={{ fontSize: "11px", color: "var(--muted)", fontStyle: "italic", borderTop: "1px solid var(--border-light)", paddingTop: "8px" }}>
        Note: Skill match score is informational and does not block application submission.
      </div>
    </div>
  );
}
