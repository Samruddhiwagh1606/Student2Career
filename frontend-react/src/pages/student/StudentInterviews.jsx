import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { LoadingState, ErrorState, EmptyState } from "../../components/common/FeedbackStates";
import { Calendar, Building2, MapPin, Clock, Video } from "lucide-react";

export function StudentInterviews() {
  const { student } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!student?.student_id) return;
    async function loadInterviews() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.getStudentInterviews(student.student_id);
        const list = res?.interviews || res || [];
        setInterviews(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Fetch interviews error:", err);
        setError("Unable to load scheduled interviews.");
      } finally {
        setLoading(false);
      }
    }
    loadInterviews();
  }, [student?.student_id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
  };

  if (loading) {
    return <LoadingState message="Loading your interview schedule..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
          Interviews & Schedule
        </h1>
        <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px" }}>
          View scheduled interviews with recruiters and technical interviewers.
        </p>
      </div>

      {interviews.length === 0 ? (
        <EmptyState
          title="No Interviews Scheduled"
          message="When recruiters shortlist your application, interview invitations will appear here."
        />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {interviews.map((item, idx) => (
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
                justifyContent: "space-between",
                gap: "16px",
              }}
              className="card-hover"
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "12px",
                      background: "var(--wine-subtle)",
                      color: "var(--wine)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Calendar size={20} />
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: 700, padding: "4px 10px", borderRadius: "12px", background: "var(--cream)", color: "var(--wine)" }}>
                    Scheduled
                  </span>
                </div>

                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", marginBottom: "4px" }}>
                  {item.title || item.internship_title || "Technical Interview"}
                </h3>

                <p style={{ fontSize: "14px", color: "var(--muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Building2 size={15} />
                  {item.company_name || "Company Recruiter"}
                </p>
              </div>

              <div style={{ paddingTop: "12px", borderTop: "1px solid var(--border-light)", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ fontSize: "13px", color: "var(--charcoal)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Clock size={15} style={{ color: "var(--wine)" }} />
                  <strong>Date & Time:</strong> {formatDate(item.interview_date)} {item.interview_time || ""}
                </div>

                <div style={{ fontSize: "13px", color: "var(--charcoal)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <MapPin size={15} style={{ color: "var(--terracotta)" }} />
                  <strong>Location / Mode:</strong> {item.location || item.interview_mode || "Online Meeting"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
