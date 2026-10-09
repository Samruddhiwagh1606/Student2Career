import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { StatCard } from "../../components/common/StatCard";
import { LoadingState, ErrorState } from "../../components/common/FeedbackStates";
import { FileText, CheckCircle, Clock, XCircle, AlertCircle, Lock } from "lucide-react";

export function AdminApplications() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.getAdminReports();
        setReports(res);
      } catch (err) {
        console.error("Admin applications metric fetch error:", err);
        setError("Unable to load application metrics.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <LoadingState message="Fetching campus application metrics..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  const summary = reports?.summary || {
    applications: 0,
    pending: 0,
    shortlisted: 0,
    accepted: 0,
    rejected: 0,
    withdrawn: 0,
  };

  const appStats = reports?.applicationStatus || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
          Campus Application Metrics
        </h1>
        <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px" }}>
          System-wide student application volume and stage progression summary.
        </p>
      </div>

      {/* Backend-limited Note */}
      <div
        style={{
          padding: "16px 20px",
          borderRadius: "14px",
          background: "var(--cream)",
          border: "1px solid var(--border-light)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontSize: "13px",
          color: "var(--charcoal)",
        }}
      >
        <Lock size={18} style={{ color: "var(--wine)", flexShrink: 0 }} />
        <div>
          <strong>Backend Architecture Notice:</strong> Individual application shortlist/accept review workflow is scoped to respective faculty posting owners (`/api/applications/faculty/:facultyId`). Master system totals are displayed below from live database reports.
        </div>
      </div>

      {/* Metrics Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        <StatCard title="Total Applications" value={summary.applications} icon={FileText} subtitle="Campus-wide submissions" />
        <StatCard title="Pending Review" value={summary.pending} icon={Clock} subtitle="Awaiting faculty shortlist" />
        <StatCard title="Shortlisted Candidates" value={summary.shortlisted} icon={FileText} subtitle="In active candidate pool" />
        <StatCard title="Accepted Offers" value={summary.accepted} icon={CheckCircle} badgeText={`${summary.accepted} offers`} badgeType="positive" subtitle="Successful placements" />
      </div>

      {/* Stage Breakdown Table */}
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
          Application Status Breakdown
        </h3>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border)", background: "var(--cream)" }}>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "var(--charcoal)" }}>Status Stage</th>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "var(--charcoal)" }}>Total Count</th>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "var(--charcoal)" }}>Percentage of Total</th>
              </tr>
            </thead>
            <tbody>
              {appStats.map((row, idx) => {
                const pct = summary.applications > 0 ? ((row.total / summary.applications) * 100).toFixed(1) : 0;
                return (
                  <tr key={idx} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "14px 16px", fontWeight: 600, color: "var(--charcoal)", textTransform: "capitalize" }}>
                      {row.status}
                    </td>
                    <td style={{ padding: "14px 16px", fontWeight: 700 }}>{row.total}</td>
                    <td style={{ padding: "14px 16px", color: "var(--muted)" }}>{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
