import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Modal } from "../../components/common/Modal";
import { SearchBar } from "../../components/common/SearchBar";
import { LoadingState, ErrorState, EmptyState } from "../../components/common/FeedbackStates";
import {
  CheckSquare,
  Building2,
  Calendar,
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  History,
  Clock,
  Filter,
  GraduationCap,
  Award,
} from "lucide-react";

export function AdminOffCampusQueue() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeStatus, setActiveStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Review & Decision Modal
  const [selectedSub, setSelectedSub] = useState(null);
  const [decisionAction, setDecisionAction] = useState(""); // "approve" | "reject" | "request_info"
  const [decisionNotes, setDecisionNotes] = useState("");
  const [savingDecision, setSavingDecision] = useState(false);
  const [decisionError, setDecisionError] = useState("");

  // Audit History Modal
  const [historySub, setHistorySub] = useState(null);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Success alert
  const [successBanner, setSuccessBanner] = useState("");

  useEffect(() => {
    loadQueue();
  }, [activeStatus]);

  const loadQueue = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (activeStatus !== "all") params.status = activeStatus;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await api.getOffCampusQueue(params);
      setQueue(res.queue || []);
    } catch (err) {
      console.error("Queue load error:", err);
      setError("Unable to load off-campus queue.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadQueue();
  };

  const handleOpenDecision = (sub, action) => {
    setSelectedSub(sub);
    setDecisionAction(action);
    setDecisionNotes("");
    setDecisionError("");
  };

  const handleExecuteDecision = async (e) => {
    e.preventDefault();
    if (!selectedSub || !decisionAction) return;

    if (decisionAction === "reject" && (!decisionNotes || !decisionNotes.trim())) {
      setDecisionError("Rejection requires an explicit reason explaining why the submission was rejected.");
      return;
    }

    if (decisionAction === "request_info" && (!decisionNotes || !decisionNotes.trim())) {
      setDecisionError("Please describe what additional information or documents are needed.");
      return;
    }

    setSavingDecision(true);
    setDecisionError("");

    try {
      const res = await api.decideOffCampus(selectedSub.submission_id, {
        action: decisionAction,
        notes: decisionNotes.trim(),
      });

      if (res.success) {
        setSelectedSub(null);
        setSuccessBanner(`Submission has been ${res.new_status}. Institutional records and audit history updated.`);
        loadQueue();
      } else {
        throw new Error(res.message || "Decision processing failed.");
      }
    } catch (err) {
      console.error("Decision error:", err);
      setDecisionError(err.message || "Failed to submit decision.");
    } finally {
      setSavingDecision(false);
    }
  };

  const handleOpenHistory = async (sub) => {
    setHistorySub(sub);
    setLoadingHistory(true);
    try {
      const res = await api.getOffCampusHistory(sub.submission_id);
      setHistoryLogs(res.history || []);
    } catch (err) {
      console.error("History fetch error:", err);
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

  // Status Filter Tabs
  const statusTabs = [
    { id: "all", label: "All Submissions" },
    { id: "pending", label: "Pending Review" },
    { id: "needs_more_info", label: "Needs Info" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }} className="animate-fade-in">
      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1.2px",
              color: "var(--wine)",
              background: "var(--wine-subtle)",
              padding: "4px 10px",
              borderRadius: "14px",
              textTransform: "uppercase",
            }}
          >
            T&P AUTHORITY QUEUE
          </span>
        </div>
        <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
          Off-Campus Approval Queue
        </h1>
        <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px" }}>
          Centralized verification and approval authority for independent student internships and placement offers.
        </p>
      </div>

      {/* Success Alert */}
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

      {/* Filter Tabs & Search */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", gap: "8px", background: "var(--cream)", padding: "4px", borderRadius: "12px" }}>
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveStatus(tab.id)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: activeStatus === tab.id ? 700 : 500,
                color: activeStatus === tab.id ? "#FFFFFF" : "var(--charcoal)",
                background: activeStatus === tab.id ? "var(--wine)" : "transparent",
                transition: "all var(--transition-fast)",
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "10px" }}>
          <SearchBar
            placeholder="Search by student, company, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="secondary" type="submit">
            Filter
          </Button>
        </form>
      </div>

      {/* Queue Listing */}
      {loading ? (
        <LoadingState message="Loading off-campus queue..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadQueue} />
      ) : queue.length === 0 ? (
        <EmptyState
          title="No Requests in this Filter"
          description="There are currently no off-campus submissions matching the active status filter."
          icon={CheckSquare}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {queue.map((item) => {
            const isPending = item.status === "pending";
            const isNeedsInfo = item.status === "needs_more_info";
            const isApproved = item.status === "approved";
            const isRejected = item.status === "rejected";

            return (
              <div
                key={item.submission_id}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "18px",
                  padding: "24px 28px",
                  border: isPending
                    ? "2px solid #F4A261"
                    : isNeedsInfo
                    ? "1px solid var(--terracotta)"
                    : "1px solid var(--border)",
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {/* Header row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "14px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          background: item.record_type === "full_time_placement" ? "var(--wine-subtle)" : "var(--cream)",
                          color: item.record_type === "full_time_placement" ? "var(--wine)" : "var(--terracotta)",
                        }}
                      >
                        {item.record_type === "full_time_placement" ? "Full-Time Placement" : "Off-Campus Internship"}
                      </span>
                      <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                        Submitted {formatDate(item.submitted_at)}
                      </span>
                    </div>

                    <h3 style={{ fontSize: "20px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
                      {item.job_title} @ {item.company_name}
                    </h3>

                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "6px", fontSize: "13.5px", color: "var(--muted)", flexWrap: "wrap" }}>
                      <span>Student: <strong style={{ color: "var(--charcoal)" }}>{item.student_name}</strong></span>
                      <span>Dept: <strong>{item.student_department || "N/A"}</strong></span>
                      <span>CGPA: <strong>{item.student_gpa ? `${Number(item.student_gpa).toFixed(2)}/10.00` : "N/A"}</strong></span>
                      <span>Email: {item.student_email}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isPending && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "var(--yellow-bg)", color: "var(--yellow)", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 700 }}>
                        <Clock size={14} /> Pending Review
                      </span>
                    )}
                    {isNeedsInfo && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "var(--cream)", color: "var(--terracotta)", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, border: "1px solid var(--terracotta)" }}>
                        <AlertTriangle size={14} /> Needs More Info
                      </span>
                    )}
                    {isApproved && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "var(--green-bg)", color: "var(--green)", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 700 }}>
                        <CheckCircle2 size={14} /> Approved & Verified
                      </span>
                    )}
                    {isRejected && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "var(--red-bg)", color: "var(--red)", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 700 }}>
                        <XCircle size={14} /> Rejected
                      </span>
                    )}
                  </div>
                </div>

                {/* Details Box */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", background: "var(--warm-white)", padding: "14px 18px", borderRadius: "10px", fontSize: "13px" }}>
                  <div>
                    <span style={{ color: "var(--muted)", display: "block" }}>Dates</span>
                    <strong>{item.start_date ? formatDate(item.start_date) : "N/A"} — {item.end_date ? formatDate(item.end_date) : "Ongoing"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)", display: "block" }}>Student's Notes</span>
                    <span>{item.details || "No remarks provided."}</span>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)", display: "block" }}>Supporting Evidence</span>
                    {item.evidence_file ? (
                      <a
                        href={api.getEvidenceUrl(item.evidence_file)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "var(--wine)", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}
                      >
                        <FileCheck size={14} /> Inspect Evidence File
                      </a>
                    ) : (
                      <span style={{ color: "var(--muted-light)" }}>No evidence attached</span>
                    )}
                  </div>
                </div>

                {/* Reviewer remarks if present */}
                {item.reviewer_notes && (
                  <div style={{ background: "var(--cream)", padding: "12px 16px", borderRadius: "10px", fontSize: "13px", border: "1px solid var(--border)" }}>
                    <strong style={{ color: "var(--wine)" }}>T&P Remark / Reason:</strong> {item.reviewer_notes}
                    {item.reviewed_at && (
                      <span style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginTop: "4px" }}>
                        Logged on {formatDateTime(item.reviewed_at)}
                      </span>
                    )}
                  </div>
                )}

                {/* Action Bar */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: "1px solid var(--border-light)", flexWrap: "wrap", gap: "10px" }}>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={History}
                    onClick={() => handleOpenHistory(item)}
                    style={{ fontSize: "12.5px" }}
                  >
                    Audit Trail
                  </Button>

                  {/* Decision Controls */}
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={AlertTriangle}
                      onClick={() => handleOpenDecision(item, "request_info")}
                      style={{ color: "var(--terracotta)", borderColor: "var(--terracotta)" }}
                    >
                      Request Info
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={XCircle}
                      onClick={() => handleOpenDecision(item, "reject")}
                      style={{ color: "var(--red)", borderColor: "var(--red)" }}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={CheckCircle2}
                      onClick={() => handleOpenDecision(item, "approve")}
                      style={{ background: "var(--green)", borderColor: "var(--green)" }}
                    >
                      Approve & Verify
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DECISION MODAL */}
      <Modal
        isOpen={Boolean(selectedSub)}
        onClose={() => setSelectedSub(null)}
        title={
          decisionAction === "approve"
            ? "Approve Off-Campus Placement"
            : decisionAction === "reject"
            ? "Reject Off-Campus Submission"
            : "Request Additional Information"
        }
        maxWidth="520px"
      >
        <form onSubmit={handleExecuteDecision} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {decisionError && (
            <div style={{ padding: "12px 16px", borderRadius: "8px", background: "var(--red-bg)", color: "var(--red)", fontSize: "13px", fontWeight: 600 }}>
              {decisionError}
            </div>
          )}

          <div style={{ background: "var(--cream)", padding: "12px 16px", borderRadius: "10px", fontSize: "13px" }}>
            Candidate: <strong>{selectedSub?.student_name}</strong> ({selectedSub?.student_department})<br />
            Position: <strong>{selectedSub?.job_title}</strong> @ <strong>{selectedSub?.company_name}</strong>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--charcoal)", marginBottom: "6px" }}>
              {decisionAction === "reject"
                ? "Mandatory Rejection Reason"
                : decisionAction === "request_info"
                ? "Required Details / Document Checklist"
                : "Approval Comments (Optional)"}
            </label>
            <textarea
              rows={4}
              value={decisionNotes}
              onChange={(e) => setDecisionNotes(e.target.value)}
              placeholder={
                decisionAction === "reject"
                  ? "Explain why this record cannot be approved (e.g. Unverified employer, incomplete documentation, date conflict)..."
                  : decisionAction === "request_info"
                  ? "Describe what additional proof or clarification the student must submit..."
                  : "e.g. Verified with employer HR. Approved for official placement statistics."
              }
              required={decisionAction === "reject" || decisionAction === "request_info"}
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

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
            <Button variant="outline" type="button" onClick={() => setSelectedSub(null)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={savingDecision}
              style={{
                background:
                  decisionAction === "approve"
                    ? "var(--green)"
                    : decisionAction === "reject"
                    ? "var(--red)"
                    : "var(--terracotta)",
              }}
            >
              Confirm Decision
            </Button>
          </div>
        </form>
      </Modal>

      {/* AUDIT HISTORY MODAL */}
      <Modal isOpen={Boolean(historySub)} onClose={() => setHistorySub(null)} title="Official Decision Audit Trail" maxWidth="560px">
        {loadingHistory ? (
          <LoadingState message="Loading audit events..." />
        ) : historyLogs.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: "14px", textAlign: "center", padding: "20px 0" }}>
            No audit records found for this submission.
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
                    <span> • Transition: {log.previous_status} → <strong>{log.new_status}</strong></span>
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
export default AdminOffCampusQueue;
