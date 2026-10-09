import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { StatCard } from "../../components/common/StatCard";
import { LoadingState, ErrorState, EmptyState } from "../../components/common/FeedbackStates";
import { MessageSquare, Star, Building2, User, CheckCircle2 } from "lucide-react";

export function AdminFeedback() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [feedbackSummary, setFeedbackSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.getCompanies();
        const list = res?.companies || [];
        setCompanies(list);
        if (list.length > 0) {
          setSelectedCompanyId(list[0].company_id);
          fetchCompanyFeedback(list[0].company_id);
        }
      } catch (err) {
        console.error("Admin feedback fetch error:", err);
        setError("Unable to load feedback analytics.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const fetchCompanyFeedback = async (cid) => {
    if (!cid) return;
    try {
      const res = await api.getCompanyFeedbackSummary(cid).catch(() => null);
      setFeedbackSummary(res?.summary || null);
    } catch (err) {
      console.error("Company feedback fetch error:", err);
    }
  };

  const handleCompanyChange = (cid) => {
    setSelectedCompanyId(cid);
    fetchCompanyFeedback(cid);
  };

  if (loading) {
    return <LoadingState message="Fetching campus feedback & satisfaction reviews..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
          Campus Feedback & Quality Analytics
        </h1>
        <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px" }}>
          Review student internship experience ratings, company culture scores, and platform feedback.
        </p>
      </div>

      {/* Select Company for Feedback Review */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "20px",
          padding: "24px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <Building2 size={20} style={{ color: "var(--wine)" }} />
        <label style={{ fontSize: "14px", fontWeight: 700, color: "var(--charcoal)" }}>
          Select Partner Company to Inspect Student Feedback:
        </label>
        <select
          value={selectedCompanyId}
          onChange={(e) => handleCompanyChange(e.target.value)}
          style={{
            padding: "10px 16px",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            fontSize: "14px",
            background: "var(--warm-white)",
            outline: "none",
            minWidth: "220px",
            cursor: "pointer",
          }}
        >
          {companies.map((c) => (
            <option key={c.company_id} value={c.company_id}>
              {c.name} ({c.location || "HQ"})
            </option>
          ))}
        </select>
      </div>

      {/* Company Feedback Breakdown */}
      {!feedbackSummary || Number(feedbackSummary.total_feedback || 0) === 0 ? (
        <EmptyState
          title="No Feedback Submitted Yet"
          message="No student internship feedback has been submitted for this company yet."
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
            }}
          >
            <StatCard
              title="Overall Satisfaction"
              value={`${feedbackSummary.overall_average || 0} / 5.0`}
              icon={Star}
              badgeText={`${feedbackSummary.total_feedback} reviews`}
              badgeType="positive"
              subtitle="Student rating average"
            />
            <StatCard
              title="Company Culture"
              value={`${feedbackSummary.culture_average || 0} / 5.0`}
              icon={Building2}
              subtitle="Workplace environment"
            />
            <StatCard
              title="Mentorship Quality"
              value={`${feedbackSummary.mentorship_average || 0} / 5.0`}
              icon={User}
              subtitle="Advisor guidance"
            />
            <StatCard
              title="Technical Learning"
              value={`${feedbackSummary.technical_learning_average || 0} / 5.0`}
              icon={MessageSquare}
              subtitle="Skill acquisition rating"
            />
          </div>
        </div>
      )}
    </div>
  );
}
