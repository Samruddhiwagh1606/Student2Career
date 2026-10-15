import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { StatCard } from "../../components/common/StatCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Button } from "../../components/common/Button";
import { LoadingState, ErrorState } from "../../components/common/FeedbackStates";
import {
  BarChart3,
  Users,
  GraduationCap,
  Building2,
  Briefcase,
  FileText,
  TrendingUp,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ShieldCheck,
} from "lucide-react";

export function AdminReports() {
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getAdminReports();
      setReportsData(res);
    } catch (err) {
      console.error("Admin reports fetch error:", err);
      setError("Unable to generate admin system reports.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      await api.exportAdminReports();
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 5000);
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export report: " + err.message);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Generating campus-wide placement & system analytics..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadReports} />;
  }

  const summary = reportsData?.summary || {
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
    unique_placed_students: 0,
    campus_unique_placed: 0,
    off_campus_unique_placed: 0,
    placement_rate: 0,
    off_campus_total: 0,
    off_campus_approved: 0,
    off_campus_pending: 0,
    off_campus_needs_info: 0,
    off_campus_rejected: 0,
    verified_outcomes: 0,
    unverified_pending_or_rejected: 0,
  };

  const deptStats = reportsData?.departmentStats || [];
  const companyStats = reportsData?.companyStats || [];
  const internshipStatus = reportsData?.internshipStatus || [];
  const applicationStatus = reportsData?.applicationStatus || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }} className="animate-fade-in">
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
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
              MODULE 3: RECONCILED INSTITUTIONAL REPORTING
            </span>
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
            Campus Placement & System Reports
          </h1>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px" }}>
            Audit-reconciled metrics distinguishing unique placed students, verified campus offers, and approved off-campus outcomes.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Download}
          onClick={handleExport}
          loading={exporting}
          style={{ background: "var(--wine)", boxShadow: "var(--shadow-sm)" }}
        >
          Export to Excel (CSV)
        </Button>
      </div>

      {/* Export Success Alert */}
      {exportSuccess && (
        <div
          style={{
            padding: "14px 18px",
            borderRadius: "10px",
            background: "var(--green-bg)",
            color: "var(--green)",
            fontSize: "13.5px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <CheckCircle2 size={18} />
          Report exported successfully! The file matches all on-screen verified counting definitions and opens in Excel.
        </div>
      )}

      {/* Verification Rule Notice */}
      <div
        style={{
          background: "var(--cream)",
          border: "1px solid var(--border)",
          borderLeft: "5px solid var(--wine)",
          borderRadius: "14px",
          padding: "16px 20px",
          fontSize: "13.5px",
          color: "var(--charcoal)",
          display: "flex",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <ShieldCheck size={22} color="var(--wine)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Audit-Reconciled Counting Rules:</strong> Unique placed students deduplicates multiple accepted campus offers and approved off-campus outcomes. Total application submissions are reported separately and never equated with placed students. Pending ({summary.off_campus_pending}) and rejected ({summary.off_campus_rejected}) submissions are strictly excluded from verified totals.
        </span>
      </div>

      {/* Primary Key Metrics Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "18px",
        }}
      >
        <StatCard
          title="Registered Students"
          value={summary.students}
          icon={Users}
          subtitle="Enrolled student accounts"
          variant="default"
        />
        <StatCard
          title="Unique Placed Students"
          value={summary.unique_placed_students}
          icon={GraduationCap}
          badgeText={`${summary.placement_rate}% placed`}
          badgeType="positive"
          subtitle="Verified distinct candidates"
          variant="cream"
        />
        <StatCard
          title="Campus Accepted Offers"
          value={summary.accepted}
          icon={Briefcase}
          subtitle="On-campus placement drives"
          variant="default"
        />
        <StatCard
          title="Approved Off-Campus"
          value={summary.off_campus_approved}
          icon={CheckCircle2}
          subtitle="T&P verified independent offers"
          variant="default"
        />
        <StatCard
          title="Total Applications"
          value={summary.applications}
          icon={FileText}
          subtitle="Raw application attempts"
          variant="accent"
        />
      </div>

      {/* Verification Distinction Panel */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "20px",
          padding: "24px 28px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", marginBottom: "16px", fontFamily: "var(--font-display)" }}>
          Verification Status Summary
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          <div style={{ background: "var(--green-bg)", padding: "18px", borderRadius: "12px", border: "1px solid rgba(64, 112, 80, 0.2)" }}>
            <span style={{ fontSize: "12px", color: "var(--green)", fontWeight: 700, textTransform: "uppercase" }}>
              Institutionally Verified
            </span>
            <strong style={{ fontSize: "28px", color: "var(--green)", display: "block", marginTop: "4px" }}>
              {summary.unique_placed_students} Students
            </strong>
            <span style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginTop: "4px" }}>
              {summary.accepted} campus + {summary.off_campus_approved} off-campus verified
            </span>
          </div>

          <div style={{ background: "var(--yellow-bg)", padding: "18px", borderRadius: "12px", border: "1px solid rgba(217, 119, 6, 0.2)" }}>
            <span style={{ fontSize: "12px", color: "var(--yellow)", fontWeight: 700, textTransform: "uppercase" }}>
              Pending T&P Review
            </span>
            <strong style={{ fontSize: "28px", color: "var(--yellow)", display: "block", marginTop: "4px" }}>
              {summary.off_campus_pending} Requests
            </strong>
            <span style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginTop: "4px" }}>
              Self-reported (unverified, excluded from stats)
            </span>
          </div>

          <div style={{ background: "var(--cream)", padding: "18px", borderRadius: "12px", border: "1px solid rgba(231, 111, 81, 0.2)" }}>
            <span style={{ fontSize: "12px", color: "var(--terracotta)", fontWeight: 700, textTransform: "uppercase" }}>
              Needs More Info
            </span>
            <strong style={{ fontSize: "28px", color: "var(--terracotta)", display: "block", marginTop: "4px" }}>
              {summary.off_campus_needs_info} Requests
            </strong>
            <span style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginTop: "4px" }}>
              Returned to student for documentation
            </span>
          </div>

          <div style={{ background: "var(--red-bg)", padding: "18px", borderRadius: "12px", border: "1px solid rgba(220, 38, 38, 0.2)" }}>
            <span style={{ fontSize: "12px", color: "var(--red)", fontWeight: 700, textTransform: "uppercase" }}>
              Rejected Submissions
            </span>
            <strong style={{ fontSize: "28px", color: "var(--red)", display: "block", marginTop: "4px" }}>
              {summary.off_campus_rejected} Requests
            </strong>
            <span style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginTop: "4px" }}>
              Denied with recorded audit reason
            </span>
          </div>
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "20px",
          padding: "28px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
              Department-wise Placement Performance
            </h3>
            <span style={{ fontSize: "13px", color: "var(--muted)" }}>
              Reconciled across campus drives and approved off-campus outcomes
            </span>
          </div>
        </div>

        {deptStats.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: "14px" }}>No department statistics recorded.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "var(--warm-white)", borderBottom: "2px solid var(--border)" }}>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)" }}>Department</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)" }}>Total Students</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)" }}>Unique Placed</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)" }}>Campus Offers</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)" }}>Off-Campus Approved</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)" }}>Total Applications</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)" }}>Placement Rate</th>
                </tr>
              </thead>
              <tbody>
                {deptStats.map((d, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)" }}>
                      {d.department}
                    </td>
                    <td style={{ padding: "14px 18px" }}>{d.total_students}</td>
                    <td style={{ padding: "14px 18px", fontWeight: 700, color: "var(--green)" }}>
                      {d.unique_placed_students}
                    </td>
                    <td style={{ padding: "14px 18px" }}>{d.campus_placed_students}</td>
                    <td style={{ padding: "14px 18px" }}>{d.off_campus_placed_students}</td>
                    <td style={{ padding: "14px 18px", color: "var(--muted)" }}>{d.total_applications}</td>
                    <td style={{ padding: "14px 18px" }}>
                      <span
                        style={{
                          background: d.placement_percentage >= 60 ? "var(--green-bg)" : "var(--cream)",
                          color: d.placement_percentage >= 60 ? "var(--green)" : "var(--terracotta)",
                          padding: "4px 10px",
                          borderRadius: "14px",
                          fontWeight: 700,
                          fontSize: "12.5px",
                        }}
                      >
                        {d.placement_percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Two Column Layout: Company Breakdown & Funnel */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
        {/* Company Postings */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            padding: "28px",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", marginBottom: "20px", fontFamily: "var(--font-display)" }}>
            Top Recruiting Partners
          </h3>

          {companyStats.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: "14px" }}>No partner companies logged.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {companyStats.slice(0, 6).map((c, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-light)", paddingBottom: "10px" }}>
                  <div>
                    <strong style={{ color: "var(--charcoal)", fontSize: "14px" }}>{c.company_name}</strong>
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--wine)", background: "var(--cream)", padding: "4px 10px", borderRadius: "10px" }}>
                    {c.total_internships} Postings
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Application Stage Funnel */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            padding: "28px",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", marginBottom: "20px", fontFamily: "var(--font-display)" }}>
            Campus Application Funnel
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "var(--warm-white)", borderRadius: "8px" }}>
              <span>Total Applications Submitted</span>
              <strong>{summary.applications}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "var(--warm-white)", borderRadius: "8px" }}>
              <span>Under Coordinator Review</span>
              <strong>{summary.pending}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "var(--cream)", borderRadius: "8px" }}>
              <span style={{ color: "var(--terracotta)", fontWeight: 600 }}>Shortlisted for Interview</span>
              <strong style={{ color: "var(--terracotta)" }}>{summary.shortlisted}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "var(--green-bg)", borderRadius: "8px" }}>
              <span style={{ color: "var(--green)", fontWeight: 600 }}>Accepted Offers</span>
              <strong style={{ color: "var(--green)" }}>{summary.accepted}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "var(--red-bg)", borderRadius: "8px" }}>
              <span style={{ color: "var(--red)", fontWeight: 600 }}>Rejected / Not Selected</span>
              <strong style={{ color: "var(--red)" }}>{summary.rejected}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminReports;
