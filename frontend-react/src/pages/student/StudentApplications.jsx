import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Button } from "../../components/common/Button";
import { LoadingState, ErrorState, EmptyState } from "../../components/common/FeedbackStates";
import { SearchBar } from "../../components/common/SearchBar";
import {
  Building2,
  Calendar,
  FileText,
  AlertCircle,
  Trash2,
  Briefcase,
  MapPin,
  CheckCircle2,
  Clock,
  Award,
  Send,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export function StudentApplications() {
  const { student } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const fetchApplications = async () => {
    if (!student?.student_id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await api.getStudentApplications(student.student_id);
      const list = res?.applications || [];
      list.sort((a, b) => new Date(b.applied_at) - new Date(a.applied_at));
      setApplications(list);
    } catch (err) {
      console.error("Fetch applications error:", err);
      setError("Unable to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [student?.student_id]);

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm("Are you sure you want to withdraw this application?")) return;

    try {
      setActionMessage("");
      await api.withdrawApplication(applicationId, student.student_id);
      setActionMessage("Application withdrawn successfully.");
      fetchApplications();
    } catch (err) {
      alert(err.message || "Failed to withdraw application.");
    }
  };

  const filteredApps = applications.filter((app) => {
    if (filterStatus !== "all" && (app.status || "").toLowerCase() !== filterStatus.toLowerCase()) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = (app.title || "").toLowerCase().includes(q);
      const matchCompany = (app.company_name || "").toLowerCase().includes(q);
      const matchDomain = (app.domain || "").toLowerCase().includes(q);
      return matchTitle || matchCompany || matchDomain;
    }
    return true;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? String(dateStr).slice(0, 10)
      : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  // Executive summary counts
  const totalCount = applications.length;
  const pendingCount = applications.filter((a) => (a.status || "").toLowerCase() === "pending").length;
  const shortlistedCount = applications.filter((a) => (a.status || "").toLowerCase() === "shortlisted").length;
  const acceptedCount = applications.filter((a) => (a.status || "").toLowerCase() === "accepted").length;

  const getStatusBorderColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "accepted":
        return "var(--green)";
      case "shortlisted":
        return "#D97706";
      case "rejected":
        return "var(--red)";
      case "withdrawn":
        return "var(--border)";
      case "pending":
      default:
        return "var(--wine)";
    }
  };

  if (loading) {
    return <LoadingState message="Loading your submitted applications..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchApplications} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
          My Applications
        </h1>
        <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px" }}>
          Track application progress, evaluate recruiter status, and manage active submissions.
        </p>
      </div>

      {actionMessage && (
        <div style={{ padding: "12px 16px", borderRadius: "10px", background: "var(--green-bg)", color: "var(--green)", fontSize: "13px", fontWeight: 500 }}>
          {actionMessage}
        </div>
      )}

      {/* Executive Summary Metrics Banner */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            padding: "18px 20px",
            border: "1px solid var(--border)",
            borderLeft: "4px solid var(--wine)",
            boxShadow: "var(--shadow-xs)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>
              Total Applied
            </span>
            <span style={{ fontSize: "26px", fontWeight: 800, color: "var(--charcoal)", marginTop: "2px", display: "block" }}>
              {totalCount}
            </span>
          </div>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Send size={18} style={{ color: "var(--wine)" }} />
          </div>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            padding: "18px 20px",
            border: "1px solid var(--border)",
            borderLeft: "4px solid var(--terracotta)",
            boxShadow: "var(--shadow-xs)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>
              Under Review
            </span>
            <span style={{ fontSize: "26px", fontWeight: 800, color: "var(--charcoal)", marginTop: "2px", display: "block" }}>
              {pendingCount}
            </span>
          </div>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--terracotta-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Clock size={18} style={{ color: "var(--terracotta)" }} />
          </div>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            padding: "18px 20px",
            border: "1px solid var(--border)",
            borderLeft: "4px solid #D97706",
            boxShadow: "var(--shadow-xs)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>
              Shortlisted
            </span>
            <span style={{ fontSize: "26px", fontWeight: 800, color: "var(--charcoal)", marginTop: "2px", display: "block" }}>
              {shortlistedCount}
            </span>
          </div>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Award size={18} style={{ color: "#D97706" }} />
          </div>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            padding: "18px 20px",
            border: "1px solid var(--border)",
            borderLeft: "4px solid var(--green)",
            boxShadow: "var(--shadow-xs)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>
              Offers Accepted
            </span>
            <span style={{ fontSize: "26px", fontWeight: 800, color: "var(--charcoal)", marginTop: "2px", display: "block" }}>
              {acceptedCount}
            </span>
          </div>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--green-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckCircle2 size={18} style={{ color: "var(--green)" }} />
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ maxWidth: "420px" }}>
          <SearchBar
            placeholder="Search by role, company, or domain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border)", paddingBottom: "12px", overflowX: "auto" }}>
          {["all", "pending", "shortlisted", "accepted", "rejected", "withdrawn"].map((statusKey) => (
            <button
              key={statusKey}
              onClick={() => setFilterStatus(statusKey)}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                border: "none",
                background: filterStatus === statusKey ? "var(--wine)" : "transparent",
                color: filterStatus === statusKey ? "#FFFFFF" : "var(--muted)",
                transition: "all var(--transition-fast)",
                textTransform: "capitalize",
                whiteSpace: "nowrap",
              }}
            >
              {statusKey === "all" ? `All (${totalCount})` : statusKey}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filteredApps.length === 0 ? (
        <EmptyState
          title="No Applications Found"
          message={
            searchTerm
              ? `No applications matched "${searchTerm}". Try adjusting your search query.`
              : `You have no applications with status "${filterStatus}".`
          }
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filteredApps.map((app) => {
            const st = (app.status || "").toLowerCase();
            return (
              <div
                key={app.application_id}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "16px",
                  padding: "24px",
                  border: "1px solid var(--border)",
                  borderLeft: `5px solid ${getStatusBorderColor(app.status)}`,
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
                className="card-hover"
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                      <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", margin: 0 }}>
                        {app.title}
                      </h3>
                      <StatusBadge status={app.status} />
                    </div>

                    <div style={{ fontSize: "14px", color: "var(--muted)", marginTop: "6px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: "var(--charcoal)", fontWeight: 600 }}>
                        <Building2 size={15} style={{ color: "var(--wine)" }} />
                        {app.company_name}
                      </span>
                      {app.location && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <MapPin size={13} style={{ color: "var(--terracotta)" }} />
                          {app.location}
                        </span>
                      )}
                      {app.domain && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <Briefcase size={13} style={{ color: "var(--muted)" }} />
                          {app.domain}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {app.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleWithdraw(app.application_id)}
                        style={{ color: "var(--red)", borderColor: "var(--red-bg)" }}
                      >
                        Withdraw
                      </Button>
                    )}
                  </div>
                </div>

                {/* Status Progress Stepper */}
                <div
                  style={{
                    background: "var(--warm-white)",
                    borderRadius: "12px",
                    padding: "14px 16px",
                    border: "1px solid var(--border-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px",
                    overflowX: "auto",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "120px" }}>
                    <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "var(--green)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700 }}>
                      ✓
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--charcoal)" }}>Submitted</span>
                  </div>

                  <div style={{ height: "2px", flex: 1, minWidth: "20px", background: st !== "withdrawn" ? "var(--wine)" : "var(--border)" }} />

                  <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "140px" }}>
                    <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: st === "pending" ? "var(--wine)" : (st === "shortlisted" || st === "accepted") ? "var(--green)" : "var(--border)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700 }}>
                      {st === "shortlisted" || st === "accepted" ? "✓" : "2"}
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: st === "pending" ? "var(--wine)" : "var(--charcoal)" }}>Review Stage</span>
                  </div>

                  <div style={{ height: "2px", flex: 1, minWidth: "20px", background: (st === "shortlisted" || st === "accepted") ? "var(--wine)" : "var(--border)" }} />

                  <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "130px" }}>
                    <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: st === "shortlisted" ? "#D97706" : st === "accepted" ? "var(--green)" : st === "rejected" ? "var(--red)" : "var(--border)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700 }}>
                      {st === "accepted" ? "✓" : st === "rejected" ? "✕" : "3"}
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: st === "shortlisted" ? "#D97706" : st === "accepted" ? "var(--green)" : st === "rejected" ? "var(--red)" : "var(--muted)" }}>
                      {st === "shortlisted" ? "Shortlisted" : st === "accepted" ? "Offer Accepted" : st === "rejected" ? "Not Selected" : "Decision"}
                    </span>
                  </div>
                </div>

                {/* Timestamp & Deadline details */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "var(--muted)", background: "var(--warm-white)", padding: "4px 10px", borderRadius: "8px", border: "1px solid var(--border-light)", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                    <Calendar size={13} style={{ color: "var(--wine)" }} />
                    Submitted: {formatDate(app.applied_at)}
                  </span>
                  {app.application_deadline && (
                    <span style={{ fontSize: "12px", color: "var(--muted)", background: "var(--warm-white)", padding: "4px 10px", borderRadius: "8px", border: "1px solid var(--border-light)", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                      <Clock size={13} style={{ color: "var(--terracotta)" }} />
                      Deadline: {formatDate(app.application_deadline)}
                    </span>
                  )}
                  {app.resume && (
                    <a
                      href={app.resume.startsWith("http") ? app.resume : `http://localhost:5000/${app.resume.replace(/^\//, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "12px",
                        color: "var(--wine)",
                        background: "var(--cream)",
                        padding: "4px 10px",
                        borderRadius: "8px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      <FileText size={13} />
                      View Submitted Resume
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>

                {(app.cover_letter || app.qualifications) && (
                  <div
                    style={{
                      background: "var(--warm-white)",
                      borderRadius: "12px",
                      padding: "16px",
                      fontSize: "13px",
                      color: "var(--charcoal)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {app.qualifications && (
                      <div>
                        <strong>Qualifications:</strong> {app.qualifications}
                      </div>
                    )}
                    {app.cover_letter && (
                      <div>
                        <strong>Cover Letter:</strong> {app.cover_letter}
                      </div>
                    )}
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
