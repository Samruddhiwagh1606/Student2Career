import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { StatCard } from "../../components/common/StatCard";
import { Button } from "../../components/common/Button";
import { LoadingState, ErrorState } from "../../components/common/FeedbackStates";
import {
  Users,
  GraduationCap,
  Award,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Clock,
} from "lucide-react";

export function FacultyDashboard() {
  const { faculty, user } = useAuth();
  const navigate = useNavigate();

  const [deptSummary, setDeptSummary] = useState(null);
  const [deptStudents, setDeptStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);

        // Fetch department summary (server enforces faculty department scope)
        const sumRes = await api.getFacultyDepartmentSummary().catch(() => null);
        if (sumRes?.summary) {
          setDeptSummary(sumRes);
        }

        // Fetch first few department students
        const stRes = await api.getFacultyDepartmentStudents({ limit: 5 }).catch(() => null);
        if (stRes?.students) {
          setDeptStudents(stRes.students.slice(0, 5));
        }
      } catch (err) {
        console.error("Faculty dashboard fetch error:", err);
        setError("Unable to load department dashboard metrics.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return <LoadingState message="Loading Department Faculty Portal..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  const facultyName = deptSummary?.faculty_name || faculty?.name || user?.profile?.name || "Faculty Advisor";
  const department = deptSummary?.department || faculty?.department || user?.profile?.department || "Academic Department";
  const stats = deptSummary?.summary || {
    total_students: 0,
    unique_placed: 0,
    campus_placed: 0,
    off_campus_placed: 0,
    pending_off_campus: 0,
    average_cgpa: "N/A",
    placement_rate: "0%",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }} className="animate-fade-in">
      {/* Welcome Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--wine) 0%, #5B1730 65%, #3E1020 100%)",
          color: "#FFF7ED",
          borderRadius: "24px",
          padding: "36px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "24px",
          boxShadow: "var(--shadow-md)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "1.5px",
                color: "#D6A84F",
                background: "rgba(214, 168, 79, 0.18)",
                padding: "6px 14px",
                borderRadius: "20px",
                textTransform: "uppercase",
              }}
            >
              MODULE 4: FACULTY PORTAL
            </span>
            <span style={{ fontSize: "12px", color: "#FFF7ED", opacity: 0.85 }}>
              DEPARTMENT OF {department.toUpperCase()}
            </span>
          </div>

          <h2 style={{ fontSize: "30px", fontWeight: 700, color: "#FFF7ED", margin: 0, fontFamily: "var(--font-display)" }}>
            Welcome, Prof. {facultyName}
          </h2>

          <p style={{ fontSize: "14.5px", color: "#FFF7ED", marginTop: "10px", opacity: 0.92, maxWidth: "600px", lineHeight: 1.5 }}>
            Department coordinator advisory dashboard. Monitor student career readiness, CGPA compliance, verified internship outcomes, and placement progress for <strong>{department}</strong>.
          </p>
        </div>

        <div style={{ display: "flex", gap: "14px", position: "relative", zIndex: 2, flexWrap: "wrap" }}>
          <Button
            variant="secondary"
            icon={Users}
            onClick={() => navigate("/faculty/students")}
            style={{
              background: "#FFFFFF",
              color: "var(--wine)",
              border: "none",
              padding: "12px 24px",
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "14px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
            }}
          >
            Department Students Directory
          </Button>

          <Button
            variant="outline"
            icon={Sparkles}
            onClick={() => navigate("/faculty/readiness")}
            style={{
              borderColor: "rgba(255, 255, 255, 0.5)",
              color: "#FFFFFF",
              padding: "12px 24px",
              borderRadius: "12px",
              fontWeight: 600,
              fontSize: "14px",
              background: "rgba(255, 255, 255, 0.08)",
            }}
          >
            Career Readiness & Gaps
          </Button>
        </div>
      </div>

      {/* Faculty Restrictions Notice */}
      <div
        style={{
          background: "var(--cream)",
          border: "1px solid var(--border)",
          borderLeft: "5px solid var(--wine)",
          borderRadius: "14px",
          padding: "16px 20px",
          fontSize: "13px",
          color: "var(--charcoal)",
          display: "flex",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <ShieldCheck size={22} color="var(--wine)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Faculty Advisory Scope:</strong> As academic faculty for <strong>{department}</strong>, you have read-only visibility into your department's students and placement outcomes. Institutional opportunity management, student account editing, and official approval decisions are exclusively administered by the T&P Cell.
        </span>
      </div>

      {/* Metrics Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "18px",
        }}
      >
        <StatCard
          title="Department Students"
          value={stats.total_students}
          icon={Users}
          subtitle={`Enrolled in ${department}`}
          variant="default"
        />
        <StatCard
          title="Unique Placed Students"
          value={stats.unique_placed}
          icon={CheckCircle2}
          badgeText={stats.placement_rate}
          badgeType="positive"
          subtitle="Campus + verified off-campus"
          variant="cream"
        />
        <StatCard
          title="Average Student CGPA"
          value={stats.average_cgpa !== "N/A" ? `${stats.average_cgpa} / 10.00` : "N/A"}
          icon={Award}
          subtitle="Department academic index"
          variant="default"
        />
        <StatCard
          title="Placement Pathways"
          value={`${stats.campus_placed} C / ${stats.off_campus_placed} O`}
          icon={TrendingUp}
          subtitle="Campus offers / Off-campus"
          variant="accent"
        />
      </div>

      {/* Two Columns: Recent Department Students & Placement Pathway Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "24px" }}>
        {/* Department Students Preview */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            padding: "28px",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
              {department} Students Overview
            </h3>
            <button
              onClick={() => navigate("/faculty/students")}
              style={{ fontSize: "13px", fontWeight: 700, color: "var(--wine)", display: "flex", alignItems: "center", gap: "4px" }}
            >
              View Full Directory <ArrowRight size={14} />
            </button>
          </div>

          {deptStudents.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: "14px" }}>No students currently enrolled in this department.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {deptStudents.map((st) => (
                <div
                  key={st.student_id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    background: "var(--warm-white)",
                    borderRadius: "10px",
                    border: "1px solid var(--border-light)",
                  }}
                >
                  <div>
                    <strong style={{ color: "var(--charcoal)", fontSize: "14px", display: "block" }}>
                      {st.name}
                    </strong>
                    <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                      CGPA: <strong style={{ color: "var(--wine)" }}>{st.cgpa} / 10.00</strong> • {st.skills?.slice(0, 2).join(", ") || "No skills logged"}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: "11.5px",
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: "12px",
                      background: st.placement_status.startsWith("Placed")
                        ? "var(--green-bg)"
                        : "var(--cream)",
                      color: st.placement_status.startsWith("Placed")
                        ? "var(--green)"
                        : "var(--muted)",
                    }}
                  >
                    {st.placement_status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Verification & Placement Pathway Breakdown */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            padding: "28px",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
            Department Placement Pathway Summary
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", background: "var(--green-bg)", borderRadius: "10px" }}>
              <span style={{ color: "var(--green)", fontWeight: 600 }}>Campus Drive Placements</span>
              <strong style={{ color: "var(--green)", fontSize: "16px" }}>{stats.campus_placed} Students</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", background: "var(--warm-white)", borderRadius: "10px", border: "1px solid var(--border-light)" }}>
              <span style={{ color: "var(--charcoal)", fontWeight: 600 }}>Verified Off-Campus Offers</span>
              <strong style={{ color: "var(--wine)", fontSize: "16px" }}>{stats.off_campus_placed} Students</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", background: "var(--yellow-bg)", borderRadius: "10px" }}>
              <span style={{ color: "var(--yellow)", fontWeight: 600 }}>Off-Campus Pending T&P Review</span>
              <strong style={{ color: "var(--yellow)", fontSize: "16px" }}>{stats.pending_off_campus} Submissions</strong>
            </div>
          </div>

          <div style={{ paddingTop: "12px", borderTop: "1px solid var(--border-light)" }}>
            <Button
              variant="outline"
              icon={BarChart3}
              onClick={() => navigate("/faculty/reports")}
              style={{ width: "100%", justifyContent: "center" }}
            >
              View Department Placement Reports
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default FacultyDashboard;
