import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { LoadingState } from "../../components/common/FeedbackStates";
import {
  Calendar,
  Clock,
  User,
  Building2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export function ScheduleInterview() {
  const { faculty, user } = useAuth();
  const navigate = useNavigate();

  const facultyId = faculty?.faculty_id || user?.profile?.faculty_id;

  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);

  // Form State
  const [applicationId, setApplicationId] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("10:00");
  const [interviewerName, setInterviewerName] = useState(
    faculty?.name || user?.profile?.name || ""
  );

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!facultyId) return;

    async function loadShortlistedApplications() {
      try {
        setLoadingApps(true);
        const res = await api.getFacultyApplications(facultyId);
        const list = res?.applications || [];
        // Filter shortlisted or accepted applications
        const eligible = list.filter(
          (a) => a.status === "shortlisted" || a.status === "accepted"
        );
        setApplications(eligible);
        if (eligible.length > 0) {
          setApplicationId(eligible[0].application_id);
        }
      } catch (err) {
        console.error("Failed to load applications for interview:", err);
      } finally {
        setLoadingApps(false);
      }
    }

    loadShortlistedApplications();
  }, [facultyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!facultyId || !applicationId) {
      setErrorMsg("Please select an eligible application.");
      return;
    }

    setSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const payload = {
        application_id: Number(applicationId),
        faculty_id: Number(facultyId),
        interview_date: interviewDate,
        interview_time: interviewTime,
        interviewer_name: interviewerName.trim(),
      };

      const res = await api.scheduleInterview(payload);

      if (res.success || res.message) {
        setSuccessMsg("Interview scheduled successfully!");
        setTimeout(() => {
          navigate("/faculty/interviews");
        }, 1800);
      } else {
        throw new Error(res.message || "Failed to schedule interview.");
      }
    } catch (err) {
      console.error("Schedule interview error:", err);
      setErrorMsg(err.message || "Unable to schedule interview.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingApps) {
    return <LoadingState message="Fetching shortlisted student candidates..." />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", maxWidth: "720px" }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: "26px", fontWeight: 800, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
          Schedule Candidate Interview
        </h1>
        <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px" }}>
          Schedule a technical or HR interview slot for shortlisted applicants (must be at least 24 hours in advance).
        </p>
      </div>

      {successMsg && (
        <div style={{ padding: "14px 18px", borderRadius: "12px", background: "var(--green-bg)", color: "var(--green)", fontSize: "14px", fontWeight: 600, display: "flex", alignItems: "center", gap: "10px" }}>
          <CheckCircle2 size={20} />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div style={{ padding: "14px 18px", borderRadius: "12px", background: "var(--red-bg)", color: "var(--red)", fontSize: "14px", fontWeight: 600, display: "flex", alignItems: "center", gap: "10px" }}>
          <AlertCircle size={20} />
          {errorMsg}
        </div>
      )}

      <div
        style={{
          background: "var(--warm-white)",
          borderRadius: "20px",
          padding: "36px",
          border: "1px solid var(--border)",
          borderLeft: "5px solid var(--terracotta)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {applications.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px", color: "var(--muted)" }}>
            <AlertCircle size={36} style={{ color: "var(--terracotta)", marginBottom: "12px" }} />
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", marginBottom: "6px" }}>
              No Shortlisted Candidates Available
            </h3>
            <p style={{ fontSize: "14px", marginBottom: "20px" }}>
              To schedule an interview, you must first shortlist a student from the Applications tab.
            </p>
            <Button variant="primary" onClick={() => navigate("/faculty/applications")}>
              Go to Student Applications
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Candidate Application Select */}
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--charcoal)", display: "block", marginBottom: "8px" }}>
                Select Shortlisted Student Candidate *
              </label>
              <select
                value={applicationId}
                onChange={(e) => setApplicationId(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  fontSize: "14px",
                  background: "var(--warm-white)",
                  outline: "none",
                }}
              >
                {applications.map((a) => (
                  <option key={a.application_id} value={a.application_id}>
                    {a.student_name} ({a.student_department || "Dept"}) — {a.internship_title} at {a.company_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Grid: Date & Time */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <Input
                label="Interview Date *"
                type="date"
                icon={Calendar}
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                required
              />

              <Input
                label="Interview Time *"
                type="time"
                icon={Clock}
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
                required
              />
            </div>

            {/* Interviewer Name */}
            <Input
              label="Interviewer Name / Panel *"
              placeholder="e.g. Dr. A. Sharma / Technical Hiring Team"
              icon={User}
              value={interviewerName}
              onChange={(e) => setInterviewerName(e.target.value)}
              required
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
              <Button variant="outline" type="button" onClick={() => navigate("/faculty/interviews")}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={submitting} icon={Calendar}>
                Confirm Interview Schedule
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
