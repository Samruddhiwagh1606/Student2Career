import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Modal } from "../../components/common/Modal";
import { StatusBadge } from "../../components/common/StatusBadge";
import { LoadingState, ErrorState, EmptyState } from "../../components/common/FeedbackStates";
import {
  Briefcase,
  PlusCircle,
  Building2,
  Calendar,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  History,
  FileCheck,
  ExternalLink,
  Info,
  Clock,
  XCircle,
} from "lucide-react";

export function StudentOffCampus() {
  const { student } = useAuth();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Submit Modal state
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [recordType, setRecordType] = useState("internship");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [details, setDetails] = useState("");
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Resubmit Modal state (for needs_more_info)
  const [resubmitTarget, setResubmitTarget] = useState(null);
  const [resubmitDetails, setResubmitDetails] = useState("");
  const [resubmitFile, setResubmitFile] = useState(null);
  const [resubmitting, setResubmitting] = useState(false);
  const [resubmitError, setResubmitError] = useState("");

  // Audit History Modal state
  const [historyTarget, setHistoryTarget] = useState(null);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Success notification
  const [successBanner, setSuccessBanner] = useState("");

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getMyOffCampus();
      setSubmissions(res.submissions || []);
    } catch (err) {
      console.error("Failed to load off-campus submissions:", err);
      setError("Unable to load your off-campus records.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSubmit = () => {
    setCompanyName("");
    setJobTitle("");
    setRecordType("internship");
    setStartDate("");
    setEndDate("");
    setDetails("");
    setEvidenceFile(null);
    setSubmitError("");
    setIsSubmitOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyName.trim() || !jobTitle.trim()) {
      setSubmitError("Company name and job title are required.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const formData = new FormData();
      formData.append("company_name", companyName.trim());
      formData.append("job_title", jobTitle.trim());
      formData.append("record_type", recordType);
      if (startDate) formData.append("start_date", startDate);
      if (endDate) formData.append("end_date", endDate);
      if (details.trim()) formData.append("details", details.trim());
      if (evidenceFile) formData.append("evidence", evidenceFile);

      const res = await api.submitOffCampus(formData);
      if (res.success) {
        setIsSubmitOpen(false);
        setSuccessBanner("Your off-campus record was submitted successfully! It is now pending T&P review.");
        loadSubmissions();
      } else {
        throw new Error(res.message || "Submission failed.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setSubmitError(err.message || "Failed to submit off-campus record.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenResubmit = (sub) => {
    setResubmitTarget(sub);
    setResubmitDetails(sub.details || "");
    setResubmitFile(null);
    setResubmitError("");
  };

  const handleResubmit = async (e) => {
    e.preventDefault();
    if (!resubmitTarget) return;

    setResubmitting(true);
    setResubmitError("");

    try {
      const formData = new FormData();
      formData.append("details", resubmitDetails.trim());
      if (resubmitFile) formData.append("evidence", resubmitFile);

      const res = await api.resubmitOffCampus(resubmitTarget.submission_id, formData);
      if (res.success) {
        setResubmitTarget(null);
        setSuccessBanner("Additional details submitted! Your request is back in the T&P queue.");
        loadSubmissions();
      } else {
        throw new Error(res.message || "Resubmission failed.");
      }
    } catch (err) {
      console.error("Resubmission error:", err);
      setResubmitError(err.message || "Failed to update record.");
    } finally {
      setResubmitting(false);
    }
  };

  const handleViewHistory = async (sub) => {
    setHistoryTarget(sub);
    setLoadingHistory(true);
    try {
      const res = await api.getOffCampusHistory(sub.submission_id);
      setHistoryLogs(res.history || []);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const formatDateTime = (ts) => {
    if (!ts) return "N/A";
    const d = new Date(ts);
    return isNaN(d.getTime()) ? ts : d.toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }} className="animate-fade-in">
      {/* Header Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--wine) 0%, #5B1730 60%, #3E1020 100%)",
          color: "#FFF7ED",
          borderRadius: "24px",
          padding: "36px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "24px",
          boxShadow: "var(--shadow-md)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "1.5px",
                color: "#D6A84F",
                background: "rgba(214, 168, 79, 0.18)",
                padding: "6px 14px",
                borderRadius: "20px",
                textTransform: "uppercase",
              }}
            >
              MODULE 2: OFF-CAMPUS WORKFLOW
            </span>
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#FFF7ED", margin: 0, fontFamily: "var(--font-display)" }}>
            Off-Campus Career Records
          </h1>
          <p style={{ fontSize: "14.5px", color: "#FFF7ED", marginTop: "10px", opacity: 0.92, maxWidth: "680px", lineHeight: 1.5 }}>
            Submit and track independent internships or full-time placement offers secured outside college-managed campus drives. Official institutional credit and placement records require T&P cell review.
          </p>
        </div>

        <Button
          variant="secondary"
          icon={PlusCircle}
          onClick={handleOpenSubmit}
          style={{
            background: "#FFFFFF",
            color: "var(--wine)",
            border: "none",
            padding: "12px 24px",
            borderRadius: "12px",
            fontWeight: 700,
            fontSize: "14px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
            position: "relative",
            zIndex: 2,
          }}
        >
          Submit Off-Campus Record
        </Button>
      </div>

      {/* Success Banner */}
      {successBanner && (
        <div
          style={{
            padding: "16px 20px",
            borderRadius: "12px",
            background: "var(--green-bg)",
            color: "var(--green)",
            fontSize: "14px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px solid rgba(64, 112, 80, 0.2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <CheckCircle2 size={18} />
            {successBanner}
          </div>
          <button
            onClick={() => setSuccessBanner("")}
            style={{ color: "var(--green)", fontWeight: 700, fontSize: "16px", cursor: "pointer" }}
          >
            ×
          </button>
        </div>
      )}

      {/* Verification Policy Notice */}
      <div
        style={{
          background: "var(--cream)",
          border: "1px solid rgba(231, 111, 81, 0.25)",
          borderLeft: "5px solid var(--terracotta)",
          borderRadius: "14px",
          padding: "18px 24px",
          display: "flex",
          gap: "14px",
          alignItems: "flex-start",
        }}
      >
        <Info size={20} color="var(--terracotta)" style={{ flexShrink: 0, marginTop: "2px" }} />
        <div style={{ fontSize: "13.5px", color: "var(--charcoal)", lineHeight: 1.5 }}>
          <strong>Institutional Verification Policy:</strong> Self-reported submissions remain in <em>Pending</em> status until the Training & Placement (T&P) cell reviews and verifies your supporting documentation (offer letter or completion certificate). Pending and rejected requests do not count as verified placement outcomes.
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <LoadingState message="Loading your off-campus submissions..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadSubmissions} />
      ) : submissions.length === 0 ? (
        <EmptyState
          title="No Off-Campus Records Found"
          description="Have you secured an independent internship or full-time placement outside campus drives? Submit your details to receive official college recognition."
          actionLabel="Submit Off-Campus Record"
          onAction={handleOpenSubmit}
          icon={Briefcase}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {submissions.map((sub) => {
            const isPending = sub.status === "pending";
            const isApproved = sub.status === "approved";
            const isNeedsInfo = sub.status === "needs_more_info";
            const isRejected = sub.status === "rejected";

            return (
              <div
                key={sub.submission_id}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "18px",
                  padding: "24px 28px",
                  border: isNeedsInfo
                    ? "2px solid var(--terracotta)"
                    : isApproved
                    ? "1px solid rgba(64, 112, 80, 0.3)"
                    : "1px solid var(--border)",
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  transition: "all var(--transition-fast)",
                }}
              >
                {/* Row 1: Header & Status */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          background: sub.record_type === "full_time_placement" ? "var(--wine-subtle)" : "var(--cream)",
                          color: sub.record_type === "full_time_placement" ? "var(--wine)" : "var(--terracotta)",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {sub.record_type === "full_time_placement" ? "Full-Time Placement" : "Off-Campus Internship"}
                      </span>
                      <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                        Submitted on {formatDate(sub.submitted_at)}
                      </span>
                    </div>

                    <h3 style={{ fontSize: "20px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
                      {sub.job_title}
                    </h3>
                    <div style={{ fontSize: "14.5px", fontWeight: 600, color: "var(--wine)", display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                      <Building2 size={16} />
                      {sub.company_name}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                    {isPending && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "var(--yellow-bg)", color: "var(--yellow)", padding: "6px 14px", borderRadius: "20px", fontSize: "12.5px", fontWeight: 700 }}>
                        <Clock size={14} /> Pending T&P Review
                      </span>
                    )}
                    {isNeedsInfo && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "var(--terracotta-subtle)", color: "var(--terracotta)", padding: "6px 14px", borderRadius: "20px", fontSize: "12.5px", fontWeight: 700, border: "1px solid var(--terracotta)" }}>
                        <AlertTriangle size={14} /> Action Required: Needs More Info
                      </span>
                    )}
                    {isApproved && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "var(--green-bg)", color: "var(--green)", padding: "6px 14px", borderRadius: "20px", fontSize: "12.5px", fontWeight: 700 }}>
                        <CheckCircle2 size={14} /> Institutionally Approved & Verified
                      </span>
                    )}
                    {isRejected && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "var(--red-bg)", color: "var(--red)", padding: "6px 14px", borderRadius: "20px", fontSize: "12.5px", fontWeight: 700 }}>
                        <XCircle size={14} /> Submission Rejected
                      </span>
                    )}

                    {sub.reviewed_at && (
                      <span style={{ fontSize: "11px", color: "var(--muted)" }}>
                        Reviewed: {formatDate(sub.reviewed_at)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Row 2: Details & Dates */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", background: "var(--warm-white)", padding: "14px 18px", borderRadius: "10px", fontSize: "13px" }}>
                  <div>
                    <span style={{ color: "var(--muted)", display: "block" }}>Tenure Dates</span>
                    <strong>{sub.start_date ? formatDate(sub.start_date) : "Flexible"} — {sub.end_date ? formatDate(sub.end_date) : "Ongoing"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)", display: "block" }}>Supporting Details</span>
                    <span style={{ color: "var(--charcoal)" }}>{sub.details || "No additional comments provided."}</span>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)", display: "block" }}>Uploaded Evidence</span>
                    {sub.evidence_file ? (
                      <a
                        href={api.getEvidenceUrl(sub.evidence_file)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "var(--wine)", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}
                      >
                        <FileCheck size={14} /> View Evidence File
                      </a>
                    ) : (
                      <span style={{ color: "var(--muted-light)" }}>None uploaded</span>
                    )}
                  </div>
                </div>

                {/* Needs More Info or Rejection Callout */}
                {(isNeedsInfo || isRejected) && sub.reviewer_notes && (
                  <div
                    style={{
                      background: isNeedsInfo ? "var(--cream)" : "var(--red-bg)",
                      border: `1px solid ${isNeedsInfo ? "var(--terracotta)" : "var(--red)"}`,
                      borderRadius: "10px",
                      padding: "14px 18px",
                      fontSize: "13.5px",
                    }}
                  >
                    <strong style={{ color: isNeedsInfo ? "var(--terracotta)" : "var(--red)", display: "block", marginBottom: "4px" }}>
                      {isNeedsInfo ? "T&P Information Request:" : "Reason for Rejection:"}
                    </strong>
                    <p style={{ margin: 0, color: "var(--charcoal)" }}>{sub.reviewer_notes}</p>
                  </div>
                )}

                {/* Row 3: Action Buttons */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: "1px solid var(--border-light)", flexWrap: "wrap", gap: "10px" }}>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={History}
                    onClick={() => handleViewHistory(sub)}
                    style={{ fontSize: "12.5px" }}
                  >
                    View Audit History
                  </Button>

                  {isNeedsInfo && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={UploadCloud}
                      onClick={() => handleOpenResubmit(sub)}
                      style={{ background: "var(--terracotta)", borderColor: "var(--terracotta)" }}
                    >
                      Respond & Resubmit Details
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 1. SUBMIT OFF-CAMPUS MODAL */}
      <Modal isOpen={isSubmitOpen} onClose={() => setIsSubmitOpen(false)} title="Submit Off-Campus Career Record" maxWidth="580px">
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {submitError && (
            <div style={{ padding: "12px 16px", borderRadius: "8px", background: "var(--red-bg)", color: "var(--red)", fontSize: "13px", fontWeight: 600 }}>
              {submitError}
            </div>
          )}

          <Input
            label="Company / Employer Name"
            icon={Building2}
            placeholder="e.g. Google India, Infosys, Tech Mahindra"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />

          <Input
            label="Designation / Job Title"
            icon={Briefcase}
            placeholder="e.g. Software Development Intern, Associate Analyst"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
          />

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--charcoal)", marginBottom: "6px" }}>
              Record Type
            </label>
            <select
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                fontSize: "14px",
                background: "#FFFFFF",
                fontFamily: "inherit",
              }}
            >
              <option value="internship">Off-Campus Internship</option>
              <option value="full_time_placement">Full-Time Placement Offer</option>
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <Input
              label="Start Date"
              type="date"
              icon={Calendar}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label="End Date (if internship)"
              type="date"
              icon={Calendar}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--charcoal)", marginBottom: "6px" }}>
              Supporting Details / Offer Terms
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Monthly stipend, reporting office location, supervisor contact details, or performance expectations."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                fontSize: "14px",
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--charcoal)", marginBottom: "6px" }}>
              Evidence Document (Offer Letter or Certificate)
            </label>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => setEvidenceFile(e.target.files[0] || null)}
              style={{
                fontSize: "13px",
                color: "var(--muted)",
                width: "100%",
                padding: "8px 0",
              }}
            />
            <span style={{ fontSize: "11.5px", color: "var(--muted-light)", display: "block", marginTop: "2px" }}>
              PDF, JPG, or PNG format. Maximum file size: 5MB.
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
            <Button variant="outline" type="button" onClick={() => setIsSubmitOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Submit for Verification
            </Button>
          </div>
        </form>
      </Modal>

      {/* 2. RESUBMIT INFORMATION MODAL */}
      <Modal isOpen={Boolean(resubmitTarget)} onClose={() => setResubmitTarget(null)} title="Respond to T&P Information Request" maxWidth="540px">
        <form onSubmit={handleResubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {resubmitError && (
            <div style={{ padding: "12px 16px", borderRadius: "8px", background: "var(--red-bg)", color: "var(--red)", fontSize: "13px", fontWeight: 600 }}>
              {resubmitError}
            </div>
          )}

          <div style={{ background: "var(--cream)", padding: "12px 16px", borderRadius: "10px", fontSize: "13px", border: "1px solid var(--border)" }}>
            <strong style={{ color: "var(--wine)" }}>T&P Request:</strong> {resubmitTarget?.reviewer_notes}
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--charcoal)", marginBottom: "6px" }}>
              Updated Explanation / Clarifications
            </label>
            <textarea
              rows={4}
              value={resubmitDetails}
              onChange={(e) => setResubmitDetails(e.target.value)}
              placeholder="Provide the specific information requested by the T&P officer..."
              required
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                fontSize: "14px",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--charcoal)", marginBottom: "6px" }}>
              Replace or Upload New Evidence (Optional)
            </label>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => setResubmitFile(e.target.files[0] || null)}
              style={{ fontSize: "13px", color: "var(--muted)", width: "100%", padding: "8px 0" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
            <Button variant="outline" type="button" onClick={() => setResubmitTarget(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={resubmitting}>
              Resubmit Information
            </Button>
          </div>
        </form>
      </Modal>

      {/* 3. AUDIT HISTORY MODAL */}
      <Modal isOpen={Boolean(historyTarget)} onClose={() => setHistoryTarget(null)} title="Submission Decision & Audit History" maxWidth="560px">
        {loadingHistory ? (
          <LoadingState message="Loading audit history..." />
        ) : historyLogs.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: "14px", textAlign: "center", padding: "20px 0" }}>
            No audit events recorded yet for this submission.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "400px", overflowY: "auto" }}>
            {historyLogs.map((log) => (
              <div
                key={log.log_id}
                style={{
                  background: "var(--warm-white)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  padding: "14px 16px",
                  fontSize: "13px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <strong style={{ color: "var(--wine)", textTransform: "uppercase", fontSize: "11.5px" }}>
                    {log.action}
                  </strong>
                  <span style={{ color: "var(--muted)", fontSize: "11.5px" }}>{formatDateTime(log.created_at)}</span>
                </div>
                <div style={{ color: "var(--charcoal)", fontSize: "13px", marginBottom: "4px" }}>
                  {log.comments || "Status update logged."}
                </div>
                <div style={{ fontSize: "11px", color: "var(--muted)" }}>
                  Actor: <strong>{log.actor_email}</strong> ({log.actor_role})
                  {log.previous_status && log.new_status && (
                    <span> • State: {log.previous_status} → <strong>{log.new_status}</strong></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
export default StudentOffCampus;
