import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { StatCard } from "../../components/common/StatCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { LoadingState, ErrorState } from "../../components/common/FeedbackStates";
import {
  BarChart3,
  Users,
  GraduationCap,
  Building2,
  Briefcase,
  FileText,
  TrendingUp,
  PieChart,
} from "lucide-react";

export function AdminReports() {
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadReports() {
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
    }

    loadReports();
  }, []);

  if (loading) {
    return <LoadingState message="Generating campus-wide placement & system analytics..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
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
  };

  const deptStats = reportsData?.departmentStats || [];
  const companyStats = reportsData?.companyStats || [];
  const internshipStatus = reportsData?.internshipStatus || [];
  const applicationStatus = reportsData?.applicationStatus || [];

  const conversionRate = summary.applications > 0
    ? ((summary.accepted / summary.applications) * 100).toFixed(1)
    : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }} className="animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
          Campus System Reports & Analytics
        </h1>
        <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px" }}>
          Master institution metrics across departments, recruiting partners, internship postings, and application stages.
        </p>
      </div>

      {/* Summary Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        <StatCard title="Registered Students" value={summary.students} icon={Users} subtitle="Student accounts" />
        <StatCard title="Faculty Advisors" value={summary.faculty} icon={GraduationCap} subtitle="Active mentors" />
        <StatCard title="Partner Companies" value={summary.companies} icon={Building2} subtitle="Recruiting partners" />
        <StatCard title="Total Internships" value={summary.internships} icon={Briefcase} subtitle="Verified & approved" />
        <StatCard title="Overall Placement Rate" value={`${conversionRate}%`} icon={TrendingUp} badgeText={`${summary.accepted} placed`} badgeType="positive" subtitle="Applications to offer" />
      </div>

      {/* Two Column Layout: Department Distribution & Company Postings */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
        {/* Department Distribution */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            padding: "28px",
            border: "1px solid var(--border)",
            borderLeft: "5px solid var(--wine)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", marginBottom: "20px", fontFamily: "var(--font-display)" }}>
            Department-wise Student Breakdown
          </h3>

          {deptStats.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: "14px" }}>No department statistics available.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {deptStats.map((d, idx) => (
                <div key={idx}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                    <span style={{ fontWeight: 600, color: "var(--charcoal)" }}>{d.department}</span>
                    <strong style={{ color: "var(--wine)" }}>{d.total_students} Students</strong>
                  </div>
                  <div style={{ height: "8px", borderRadius: "4px", background: "var(--warm-white)", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${summary.students > 0 ? (d.total_students / summary.students) * 100 : 0}%`,
                        height: "100%",
                        background: "var(--wine)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Company Internship Breakdown */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            padding: "28px",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", marginBottom: "20px" }}>
            Corporate Partner Posting Volume
          </h3>

          {companyStats.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: "14px" }}>No company statistics available.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {companyStats.map((c, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "12px",
                    background: "var(--warm-white)",
                    border: "1px solid var(--border-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--charcoal)" }}>{c.company_name}</span>
                  <span style={{ fontSize: "12px", fontWeight: 700, padding: "4px 10px", borderRadius: "12px", background: "var(--cream)", color: "var(--wine)" }}>
                    {c.total_internships} Postings
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status Summaries: Internships & Applications */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
        {/* Internship Status */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            padding: "28px",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", marginBottom: "20px" }}>
            Internship Posting Status Distribution
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {internshipStatus.map((s, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1px solid var(--border-light)",
                }}
              >
                <StatusBadge status={s.status} />
                <strong style={{ fontSize: "16px", color: "var(--charcoal)" }}>{s.total}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Application Status */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            padding: "28px",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", marginBottom: "20px" }}>
            Application Stage Volume
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {applicationStatus.map((a, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1px solid var(--border-light)",
                }}
              >
                <StatusBadge status={a.status} />
                <strong style={{ fontSize: "16px", color: "var(--charcoal)" }}>{a.total}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
