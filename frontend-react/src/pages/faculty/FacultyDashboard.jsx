import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { StatCard } from "../../components/common/StatCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Button } from "../../components/common/Button";
import { LoadingState, ErrorState } from "../../components/common/FeedbackStates";
import {
  Briefcase,
  FileText,
  Calendar,
  Award,
  PlusCircle,
  Clock,
  CheckCircle,
  Building2,
  ArrowRight,
  TrendingUp,
  BarChart3,
  UserCheck,
} from "lucide-react";

export function FacultyDashboard() {
  const { faculty, user } = useAuth();
  const navigate = useNavigate();

  const [reports, setReports] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const facultyId = faculty?.faculty_id || user?.profile?.faculty_id;

  useEffect(() => {
    if (!facultyId) {
      setLoading(false);
      return;
    }

    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch faculty report summary
        const repRes = await api.getFacultyReports(facultyId).catch(() => null);
        if (repRes?.summary) {
          setReports(repRes);
        }

        // Fetch recent applications for faculty internships
        const appRes = await api.getFacultyApplications(facultyId).catch(() => ({ applications: [] }));
        const apps = appRes?.applications || [];
        setRecentApplications(apps.slice(0, 5));

        // Fetch upcoming interviews
        const intvRes = await api.getFacultyInterviews(facultyId).catch(() => ({ interviews: [] }));
        const intvs = intvRes?.interviews || [];
        setUpcomingInterviews(intvs.slice(0, 4));
      } catch (err) {
        console.error("Faculty dashboard fetch error:", err);
        setError("Unable to load faculty placement dashboard metrics.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [facultyId]);

  if (loading) {
    return <LoadingState message="Loading Faculty Placement Portal..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  const summary = reports?.summary || {
    internships: 0,
    applications: 0,
    pending: 0,
    shortlisted: 0,
    accepted: 0,
    rejected: 0,
    interviews: 0,
    evaluations: 0,
    averageEvaluation: 0,
  };

  const facultyName = faculty?.name || user?.profile?.name || "Faculty Advisor";
  const department = faculty?.department || user?.profile?.department || "Academic Dept";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }} className="animate-fade-in">
      {/* Welcome Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--wine) 0%, #5B1730 65%, #3e1020 100%)",
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
        <div
          style={{
            position: "absolute",
            top: "-60px",
            right: "-60px",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(231, 111, 81, 0.22) 0%, rgba(122, 31, 61, 0) 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "1.5px",
                color: "#D6A84F",
                background: "rgba(214, 168, 79, 0.15)",
                border: "1px solid rgba(214, 168, 79, 0.3)",
                padding: "4px 12px",
                borderRadius: "20px",
                textTransform: "uppercase",
              }}
            >
              FACULTY PLACEMENT MANAGEMENT
            </span>
            <span style={{ fontSize: "13px", color: "#FFF7ED", opacity: 0.9, fontWeight: 500 }}>
              {department} Department
            </span>
          </div>

          <h2 style={{ fontSize: "32px", fontWeight: 800, margin: 0, color: "#FFF7ED", fontFamily: "var(--font-display)", lineHeight: 1.15 }}>
            Welcome back, Prof. {facultyName}! 🎓
          </h2>

          <p style={{ fontSize: "14px", color: "#f5e50e", marginTop: "10px", opacity: 0.95, maxWidth: "580px", lineHeight: 1.6 }}>
            Review student applications, schedule interviews, evaluate academic suitability, and post new placement opportunities.
          </p>
        </div>

        <div style={{ display: "flex", gap: "14px", position: "relative", zIndex: 2, flexWrap: "wrap", alignItems: "center" }}>
          <Button
            variant="secondary"
            icon={PlusCircle}
            onClick={() => navigate("/faculty/post-internship")}
            style={{
              background: "#FFFFFF",
              color: "var(--wine)",
              fontWeight: 800,
              fontSize: "14px",
              padding: "12px 24px",
              borderRadius: "12px",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.18)",
              border: "none",
              cursor: "pointer",
            }}
          >
            Post New Internship
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/faculty/applications")}
            style={{
              background: "rgba(255, 255, 255, 0.12)",
              borderColor: "rgba(255, 255, 255, 0.4)",
              color: "#FFF7ED",
              fontWeight: 700,
              fontSize: "14px",
              padding: "12px 24px",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            Review Applications ({summary.pending})
          </Button>
        </div>
      </div>

      {/* Primary Metrics Grid — ALL LIGHT / WARM SURFACES (NO BLACK CARDS) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        <StatCard
          title="Posted Internships"
          value={summary.internships}
          icon={Briefcase}
          subtitle="Opportunities verified"
          variant="default"
        />
        <StatCard
          title="Applications Received"
          value={summary.applications}
          icon={FileText}
          badgeText={`${summary.pending} pending`}
          badgeType={summary.pending > 0 ? "warning" : "positive"}
          subtitle="Total student submissions"
          variant="accent"
        />
        <StatCard
          title="Interviews Scheduled"
          value={summary.interviews}
          icon={Calendar}
          subtitle="Recruiter interactions"
          variant="cream"
        />
        <StatCard
          title="Student Placements"
          value={summary.accepted}
          icon={UserCheck}
          badgeText={`${summary.accepted} accepted`}
          badgeType="positive"
          subtitle="Successful offers"
          variant="cream"
        />
      </div>

      {/* Academic Mentorship & Quick Actions Summary */}
      <div
        style={{
          background: "var(--cream)",
          borderRadius: "20px",
          padding: "24px 32px",
          border: "1px solid rgba(122, 31, 61, 0.15)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div>
          <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
            Academic Evaluation & Placement Supervision
          </h3>
          <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px", margin: 0 }}>
            {summary.pending} student applications awaiting faculty review • {summary.evaluations || 0} academic performance evaluations logged
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
         <Button
  size="sm"
  variant="primary"
  onClick={() => navigate("/faculty/evaluations")}
>
  Student Evaluations
</Button>

          <Button size="sm" variant="primary" onClick={() => navigate("/faculty/reports")}>
            View Department Reports
          </Button>
        </div>
      </div>

      {/* Two Column Layout: Applications Review & Upcoming Interviews (NO BLACK BLOCK) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "24px",
        }}
      >
        {/* Recent Applications Card */}
        <div
          style={{
            background: "var(--warm-white)",
            borderRadius: "20px",
            border: "1px solid var(--border)",
            borderLeft: "5px solid var(--wine)",
            padding: "28px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
                Recent Student Applications
              </h3>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                Applications requiring faculty review
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/faculty/applications")}
              icon={ArrowRight}
            >
              View All
            </Button>
          </div>

          {recentApplications.length === 0 ? (
            <div style={{ textAlign: "center", padding: "36px 16px", color: "var(--muted)" }}>
              <FileText size={40} style={{ color: "var(--border)", marginBottom: "12px" }} />
              <p style={{ fontWeight: 600, color: "var(--charcoal)", fontSize: "15px" }}>No applications received yet</p>
              <p style={{ fontSize: "13px", marginTop: "4px" }}>
                Posted internships will collect candidate submissions here.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {recentApplications.map((app) => (
                <div
                  key={app.application_id}
                  style={{
                    padding: "16px",
                    borderRadius: "14px",
                    border: "1px solid var(--border-light)",
                    background: "var(--cream)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                >
                  <div>
                    <strong style={{ fontSize: "14px", color: "var(--charcoal)", display: "block" }}>
                      {app.student_name} ({app.student_department || "Student"})
                    </strong>
                    <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                      {app.internship_title} • GPA: {app.student_gpa ? `${app.student_gpa}/4.0` : "N/A"}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <StatusBadge status={app.status} />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate("/faculty/applications")}
                      style={{ background: "#FFFFFF" }}
                    >
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scheduled Interviews Widget — WARM EDITORIAL PANEL (NO BLACK BLOCK) */}
        <div
          style={{
            background: "var(--warm-white)",
            borderRadius: "20px",
            border: "1px solid var(--border)",
            borderLeft: "5px solid var(--terracotta)",
            padding: "28px",
            boxShadow: "var(--shadow-sm)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
                Scheduled Interviews
              </h3>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                Upcoming technical & HR rounds
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/faculty/interviews")}
            >
              All Interviews
            </Button>
          </div>

          {upcomingInterviews.length === 0 ? (
            <div style={{ textAlign: "center", padding: "36px 16px", color: "var(--muted)", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <Calendar size={40} style={{ color: "var(--border)", marginBottom: "12px" }} />
              <p style={{ fontWeight: 600, color: "var(--charcoal)", fontSize: "15px" }}>No interviews scheduled</p>
              <p style={{ fontSize: "13px", marginTop: "4px", marginBottom: "16px" }}>
                Schedule interviews for shortlisted applicants.
              </p>
              <Button size="sm" variant="primary" onClick={() => navigate("/faculty/schedule-interview")}>
                Schedule Interview
              </Button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {upcomingInterviews.map((intv) => (
                <div
                  key={intv.interview_id}
                  style={{
                    padding: "16px",
                    borderRadius: "14px",
                    border: "1px solid var(--border-light)",
                    background: "var(--cream)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "10px",
                        background: "rgba(231, 111, 81, 0.12)",
                        color: "var(--terracotta)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Clock size={18} />
                    </div>
                    <div>
                      <strong style={{ fontSize: "14px", color: "var(--charcoal)", display: "block" }}>
                        {intv.student_name} • {intv.internship_title}
                      </strong>
                      <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                        {intv.interview_date} at {intv.interview_time} ({intv.interviewer_name || "Faculty"})
                      </span>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: "12px",
                      background: "rgba(122, 31, 61, 0.08)",
                      color: "var(--wine)",
                    }}
                  >
                    Scheduled
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
