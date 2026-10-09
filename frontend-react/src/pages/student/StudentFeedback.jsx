import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { Button } from "../../components/common/Button";
import { CheckCircle2, AlertCircle, MessageSquare } from "lucide-react";

export function StudentFeedback() {
  const { student } = useAuth();

  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim() || !student?.student_id) return;

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await api.submitFeedback({
        student_id: student.student_id,
        feedback_text: feedbackText.trim(),
        rating: Number(rating),
      });

      if (res.success || res.message) {
        setSuccessMsg("Thank you! Your feedback has been submitted successfully.");
        setFeedbackText("");
      } else {
        throw new Error(res.message || "Failed to submit feedback.");
      }
    } catch (err) {
      console.error("Feedback error:", err);
      setErrorMsg(err.message || "Unable to submit feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "680px" }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
          Feedback & Recommendations
        </h1>
        <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px" }}>
          Share your internship experience and help improve the College2Career platform.
        </p>
      </div>

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "20px",
          padding: "32px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {successMsg && (
          <div style={{ padding: "14px 16px", borderRadius: "10px", background: "var(--green-bg)", color: "var(--green)", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <CheckCircle2 size={18} />
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div style={{ padding: "14px 16px", borderRadius: "10px", background: "var(--red-bg)", color: "var(--red)", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <AlertCircle size={18} />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--charcoal)", display: "block", marginBottom: "8px" }}>
              Experience Rating (1 to 5 Stars)
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
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
              <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
              <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
              <option value={3}>⭐⭐⭐ (3 - Average)</option>
              <option value={2}>⭐⭐ (2 - Below Expectation)</option>
              <option value={1}>⭐ (1 - Needs Improvement)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--charcoal)", display: "block", marginBottom: "8px" }}>
              Your Detailed Feedback / Review
            </label>
            <textarea
              rows={5}
              required
              placeholder="Describe your learning experience, company environment, or platform suggestions..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
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

          <Button type="submit" variant="primary" loading={loading} icon={MessageSquare}>
            Submit Feedback
          </Button>
        </form>
      </div>
    </div>
  );
}
