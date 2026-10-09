import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { Button } from "../../components/common/Button";
import { StatusBadge } from "../../components/common/StatusBadge";
import { LoadingState, ErrorState, EmptyState } from "../../components/common/FeedbackStates";
import { Modal } from "../../components/common/Modal";
import {
  Calendar,
  Clock,
  User,
  Building2,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  AlertCircle,
} from "lucide-react";

export function FacultyInterviews() {
  const { faculty, user } = useAuth();
  const navigate = useNavigate();

  const facultyId = faculty?.faculty_id || user?.profile?.faculty_id;

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit / Result modal
  const [selectedIntv, setSelectedIntv] = useState(null);
  const [editResult, setEditResult] = useState("");
  const [editFeedback, setEditFeedback] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchInterviews = async () => {
    if (!facultyId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await api.getFacultyInterviews(facultyId);
      const list = res?.interviews || [];
      setInterviews(list);
    } catch (err) {
      console.error("Faculty fetch interviews error:", err);
      setError("Unable to load faculty interview schedule.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, [facultyId]);

  const handleOpenEditModal = (intv) => {
    setSelectedIntv(intv);
    setEditResult(intv.result || "passed");
    setEditFeedback(intv.feedback || "");
  };

  const handleUpdateInterview = async (e) => {
    e.preventDefault();
    if (!selectedIntv || !facultyId) return;

    try {
      setUpdating(true);
      const payload = {
        faculty_id: Number(facultyId),
        result: editResult,
        feedback: editFeedback.trim(),
      };

      const res = await api.updateInterview(selectedIntv.interview_id, payload);

      if (res.success || res.message) {
        setSelectedIntv(null);
        fetchInterviews();
      } else {
        alert(res.message || "Failed to update interview result.");
      }
    } catch (err) {
      alert(err.message || "Unable to update interview.");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelInterview = async (interviewId) => {
    if (!window.confirm("Are you sure you want to cancel this interview schedule?")) return;

    try {
      await api.cancelInterview(interviewId, facultyId);
      fetchInterviews();
    } catch (err) {
      alert(err.message || "Failed to cancel interview.");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
  };

  if (loading) {
    return <LoadingState message="Loading scheduled interviews..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchInterviews} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="animate-fade-in">
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
            Scheduled Interviews
          </h1>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px" }}>
            Manage candidate interviews, record evaluation feedback, and update results.
          </p>
        </div>

        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={() => navigate("/faculty/schedule-interview")}
        >
          Schedule New Interview
        </Button>
      </div>

      {/* Interviews List */}
      {interviews.length === 0 ? (
        <EmptyState
          title="No Scheduled Interviews"
          message="No interviews are currently scheduled for candidates under your posted internships."
          actionText="Schedule First Interview"
          onAction={() => navigate("/faculty/schedule-interview")}
        />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
          {interviews.map((item) => (
            <div
              key={item.interview_id}
              style={{
                background: "var(--warm-white)",
                borderRadius: "20px",
                padding: "24px",
                border: "1px solid var(--border)",
                borderLeft: "5px solid var(--terracotta)",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "20px",
              }}
              className="card-hover"
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div>
                    <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
                      {item.student_name}
                    </h3>
                    <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                      {item.department || "Dept"} • GPA {item.gpa ? `${item.gpa}/4.0` : "N/A"}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: "12px",
                      background: item.result === "passed" ? "var(--green-bg)" : item.result === "failed" ? "var(--red-bg)" : "var(--cream)",
                      color: item.result === "passed" ? "var(--green)" : item.result === "failed" ? "var(--red)" : "var(--wine)",
                    }}
                  >
                    {item.result ? item.result.toUpperCase() : "SCHEDULED"}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "var(--charcoal)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Building2 size={15} style={{ color: "var(--muted)" }} />
                    <strong>Internship:</strong> {item.internship_title} ({item.company_name})
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Clock size={15} style={{ color: "var(--wine)" }} />
                    <strong>Date & Time:</strong> {formatDate(item.interview_date)} at {item.interview_time}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <User size={15} style={{ color: "var(--terracotta)" }} />
                    <strong>Interviewer:</strong> {item.interviewer_name || "Faculty Panel"}
                  </div>
                </div>

                {item.feedback && (
                  <div style={{ marginTop: "14px", background: "var(--warm-white)", padding: "12px", borderRadius: "10px", fontSize: "12px", color: "var(--charcoal)", fontStyle: "italic" }}>
                    "{item.feedback}"
                  </div>
                )}
              </div>

              <div
                style={{
                  paddingTop: "16px",
                  borderTop: "1px solid var(--border-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Button size="sm" variant="outline" icon={Edit} onClick={() => handleOpenEditModal(item)}>
                  Record Outcome
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  icon={Trash2}
                  style={{ color: "var(--red)", borderColor: "var(--red-bg)" }}
                  onClick={() => handleCancelInterview(item.interview_id)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Outcome Modal */}
      {selectedIntv && (
        <Modal
          isOpen={!!selectedIntv}
          onClose={() => setSelectedIntv(null)}
          title={`Interview Outcome: ${selectedIntv.student_name}`}
        >
          <form onSubmit={handleUpdateInterview} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--charcoal)", display: "block", marginBottom: "8px" }}>
                Interview Result / Recommendation
              </label>
              <select
                value={editResult}
                onChange={(e) => setEditResult(e.target.value)}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  fontSize: "14px",
                  background: "var(--warm-white)",
                  outline: "none",
                }}
              >
                <option value="passed">Passed / Cleared Round</option>
                <option value="failed">Failed / Did Not Clear</option>
                <option value="on_hold">On Hold / Under Consideration</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--charcoal)", display: "block", marginBottom: "8px" }}>
                Interviewer Remarks & Feedback
              </label>
              <textarea
                rows={4}
                placeholder="Enter feedback regarding technical skills, problem solving, or communication..."
                value={editFeedback}
                onChange={(e) => setEditFeedback(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  outline: "none",
                }}
                className="input-field"
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
              <Button variant="outline" type="button" onClick={() => setSelectedIntv(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={updating}>
                Save Outcome
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
