import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { LoadingState, ErrorState, EmptyState } from "../../components/common/FeedbackStates";
import {
  Award,
  Star,
  PlusCircle,
  Building2,
  UserCheck,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export function FacultyEvaluations() {
  const { faculty, user } = useAuth();

  const facultyId = faculty?.faculty_id || user?.profile?.faculty_id;

  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New Evaluation Modal State
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [eligibleApps, setEligibleApps] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  const [selectedAppId, setSelectedAppId] = useState("");
  const [technicalScore, setTechnicalScore] = useState(5);
  const [communicationScore, setCommunicationScore] = useState(5);
  const [teamworkScore, setTeamworkScore] = useState(5);
  const [punctualityScore, setPunctualityScore] = useState(5);
  const [comments, setComments] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");

  const fetchEvaluations = async () => {
    if (!facultyId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await api.getFacultyEvaluations(facultyId);
      const list = res?.evaluations || [];
      setEvaluations(list);
    } catch (err) {
      console.error("Faculty fetch evaluations error:", err);
      setError("Unable to load student evaluations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluations();
  }, [facultyId]);

  const handleOpenModal = async () => {
    setEvalModalOpen(true);
    setModalError("");
    try {
      setLoadingApps(true);
      const res = await api.getFacultyApplications(facultyId);
      const list = res?.applications || [];
      const shortlistedOrAccepted = list.filter(
        (a) => a.status === "shortlisted" || a.status === "accepted"
      );
      setEligibleApps(shortlistedOrAccepted);
      if (shortlistedOrAccepted.length > 0) {
        setSelectedAppId(shortlistedOrAccepted[0].application_id);
      }
    } catch (err) {
      console.error("Error loading applications for evaluation:", err);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleCreateEvaluation = async (e) => {
    e.preventDefault();
    if (!facultyId || !selectedAppId) {
      setModalError("Please select a candidate to evaluate.");
      return;
    }

    setSubmitting(true);
    setModalError("");

    try {
      const payload = {
        application_id: Number(selectedAppId),
        faculty_id: Number(facultyId),
        technical_score: Number(technicalScore),
        communication_score: Number(communicationScore),
        teamwork_score: Number(teamworkScore),
        punctuality_score: Number(punctualityScore),
        comments: comments.trim(),
      };

      const res = await api.submitEvaluation(payload);

      if (res.success || res.message) {
        setEvalModalOpen(false);
        fetchEvaluations();
      } else {
        throw new Error(res.message || "Failed to submit evaluation.");
      }
    } catch (err) {
      console.error("Create evaluation error:", err);
      setModalError(err.message || "Unable to save evaluation.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading faculty academic evaluations..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchEvaluations} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="animate-fade-in">
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
            Student Performance Evaluations
          </h1>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px" }}>
            Record official faculty reviews across technical, teamwork, communication, and punctuality dimensions.
          </p>
        </div>

        <Button variant="primary" icon={PlusCircle} onClick={handleOpenModal}>
          Evaluate Candidate
        </Button>
      </div>

      {/* Evaluations List */}
      {evaluations.length === 0 ? (
        <EmptyState
          title="No Performance Evaluations Recorded"
          message="Record formal academic scores (1 to 5 stars) for shortlisted or placed internship candidates."
          actionText="Evaluate Candidate Now"
          onAction={handleOpenModal}
        />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
          {evaluations.map((item) => {
            const tech = Number(item.technical_score || 0);
            const comm = Number(item.communication_score || 0);
            const team = Number(item.teamwork_score || 0);
            const punct = Number(item.punctuality_score || 0);
            const avg = ((tech + comm + team + punct) / 4).toFixed(1);

            return (
              <div
                key={item.evaluation_id}
                style={{
                  background: "var(--warm-white)",
                  borderRadius: "20px",
                  padding: "24px",
                  border: "1px solid var(--border)",
                  borderLeft: "5px solid var(--wine)",
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
                className="card-hover"
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
                      {item.student_name}
                    </h3>
                    <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                      {item.department || "Dept"} • {item.internship_title} ({item.company_name})
                    </span>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--wine)" }}>
                      {avg} <span style={{ fontSize: "13px", color: "var(--muted)", fontWeight: 500 }}>/ 5.0</span>
                    </div>
                    <span style={{ fontSize: "11px", color: "var(--green)", fontWeight: 700 }}>Overall Rating</span>
                  </div>
                </div>

                {/* Score breakdown */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", background: "var(--warm-white)", padding: "16px", borderRadius: "14px" }}>
                  <div>
                    <span style={{ fontSize: "12px", color: "var(--muted)", display: "block" }}>Technical</span>
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

                {item.comments && (
                  <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "12px", fontSize: "13px", color: "var(--charcoal)" }}>
                    <strong style={{ color: "var(--wine)" }}>Faculty Remarks:</strong> "{item.comments}"
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Evaluate Candidate Modal */}
      {evalModalOpen && (
        <Modal
          isOpen={evalModalOpen}
          onClose={() => setEvalModalOpen(false)}
          title="New Student Performance Evaluation"
        >
          {loadingApps ? (
            <LoadingState message="Loading candidates..." />
          ) : eligibleApps.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <p style={{ color: "var(--muted)" }}>No shortlisted candidates found to evaluate.</p>
            </div>
          ) : (
            <form onSubmit={handleCreateEvaluation} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {modalError && (
                <div style={{ padding: "12px", borderRadius: "8px", background: "var(--red-bg)", color: "var(--red)", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <AlertCircle size={16} />
                  {modalError}
                </div>
              )}

              <div>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--charcoal)", display: "block", marginBottom: "8px" }}>
                  Select Candidate Student *
                </label>
                <select
                  value={selectedAppId}
                  onChange={(e) => setSelectedAppId(e.target.value)}
                  required
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
                  {eligibleApps.map((a) => (
                    <option key={a.application_id} value={a.application_id}>
                      {a.student_name} ({a.student_department || "Dept"}) — {a.internship_title}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4 Score Sliders / Dropdowns (1 to 5) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--charcoal)", display: "block", marginBottom: "4px" }}>
                    Technical Score (1-5)
                  </label>
                  <select
                    value={technicalScore}
                    onChange={(e) => setTechnicalScore(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border)" }}
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} Stars</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--charcoal)", display: "block", marginBottom: "4px" }}>
                    Communication Score (1-5)
                  </label>
                  <select
                    value={communicationScore}
                    onChange={(e) => setCommunicationScore(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border)" }}
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} Stars</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--charcoal)", display: "block", marginBottom: "4px" }}>
                    Teamwork Score (1-5)
                  </label>
                  <select
                    value={teamworkScore}
                    onChange={(e) => setTeamworkScore(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border)" }}
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} Stars</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--charcoal)", display: "block", marginBottom: "4px" }}>
                    Punctuality Score (1-5)
                  </label>
                  <select
                    value={punctualityScore}
                    onChange={(e) => setPunctualityScore(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border)" }}
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} Stars</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--charcoal)", display: "block", marginBottom: "6px" }}>
                  Mentor Remarks & Academic Comments
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter remarks regarding student progress and academic suitability..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    fontSize: "13px",
                    fontFamily: "inherit",
                    outline: "none",
                  }}
                  className="input-field"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
                <Button variant="outline" type="button" onClick={() => setEvalModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" loading={submitting}>
                  Submit Evaluation
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}
