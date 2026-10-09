import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { StatCard } from "../../components/common/StatCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { LoadingState, ErrorState } from "../../components/common/FeedbackStates";
import {
  BarChart3,
  Briefcase,
  FileText,
  CheckCircle,
  Clock,
  Award,
  TrendingUp,
  Building2,
  PieChart,
} from "lucide-react";

export function FacultyReports() {
  const { faculty, user } = useAuth();
  const facultyId = faculty?.faculty_id || user?.profile?.faculty_id;

  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!facultyId) return;

    async function loadReports() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.getFacultyReports(facultyId);
        setReportsData(res);
      } catch (err) {
        console.error("Faculty reports fetch error:", err);
        setError("Unable to generate placement reports.");
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, [facultyId]);

  if (loading) {
    return <LoadingState message="Generating department placement analytics & reports..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  const summary = reportsData?.summary || {
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

  const stats = reportsData?.internshipStats || [];

  const conversionRate = summary.applications > 0
    ? ((summary.accepted / summary.applications) * 100).toFixed(1)
    : 0;

  const shortlistRate = summary.applications > 0
    ? ((summary.shortlisted / summary.applications) * 100).toFixed(1)
    : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }} className="animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: "26px", fontWeight: 800, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
          Placement & Analytics Reports
        </h1>
        <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px" }}>
          Comprehensive statistics on posted opportunities, application conversion rates, and student performance ratings.
        </p>
      </div>

      {/* Summary Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        <StatCard
          title="Internship Postings"
          value={summary.internships}
          icon={Briefcase}
          subtitle="Total verified"
          variant="default"
        />
        <StatCard
          title="Applications Count"
          value={summary.applications}
          icon={FileText}
          subtitle="Across all postings"
          variant="cream"
        />
        <StatCard
          title="Offer Acceptance Rate"
          value={`${conversionRate}%`}
          icon={TrendingUp}
          badgeText={`${summary.accepted} offers`}
          badgeType="positive"
          subtitle="Shortlist to Offer ratio"
          variant="accent"
        />
        <StatCard
          title="Average Student Score"
          value={summary.averageEvaluation ? `${summary.averageEvaluation} / 5.0` : "N/A"}
          icon={Award}
          subtitle="Faculty evaluations avg"
          variant="cream"
        />
      </div>

      {/* Application Funnel Breakdown Visual */}
      <div
        style={{
          background: "var(--warm-white)",
          borderRadius: "20px",
          padding: "28px",
          border: "1px solid var(--border)",
          borderLeft: "5px solid var(--wine)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--wine)", marginBottom: "20px", fontFamily: "var(--font-display)" }}>
          Application Status Distribution
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px" }}>
          <div style={{ padding: "18px", borderRadius: "14px", background: "var(--cream)", border: "1px solid rgba(122,31,61,0.12)", textAlign: "center" }}>
            <span style={{ fontSize: "12px", color: "var(--muted)", display: "block" }}>Pending</span>
            <strong style={{ fontSize: "24px", color: "var(--charcoal)", display: "block", marginTop: "4px" }}>{summary.pending}</strong>
          </div>

          <div style={{ padding: "18px", borderRadius: "14px", background: "var(--cream)", border: "1px solid rgba(122,31,61,0.2)", textAlign: "center" }}>
            <span style={{ fontSize: "12px", color: "var(--wine)", display: "block", fontWeight: 700 }}>Shortlisted</span>
            <strong style={{ fontSize: "24px", color: "var(--wine)", display: "block", marginTop: "4px" }}>{summary.shortlisted}</strong>
          </div>

          <div style={{ padding: "18px", borderRadius: "14px", background: "var(--green-bg)", border: "1px solid rgba(64,112,80,0.2)", textAlign: "center" }}>
            <span style={{ fontSize: "12px", color: "var(--green)", display: "block", fontWeight: 700 }}>Accepted</span>
            <strong style={{ fontSize: "24px", color: "var(--green)", display: "block", marginTop: "4px" }}>{summary.accepted}</strong>
          </div>

          <div style={{ padding: "18px", borderRadius: "14px", background: "var(--red-bg)", border: "1px solid rgba(220,38,38,0.2)", textAlign: "center" }}>
            <span style={{ fontSize: "12px", color: "var(--red)", display: "block", fontWeight: 700 }}>Rejected</span>
            <strong style={{ fontSize: "24px", color: "var(--red)", display: "block", marginTop: "4px" }}>{summary.rejected}</strong>
          </div>

          <div style={{ padding: "18px", borderRadius: "14px", background: "var(--cream)", border: "1px solid rgba(122,31,61,0.12)", textAlign: "center" }}>
            <span style={{ fontSize: "12px", color: "var(--muted)", display: "block" }}>Interviews</span>
            <strong style={{ fontSize: "24px", color: "var(--charcoal)", display: "block", marginTop: "4px" }}>{summary.interviews}</strong>
          </div>
        </div>
      </div>

      {/* Internship-wise Breakdown Table */}
      <div
        style={{
          background: "var(--warm-white)",
          borderRadius: "20px",
          padding: "28px",
          border: "1px solid var(--border)",
          borderLeft: "5px solid var(--terracotta)",
          boxShadow: "var(--shadow-sm)",
          overflow: "hidden",
        }}
      >
        <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--wine)", marginBottom: "20px", fontFamily: "var(--font-display)" }}>
          Internship-wise Performance Breakdown
        </h3>

        {stats.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: "14px", textAlign: "center", padding: "20px 0" }}>
            No internship metrics available yet.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)", background: "var(--cream)" }}>
                  <th style={{ padding: "14px 16px", fontWeight: 800, color: "var(--wine)" }}>Internship Title</th>
                  <th style={{ padding: "14px 16px", fontWeight: 800, color: "var(--wine)" }}>Company</th>
                  <th style={{ padding: "14px 16px", fontWeight: 800, color: "var(--wine)" }}>Status</th>
                  <th style={{ padding: "14px 16px", fontWeight: 800, color: "var(--wine)" }}>Applications</th>
                  <th style={{ padding: "14px 16px", fontWeight: 800, color: "var(--wine)" }}>Shortlisted</th>
                  <th style={{ padding: "14px 16px", fontWeight: 800, color: "var(--wine)" }}>Accepted Offers</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((row) => (
                  <tr key={row.internship_id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "14px 16px", fontWeight: 600, color: "var(--charcoal)" }}>{row.title}</td>
                    <td style={{ padding: "14px 16px", color: "var(--muted)" }}>{row.company_name}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <StatusBadge status={row.status} />
                    </td>
                    <td style={{ padding: "14px 16px", fontWeight: 600 }}>{row.application_count || 0}</td>
                    <td style={{ padding: "14px 16px", color: "var(--wine)", fontWeight: 600 }}>{row.shortlisted_count || 0}</td>
                    <td style={{ padding: "14px 16px", color: "var(--green)", fontWeight: 700 }}>{row.accepted_count || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
