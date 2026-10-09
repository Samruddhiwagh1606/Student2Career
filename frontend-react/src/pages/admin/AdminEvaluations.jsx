import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { StatCard } from "../../components/common/StatCard";
import { LoadingState, ErrorState } from "../../components/common/FeedbackStates";
import { Award, Lock, Star } from "lucide-react";

export function AdminEvaluations() {
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
        console.error("Admin evaluations metric fetch error:", err);
        setError("Unable to load evaluation metrics.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <LoadingState message="Loading academic evaluation statistics..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  const summary = reports?.summary || {
    evaluations: 0,
    accepted: 0,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
          Campus Evaluation Metrics
        </h1>
        <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px" }}>
          System-wide academic evaluation records submitted by faculty advisors.
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
          <strong>Backend Architecture Notice:</strong> Detailed evaluation scorecards (Technical, Communication, Teamwork, Punctuality) are conducted directly by faculty mentors (`/api/evaluations/faculty/:facultyId`). Total recorded evaluations count is displayed below.
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
        <StatCard title="Total Recorded Evaluations" value={summary.evaluations} icon={Award} subtitle="Faculty performance reviews" />
        <StatCard title="Total Placed Candidates" value={summary.accepted} icon={Star} badgeType="positive" subtitle="Successful candidates" />
      </div>
    </div>
  );
}
