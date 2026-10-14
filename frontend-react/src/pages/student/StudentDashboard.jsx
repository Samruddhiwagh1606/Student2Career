import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { StatCard } from "../../components/common/StatCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Button } from "../../components/common/Button";
import { LoadingState, ErrorState } from "../../components/common/FeedbackStates";
import { RecommendedInternshipCard } from "../../components/student/RecommendedInternshipCard";
import {
  FileText,
  CheckCircle,
  Calendar,
  Award,
  ArrowRight,
  Briefcase,
  UserCheck,
  Search,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

export function StudentDashboard() {
  const { student } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [recommendedInternships, setRecommendedInternships] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [availableCount, setAvailableCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!student?.student_id) {
      setLoading(false);
      return;
    }

    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch student applications
        const appRes = await api.getStudentApplications(student.student_id).catch(() => ({ applications: [] }));
        const apps = appRes.applications || [];
        apps.sort((a, b) => new Date(b.applied_at) - new Date(a.applied_at));
        setApplications(apps);

        // Fetch real skill match recommendations
        const recRes = await api.getRecommendedInternships(student.student_id).catch(() => ({ recommendations: [] }));
        const recs = recRes.recommendations || [];
        setRecommendedInternships(Array.isArray(recs) ? recs.slice(0, 3) : []);

        // Fetch total available internships
        const intRes = await api.getInternships().catch(() => ({ internships: [] }));
        const intList = intRes?.internships || intRes || [];
        setAvailableCount(Array.isArray(intList) ? intList.length : 0);

        // Fetch student interviews
        const intvRes = await api.getStudentInterviews(student.student_id).catch(() => ({ interviews: [] }));
        const intvs = intvRes.interviews || intvRes || [];
        setInterviews(Array.isArray(intvs) ? intvs : []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Unable to load application metrics.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [student?.student_id]);

  if (loading) {
    return <LoadingState message="Loading your career dashboard..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  // Application metrics derived from real API response
  const totalApps = applications.length;
  const pendingCount = applications.filter((a) => (a.status || "").toLowerCase() === "pending").length;
  const shortlistedCount = applications.filter((a) => (a.status || "").toLowerCase() === "shortlisted").length;
  const acceptedCount = applications.filter((a) => (a.status || "").toLowerCase() === "accepted").length;
  const recentApp = applications.length > 0 ? applications[0] : null;

  // Real profile completion percentage based on student profile fields
  const profileFields = [
    student?.name,
    student?.email,
    student?.roll_number,
    student?.department,
    student?.gpa,
    student?.resume,
    student?.phone,
  ];
  const completedFields = profileFields.filter(Boolean).length;
  const profileCompletionPct = Math.round((completedFields / profileFields.length) * 100);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? dateStr
      : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }} className="animate-fade-in">
      {/* Welcome Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--wine) 0%, #5B1730 60%, #3E1020 100%)",
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
        {/* Subtle decorative glow */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(214, 168, 79, 0.22) 0%, rgba(122, 31, 61, 0) 70%)",
            pointerEvents: "none",
          }}
        />

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
              CAREER DASHBOARD
            </span>
            <span style={{ fontSize: "12px", color: "#FFF7ED", opacity: 0.82 }}>
              {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </span>
          </div>

          <h2 style={{ fontSize: "32px", fontWeight: 700, color: "#FFF7ED", margin: 0, fontFamily: "var(--font-display)" }}>
            Welcome back, {student?.name ? student.name.split(" ")[0] : "Student"}! 👋
          </h2>

          <p style={{ fontSize: "14.5px", color: "#FFF7ED", marginTop: "10px", opacity: 0.92, lineHeight: 1.5 }}>
            Department: <strong>{student?.department || "N/A"}</strong> • GPA: <strong>{student?.gpa ? `${student.gpa}/4.0` : "N/A"}</strong> • Roll: <strong>{student?.roll_number || "N/A"}</strong>
          </p>
        </div>

        <div style={{ display: "flex", gap: "14px", position: "relative", zIndex: 2, flexWrap: "wrap" }}>
          <Button
            variant="secondary"
            icon={Search}
            onClick={() => navigate("/student/internships")}
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
            Explore Internships →
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/student/applications")}
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
            My Applications
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        <StatCard
          title="Profile Completion"
          value={`${profileCompletionPct}%`}
          icon={UserCheck}
          badgeText={`${completedFields}/7 verified`}
          badgeType={profileCompletionPct >= 80 ? "positive" : "warning"}
          subtitle="Student credentials logged"
          variant="cream"
        />
        <StatCard
          title="Total Applications"
          value={totalApps}
          icon={FileText}
          subtitle="Applied opportunities"
          variant="default"
        />
        <StatCard
          title="Under Review"
          value={pendingCount}
          icon={Clock}
          subtitle="Awaiting coordinator review"
          variant="default"
        />
        <StatCard
          title="Shortlisted"
          value={shortlistedCount}
          icon={CheckCircle}
          badgeText={`${shortlistedCount} active`}
          badgeType="positive"
          subtitle="In candidate pool"
          variant="accent"
        />
        <StatCard
          title="Accepted Offers"
          value={acceptedCount}
          icon={Award}
          badgeText={`${acceptedCount} offers`}
          badgeType="positive"
          subtitle="Successful placements"
          variant="cream"
        />
        <StatCard
          title="Campus Openings"
          value={availableCount}
          icon={Briefcase}
          subtitle="Approved active listings"
          variant="default"
        />
      </div>

      {/* RECOMMENDED FOR YOU — REAL SMART SKILL MATCHING PANEL */}
      {recommendedInternships.length > 0 && (
        <div
          style={{
            background: "var(--cream)",
            borderRadius: "24px",
            padding: "32px 36px",
            border: "1px solid rgba(122, 31, 61, 0.12)",
            boxShadow: "var(--shadow-sm)",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Sparkles size={20} style={{ color: "var(--wine)" }} />
                <h3 style={{ fontSize: "22px", fontWeight: 800, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
                  RECOMMENDED FOR YOU
                </h3>
              </div>
              <span style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px", display: "block" }}>
                Sorted by real skill-match percentage based on your student profile & skills
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/student/internships")}
              icon={ArrowRight}
              style={{ background: "#FFFFFF" }}
            >
              Explore All Internships
            </Button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "20px",
            }}
          >
            {recommendedInternships.map((internship) => (
              <RecommendedInternshipCard
                key={internship.internship_id}
                internship={internship}
                onView={() => navigate("/student/internships")}
              />
            ))}
          </div>
        </div>
      )}

      {/* Two Column Layout: Application Tracker + Upcoming Interviews */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "24px",
        }}
      >
        {/* Application Tracker Panel */}
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
              marginBottom: "24px",
            }}
          >
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
                Recent Application Progress
              </h3>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                Track progress of your latest submission
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/student/applications")}
            >
              View All
            </Button>
          </div>

          {!recentApp ? (
            <div style={{ textAlign: "center", padding: "36px 16px", color: "var(--muted)" }}>
              <Briefcase size={40} style={{ color: "var(--border)", marginBottom: "12px" }} />
              <p style={{ fontWeight: 600, color: "var(--charcoal)", fontSize: "15px" }}>No applications submitted yet</p>
              <p style={{ fontSize: "13px", marginTop: "4px", marginBottom: "16px" }}>
                Browse open internships and apply to kickstart your placement!
              </p>
              <Button size="sm" variant="primary" onClick={() => navigate("/student/internships")}>
                Find Internships Now
              </Button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Header info */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                  padding: "16px 20px",
                  background: "var(--cream)",
                  borderRadius: "14px",
                  border: "1px solid rgba(122,31,61,0.12)",
                }}
              >
                <div>
                  <strong style={{ fontSize: "16px", color: "var(--charcoal)", display: "block" }}>
                    {recentApp.title}
                  </strong>
                  <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                    {recentApp.company_name} • Applied on {formatDate(recentApp.applied_at)}
                  </span>
                </div>
                <StatusBadge status={recentApp.status} />
              </div>

              {/* 4-step Timeline */}
              <div style={{ padding: "12px 0" }}>
                <ApplicationTimeline status={recentApp.status} appliedAt={recentApp.applied_at} />
              </div>
            </div>
          )}
        </div>

        {/* Upcoming Interviews & Activity Widget — WARM WHITE PANEL */}
        <div
          style={{
            background: "var(--warm-white)",
            color: "var(--charcoal)",
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
                Upcoming Interviews & Schedule
              </h3>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                Scheduled recruiter interactions
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/student/interviews")}
            >
              All Schedule
            </Button>
          </div>

          {interviews.length === 0 ? (
            <div style={{ textAlign: "center", padding: "36px 16px", color: "var(--muted)", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <Calendar size={40} style={{ color: "var(--wine)", marginBottom: "12px" }} />
              <p style={{ fontWeight: 600, color: "var(--charcoal)", fontSize: "15px" }}>No interviews scheduled</p>
              <p style={{ fontSize: "13px", marginTop: "4px" }}>
                When companies shortlist your profile, scheduled interview slots will appear here.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {interviews.slice(0, 3).map((intv, idx) => (
                <div
                  key={idx}
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
                        width: "40px",
                        height: "40px",
                        borderRadius: "10px",
                        background: "var(--wine)",
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Calendar size={20} />
                    </div>
                    <div>
                      <strong style={{ fontSize: "14px", color: "var(--charcoal)", display: "block" }}>
                        {intv.company_name || "Company Interview"}
                      </strong>
                      <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                        {formatDate(intv.interview_date)} • {intv.location || intv.interview_mode || "Online"}
                      </span>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: "12px",
                      background: "rgba(122, 31, 61, 0.12)",
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

// 4-Step Timeline Component
function ApplicationTimeline({ status = "pending", appliedAt }) {
  const normStatus = (status || "pending").toLowerCase();

  const steps = [
    {
      id: 1,
      title: "Applied",
      sub: appliedAt ? new Date(appliedAt).toLocaleDateString("en-IN", { month: "short", day: "2-digit" }) : "Done",
      isDone: true,
    },
    {
      id: 2,
      title: "Shortlisted",
      sub: ["shortlisted", "accepted"].includes(normStatus) ? "Completed" : "Pending",
      isDone: ["shortlisted", "accepted"].includes(normStatus),
      isCurrent: normStatus === "pending",
    },
    {
      id: 3,
      title: "Interview",
      sub: normStatus === "accepted" ? "Completed" : normStatus === "shortlisted" ? "In Progress" : "Pending",
      isDone: normStatus === "accepted",
      isCurrent: normStatus === "shortlisted",
    },
    {
      id: 4,
      title: "Decision",
      sub: normStatus === "accepted" ? "Accepted" : normStatus === "rejected" ? "Rejected" : "Pending",
      isDone: normStatus === "accepted",
      isCurrent: ["rejected", "withdrawn"].includes(normStatus),
    },
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", position: "relative" }}>
      {steps.map((step, idx) => (
        <React.Fragment key={step.id}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", zIndex: 2 }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "14px",
                background: step.isDone ? "var(--wine)" : step.isCurrent ? "var(--terracotta)" : "var(--border)",
                color: step.isDone || step.isCurrent ? "#FFFFFF" : "var(--muted)",
                boxShadow: step.isDone || step.isCurrent ? "0 4px 12px rgba(122,31,61,0.2)" : "none",
              }}
            >
              {step.isDone ? "✓" : step.id}
            </div>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--charcoal)", display: "block" }}>
                {step.title}
              </span>
              <span style={{ fontSize: "11px", color: "var(--muted)" }}>{step.sub}</span>
            </div>
          </div>

          {idx < steps.length - 1 && (
            <div
              style={{
                flex: 1,
                height: "3px",
                margin: "0 8px",
                marginBottom: "28px",
                background: step.isDone ? "var(--wine)" : "var(--border)",
                transition: "background var(--transition-fast)",
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

