import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { LoadingState, ErrorState, EmptyState } from "../../components/common/FeedbackStates";
import { Award, Star, Building2, UserCheck, MessageSquare } from "lucide-react";

export function StudentEvaluations() {
  const { student } = useAuth();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!student?.student_id) return;
    async function loadEvaluations() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.getStudentEvaluations(student.student_id);
        const list = res?.evaluations || res || [];
        setEvaluations(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Fetch evaluations error:", err);
        setError("Unable to load evaluations.");
      } finally {
        setLoading(false);
      }
    }
    loadEvaluations();
  }, [student?.student_id]);

  if (loading) {
    return <LoadingState message="Loading faculty evaluations..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
          Evaluations & Ratings
        </h1>
        <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px" }}>
          Review official faculty performance evaluations and academic ratings.
        </p>
      </div>

      {evaluations.length === 0 ? (
        <EmptyState
          title="No Evaluations Recorded Yet"
          message="Once your faculty advisor logs performance reviews for your internship, they will appear here."
        />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
          {evaluations.map((item, idx) => {
            const tech = Number(item.technical_score || 0);
            const comm = Number(item.communication_score || 0);
            const team = Number(item.teamwork_score || 0);
            const punct = Number(item.punctuality_score || 0);
            const avg = ((tech + comm + team + punct) / 4).toFixed(1);

            return (
              <div
                key={idx}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "20px",
                  padding: "24px",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
                className="card-hover"
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", margin: 0 }}>
                      {item.title || "Internship Evaluation"}
                    </h3>
                    <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                      {item.company_name || "Company"} • Reviewed by {item.faculty_name || "Faculty Mentor"}
                    </span>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--wine)" }}>
                      {avg} <span style={{ fontSize: "14px", color: "var(--muted)", fontWeight: 500 }}>/ 5.0</span>
                    </div>
                    <span style={{ fontSize: "11px", color: "var(--green)", fontWeight: 700 }}>Overall Score</span>
                  </div>
                </div>

                {/* Score breakdown */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", background: "var(--warm-white)", padding: "16px", borderRadius: "14px" }}>
                  <div>
                    <span style={{ fontSize: "12px", color: "var(--muted)", display: "block" }}>Technical Skill</span>
                    <strong style={{ fontSize: "14px", color: "var(--charcoal)" }}>{tech} / 5.0</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: "12px", color: "var(--muted)", display: "block" }}>Communication</span>
                    <strong style={{ fontSize: "14px", color: "var(--charcoal)" }}>{comm} / 5.0</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: "12px", color: "var(--muted)", display: "block" }}>Teamwork</span>
                    <strong style={{ fontSize: "14px", color: "var(--charcoal)" }}>{team} / 5.0</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: "12px", color: "var(--muted)", display: "block" }}>Punctuality</span>
                    <strong style={{ fontSize: "14px", color: "var(--charcoal)" }}>{punct} / 5.0</strong>
                  </div>
                </div>

                {item.remarks && (
                  <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "12px", fontSize: "13px", color: "var(--charcoal)" }}>
                    <strong style={{ color: "var(--wine)" }}>Mentor Remarks:</strong> "{item.remarks}"
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
