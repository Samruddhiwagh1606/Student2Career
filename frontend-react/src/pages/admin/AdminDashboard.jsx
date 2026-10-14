import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { StatCard } from "../../components/common/StatCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Button } from "../../components/common/Button";
import { LoadingState, ErrorState } from "../../components/common/FeedbackStates";
import {
  Users,
  GraduationCap,
  Building2,
  Briefcase,
  FileText,
  CheckCircle,
  Calendar,
  Award,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
} from "lucide-react";

export function AdminDashboard() {
  const { admin } = useAuth();
  const navigate = useNavigate();

  const [reports, setReports] = useState(null);
  const [reviewInternships, setReviewInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch overall admin report metrics
        const repRes = await api.getAdminReports().catch(() => null);
        if (repRes?.summary) {
          setReports(repRes);
        }

        // Fetch internships awaiting admin approval
        const reviewRes = await api.getInternshipsAdminReview().catch(() => []);
        setReviewInternships(Array.isArray(reviewRes) ? reviewRes : []);
      } catch (err) {
        console.error("Admin dashboard fetch error:", err);
        setError("Unable to load admin dashboard metrics.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingState message="Loading System Administration Console..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  const summary = reports?.summary || {
    students: 0,
    faculty: 0,
    companies: 0,
    internships: 0,
    applications: 0,
    accepted: 0,
    shortlisted: 0,
    rejected: 0,
    pending: 0,
    withdrawn: 0,
    interviews: 0,
    evaluations: 0,
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
        <div
          style={{
            position: "absolute",
            top: "-60px",
            right: "-60px",
            width: "280px",
            height: "280px",
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
              SYSTEM ADMINISTRATION & GOVERNANCE
            </span>
          </div>

          <h2 style={{ fontSize: "32px", fontWeight: 700, color: "#FFF7ED", margin: 0, fontFamily: "var(--font-display)" }}>
            College2Career Master Console 🛡️
          </h2>

          <p style={{ fontSize: "14.5px", color: "rgba(255, 247, 237, 0.92)", marginTop: "10px", maxWidth: "580px", lineHeight: 1.5 }}>
            Manage campus accounts, approve faculty-verified internship postings, review placement conversion rates, and maintain institution settings.
          </p>
        </div>

        <div style={{ display: "flex", gap: "14px", position: "relative", zIndex: 2, flexWrap: "wrap" }}>
          <Button
            variant="secondary"
            onClick={() => navigate("/admin/internships")}
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
            Review Pending Postings ({reviewInternships.length})
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/admin/reports")}
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
            System Reports
          </Button>
        </div>
      </div>

      {/* 1. ACADEMIC & CORPORATE DIRECTORY SECTION */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
              User & Institutional Registry
            </h3>
            <p style={{ fontSize: "13px", color: "var(--muted)", margin: "2px 0 0 0" }}>
              Registered stakeholders and verified campus constituents
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <Button size="sm" variant="outline" onClick={() => navigate("/admin/students")}>
              Students
            </Button>
            <Button size="sm" variant="outline" onClick={() => navigate("/admin/faculty")}>
              Faculty
            </Button>
            <Button size="sm" variant="outline" onClick={() => navigate("/admin/companies")}>
              Companies
            </Button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "20px 24px",
              border: "1px solid var(--border)",
              borderLeft: "4px solid var(--wine)",
              boxShadow: "var(--shadow-xs)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>
                Enrolled Students
              </span>
              <span style={{ fontSize: "28px", fontWeight: 800, color: "var(--charcoal)", marginTop: "2px", display: "block" }}>
                {summary.students}
              </span>
              <button
                onClick={() => navigate("/admin/students")}
                style={{ background: "none", border: "none", color: "var(--wine)", fontSize: "12px", fontWeight: 700, cursor: "pointer", padding: 0, marginTop: "6px", display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                Manage Roster <ArrowRight size={12} />
              </button>
            </div>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users size={22} style={{ color: "var(--wine)" }} />
            </div>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "20px 24px",
              border: "1px solid var(--border)",
              borderLeft: "4px solid var(--terracotta)",
              boxShadow: "var(--shadow-xs)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>
                Faculty Mentors
              </span>
              <span style={{ fontSize: "28px", fontWeight: 800, color: "var(--charcoal)", marginTop: "2px", display: "block" }}>
                {summary.faculty}
              </span>
              <button
                onClick={() => navigate("/admin/faculty")}
                style={{ background: "none", border: "none", color: "var(--terracotta)", fontSize: "12px", fontWeight: 700, cursor: "pointer", padding: 0, marginTop: "6px", display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                View Directory <ArrowRight size={12} />
              </button>
            </div>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "var(--terracotta-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <GraduationCap size={22} style={{ color: "var(--terracotta)" }} />
            </div>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "20px 24px",
              border: "1px solid var(--border)",
              borderLeft: "4px solid #D97706",
              boxShadow: "var(--shadow-xs)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>
                Partner Companies
              </span>
              <span style={{ fontSize: "28px", fontWeight: 800, color: "var(--charcoal)", marginTop: "2px", display: "block" }}>
                {summary.companies}
              </span>
              <button
                onClick={() => navigate("/admin/companies")}
                style={{ background: "none", border: "none", color: "#D97706", fontSize: "12px", fontWeight: 700, cursor: "pointer", padding: 0, marginTop: "6px", display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                Recruiter Portals <ArrowRight size={12} />
              </button>
            </div>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Building2 size={22} style={{ color: "#D97706" }} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. OPPORTUNITIES & PLACEMENT PIPELINE SECTION */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
              Internship Opportunities & Placement Funnel
            </h3>
            <p style={{ fontSize: "13px", color: "var(--muted)", margin: "2px 0 0 0" }}>
              Live institutional pipeline metrics backed by verified application records
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <Button size="sm" variant="outline" onClick={() => navigate("/admin/internships")}>
              All Internships
            </Button>
            <Button size="sm" variant="primary" onClick={() => navigate("/admin/applications")}>
              All Applications
            </Button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          <StatCard
            title="Approved Internships"
            value={summary.internships}
            icon={Briefcase}
            subtitle="Campus verified"
            variant="cream"
          />
          <StatCard
            title="Awaiting Approval"
            value={reviewInternships.length}
            icon={ShieldAlert}
            subtitle="Pending admin review"
            badgeText={reviewInternships.length > 0 ? "Action Required" : "Up to date"}
            badgeType={reviewInternships.length > 0 ? "warning" : "positive"}
            variant="accent"
          />
          <StatCard
            title="Total Applications"
            value={summary.applications}
            icon={FileText}
            subtitle={`${summary.pending} under review`}
            variant="default"
          />
          <StatCard
            title="Shortlisted"
            value={summary.shortlisted}
            icon={Award}
            subtitle="In recruiter interview"
            variant="cream"
          />
          <StatCard
            title="Accepted Offers"
            value={summary.accepted}
            icon={CheckCircle}
            subtitle={`${summary.applications > 0 ? Math.round((summary.accepted / summary.applications) * 100) : 0}% conversion`}
            variant="accent"
          />
        </div>
      </div>

      {/* Two Column Layout: Pending Approvals & Application Funnel */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "24px",
        }}
      >
        {/* Pending Approval List */}
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
                Faculty-Verified Postings Awaiting Approval
              </h3>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                Institutional approval required before student visibility
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/admin/internships")}
              icon={ArrowRight}
            >
              Manage
            </Button>
          </div>

          {reviewInternships.length === 0 ? (
            <div style={{ textAlign: "center", padding: "36px 16px", color: "var(--muted)" }}>
              <CheckCircle size={40} style={{ color: "var(--green)", marginBottom: "12px" }} />
              <p style={{ fontWeight: 600, color: "var(--charcoal)", fontSize: "15px" }}>All Postings Reviewed</p>
              <p style={{ fontSize: "13px", marginTop: "4px" }}>
                No faculty-verified internship postings are currently awaiting institutional approval.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {reviewInternships.map((item) => (
                <div
                  key={item.internship_id}
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
                      {item.title}
                    </strong>
                    <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                      {item.company_name} • Verified by Prof. {item.faculty_name || "Faculty"}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <StatusBadge status={item.status} />
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => navigate("/admin/internships")}
                    >
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Application Stage Funnel Breakdown — WARM WHITE PANEL */}
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
            justifyContent: "space-between",
          }}
        >
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", marginBottom: "6px", fontFamily: "var(--font-display)" }}>
              Application Stage Funnel
            </h3>
            <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "24px" }}>
              Real-time conversion metric through placement pipeline
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px" }}>
                  <span style={{ color: "var(--charcoal)", fontWeight: 600 }}>Pending Review</span>
                  <strong style={{ color: "var(--wine)" }}>{summary.pending}</strong>
                </div>
                <div style={{ height: "10px", borderRadius: "5px", background: "rgba(122, 31, 61, 0.08)", overflow: "hidden" }}>
                  <div style={{ width: `${summary.applications > 0 ? (summary.pending / summary.applications) * 100 : 0}%`, height: "100%", background: "var(--terracotta)" }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px" }}>
                  <span style={{ color: "var(--charcoal)", fontWeight: 600 }}>Shortlisted Candidates</span>
                  <strong style={{ color: "var(--wine)" }}>{summary.shortlisted}</strong>
                </div>
                <div style={{ height: "10px", borderRadius: "5px", background: "rgba(122, 31, 61, 0.08)", overflow: "hidden" }}>
                  <div style={{ width: `${summary.applications > 0 ? (summary.shortlisted / summary.applications) * 100 : 0}%`, height: "100%", background: "var(--wine-light)" }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px" }}>
                  <span style={{ color: "var(--charcoal)", fontWeight: 600 }}>Offers Accepted</span>
                  <strong style={{ color: "var(--green)" }}>{summary.accepted}</strong>
                </div>
                <div style={{ height: "10px", borderRadius: "5px", background: "rgba(122, 31, 61, 0.08)", overflow: "hidden" }}>
                  <div style={{ width: `${summary.applications > 0 ? (summary.accepted / summary.applications) * 100 : 0}%`, height: "100%", background: "var(--green)" }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: "var(--muted)", fontWeight: 600 }}>Overall Conversion Rate</span>
            <span style={{ fontSize: "18px", fontWeight: 800, color: "var(--wine)" }}>
              {summary.applications > 0 ? `${Math.round((summary.accepted / summary.applications) * 100)}%` : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
