import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { LoadingState, ErrorState } from "../../components/common/FeedbackStates";
import {
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  FileText,
  ShieldCheck,
  BookOpen,
} from "lucide-react";

export function FacultyReadiness() {
  const [readinessData, setReadinessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReadiness();
  }, []);

  const loadReadiness = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getFacultyDepartmentReadiness();
      setReadinessData(res);
    } catch (err) {
      console.error("Readiness monitoring fetch error:", err);
      setError("Unable to calculate department career readiness.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState message="Analyzing department skill coverage & career readiness..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadReadiness} />;
  }

  const department = readinessData?.department || "Academic Department";
  const totalStudents = readinessData?.total_students || 0;
  const profileStats = readinessData?.profile_completeness || { with_resume: 0, resume_pct: 0, with_cgpa: 0, cgpa_pct: 0 };
  const missingSkills = readinessData?.missing_skills_analysis || [];
  const acquiredSkills = readinessData?.skills_acquired || [];
  const guidance = readinessData?.practical_guidance || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }} className="animate-fade-in">
      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1.2px",
              color: "var(--wine)",
              background: "var(--wine-subtle)",
              padding: "4px 10px",
              borderRadius: "14px",
              textTransform: "uppercase",
            }}
          >
            MODULE 4: CAREER READINESS MONITORING
          </span>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--muted)",
              background: "var(--cream)",
              padding: "4px 10px",
              borderRadius: "14px",
            }}
          >
            {department}
          </span>
        </div>
        <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
          Department Career Readiness & Skill Gaps
        </h1>
        <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px" }}>
          Data-grounded insights comparing students' verified competencies with current approved campus opportunity requirements.
        </p>
      </div>

      {/* Methodological Transparency Callout */}
      <div
        style={{
          background: "var(--cream)",
          border: "1px solid var(--border)",
          borderLeft: "5px solid var(--terracotta)",
          borderRadius: "14px",
          padding: "16px 20px",
          fontSize: "13px",
          color: "var(--charcoal)",
          display: "flex",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <ShieldCheck size={22} color="var(--terracotta)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Grounded Academic Analysis:</strong> These indicators are derived directly from real database records of approved internships and student skill profiles. They represent verifiable competency matching and are not speculative AI predictions.
        </span>
      </div>

      {/* Profile Readiness Overview */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "18px" }}>
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "18px",
            padding: "24px",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--muted)" }}>Resume Upload Rate</span>
            <FileText size={18} color="var(--wine)" />
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--charcoal)", fontFamily: "var(--font-display)" }}>
            {profileStats.resume_pct}%
          </div>
          <span style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "4px", display: "block" }}>
            {profileStats.with_resume} of {totalStudents} department students have an active resume uploaded.
          </span>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "18px",
            padding: "24px",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--muted)" }}>CGPA Benchmark Compliance</span>
            <Award size={18} color="var(--wine)" />
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--charcoal)", fontFamily: "var(--font-display)" }}>
            {profileStats.cgpa_pct}%
          </div>
          <span style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "4px", display: "block" }}>
            {profileStats.with_cgpa} of {totalStudents} students have documented CGPA on the 0.00–10.00 scale.
          </span>
        </div>
      </div>

      {/* Two Columns: Missing Skills vs In-Demand Skills */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "24px" }}>
        {/* Missing Skills in Department */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            padding: "28px",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
            <AlertTriangle size={20} color="var(--terracotta)" />
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
              High-Demand Skill Gaps
            </h3>
          </div>
          <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "18px" }}>
            Skills required by approved campus recruiters that are currently lacking among students in {department}.
          </p>

          {missingSkills.length === 0 ? (
            <p style={{ color: "var(--green)", fontSize: "13.5px", fontWeight: 600 }}>
              All in-demand skills have active student coverage!
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {missingSkills.map((sk, idx) => (
                <div key={idx} style={{ background: "var(--warm-white)", padding: "14px 16px", borderRadius: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <strong style={{ color: "var(--charcoal)", fontSize: "14px" }}>{sk.skill_name}</strong>
                    <span style={{ fontSize: "12px", color: "var(--terracotta)", fontWeight: 700 }}>
                      {sk.students_lacking_skill} students need this
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--muted)", marginBottom: "4px" }}>
                    <span>Recruiter Postings: {sk.industry_demand_count}</span>
                    <span>Department Coverage: {sk.coverage_pct}%</span>
                  </div>
                  <div style={{ height: "6px", background: "var(--cream)", borderRadius: "3px", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${sk.coverage_pct}%`,
                        height: "100%",
                        background: sk.coverage_pct >= 50 ? "var(--green)" : "var(--terracotta)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Existing Strengths & Advisor Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Department Competencies */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "20px",
              padding: "28px",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
              <TrendingUp size={20} color="var(--wine)" />
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
                Verified Department Strengths
              </h3>
            </div>

            {acquiredSkills.length === 0 ? (
              <p style={{ color: "var(--muted)", fontSize: "13.5px" }}>No student skills verified yet.</p>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {acquiredSkills.map((sk, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "var(--cream)",
                      border: "1px solid rgba(122, 31, 61, 0.15)",
                      borderRadius: "10px",
                      padding: "8px 14px",
                      fontSize: "13px",
                    }}
                  >
                    <strong style={{ color: "var(--wine)" }}>{sk.skill_name}</strong>
                    <span style={{ fontSize: "11.5px", color: "var(--muted)", display: "block" }}>
                      {sk.student_count} student{sk.student_count > 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Practical Next-Step Advisory Suggestions */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "20px",
              padding: "28px",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <Lightbulb size={20} color="var(--wine)" />
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
                Recommended Faculty Actions
              </h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {guidance.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    fontSize: "13px",
                    color: "var(--charcoal)",
                    lineHeight: 1.5,
                  }}
                >
                  <CheckCircle2 size={16} color="var(--green)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default FacultyReadiness;
