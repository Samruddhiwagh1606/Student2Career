import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { StatCard } from "../../components/common/StatCard";
import { LoadingState, ErrorState } from "../../components/common/FeedbackStates";
import { Calendar, Clock, Lock, CheckCircle2 } from "lucide-react";

export function AdminInterviews() {
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
        console.error("Admin interviews metric fetch error:", err);
        setError("Unable to load interview metrics.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <LoadingState message="Loading campus interview statistics..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  const summary = reports?.summary || {
    interviews: 0,
    shortlisted: 0,
    accepted: 0,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
          Campus Interview Metrics
        </h1>
        <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px" }}>
          System-wide interview interaction volume and candidate assessment summary.
        </p>
      </div>

      {/* Architecture Notice */}
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
          <strong>Backend Architecture Notice:</strong> Scheduling and recording interview outcomes is managed directly by faculty posting owners (`/api/interviews/faculty/:facultyId`). Total system interaction volume is shown below.
        </div>
      </div>

      {/* Metrics Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        <StatCard title="Total Interviews Scheduled" value={summary.interviews} icon={Calendar} subtitle="Campus technical rounds" />
        <StatCard title="Shortlisted Candidates" value={summary.shortlisted} icon={Clock} subtitle="Interview pool" />
        <StatCard title="Offers Placed" value={summary.accepted} icon={CheckCircle2} badgeType="positive" subtitle="Final accepted placements" />
      </div>
    </div>
  );
}
