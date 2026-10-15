import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { LoadingState, ErrorState, EmptyState } from "../../components/common/FeedbackStates";
import { SearchBar } from "../../components/common/SearchBar";
import {
  FileText,
  User,
  Building2,
  Calendar,
  CheckCircle,
  XCircle,
  Award,
  Phone,
  GraduationCap,
  ExternalLink,
  Clock,
  Send,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export function FacultyApplications() {
  const { faculty, user } = useAuth();
  const navigate = useNavigate();

  const facultyId = faculty?.faculty_id || user?.profile?.faculty_id;

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Selected application for detail modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");

  const fetchApplications = async () => {
    if (!facultyId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await api.getFacultyApplications(facultyId);
      const list = res?.applications || [];
      list.sort((a, b) => new Date(b.applied_at) - new Date(a.applied_at));
      setApplications(list);
    } catch (err) {
      console.error("Faculty fetch applications error:", err);
      setError("Unable to load student applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [facultyId]);

  const handleUpdateStatus = async (appId, newStatus, studentName = "Student") => {
    if (!facultyId || updating) return;

    try {
      setUpdating(true);
      setActionSuccess("");

      const res = await api.updateApplicationStatus(appId, facultyId, newStatus);

      if (res.success || res.message) {
        setActionSuccess(`Application for ${studentName} updated to "${newStatus.toUpperCase()}" successfully.`);
        fetchApplications();
        if (selectedApp && selectedApp.application_id === appId) {
          setSelectedApp((prev) => ({ ...prev, status: newStatus }));
        }
      } else {
        alert(res.message || "Failed to update application status.");
      }
    } catch (err) {
      alert(err.message || "Unable to update application status.");
    } finally {
      setUpdating(false);
    }
  };

  const filteredApps = applications.filter((app) => {
    if (filterStatus !== "all" && (app.status || "").toLowerCase() !== filterStatus.toLowerCase()) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchStudent = (app.student_name || "").toLowerCase().includes(q);
      const matchDept = (app.student_department || "").toLowerCase().includes(q);
      const matchTitle = (app.internship_title || "").toLowerCase().includes(q);
      const matchCompany = (app.company_name || "").toLowerCase().includes(q);
      return matchStudent || matchDept || matchTitle || matchCompany;
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

  // KPI Metrics
  const totalCount = applications.length;
  const pendingCount = applications.filter((a) => (a.status || "").toLowerCase() === "pending").length;
  const shortlistedCount = applications.filter((a) => (a.status || "").toLowerCase() === "shortlisted").length;
  const acceptedCount = applications.filter((a) => (a.status || "").toLowerCase() === "accepted").length;
  const rejectedCount = applications.filter((a) => (a.status || "").toLowerCase() === "rejected").length;

  if (loading) {
    return <LoadingState message="Fetching student application files..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchApplications} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: "26px", fontWeight: 800, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
          Student Applications Review
        </h1>
        <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px" }}>
          Review candidate profiles, check qualifications, and update shortlist/acceptance decisions.
        </p>
      </div>

      {actionSuccess && (
        <div style={{ padding: "12px 16px", borderRadius: "10px", background: "var(--green-bg)", color: "var(--green)", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
          <CheckCircle2 size={16} />
          {actionSuccess}
        </div>
      )}

      {/* KPI Metrics Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            padding: "16px 20px",
            border: "1px solid var(--border)",
            borderLeft: "4px solid var(--wine)",
            boxShadow: "var(--shadow-xs)",
          }}
        >
          <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>
            Total Received
          </span>
          <span style={{ fontSize: "26px", fontWeight: 800, color: "var(--charcoal)", marginTop: "2px", display: "block" }}>
            {totalCount}
          </span>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            padding: "16px 20px",
            border: "1px solid var(--border)",
            borderLeft: "4px solid var(--terracotta)",
            boxShadow: "var(--shadow-xs)",
          }}
        >
          <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>
            Under Review
          </span>
          <span style={{ fontSize: "26px", fontWeight: 800, color: "var(--charcoal)", marginTop: "2px", display: "block" }}>
            {pendingCount}
          </span>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            padding: "16px 20px",
            border: "1px solid var(--border)",
            borderLeft: "4px solid #D97706",
            boxShadow: "var(--shadow-xs)",
          }}
        >
          <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>
            Shortlisted
          </span>
          <span style={{ fontSize: "26px", fontWeight: 800, color: "var(--charcoal)", marginTop: "2px", display: "block" }}>
            {shortlistedCount}
          </span>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            padding: "16px 20px",
            border: "1px solid var(--border)",
            borderLeft: "4px solid var(--green)",
            boxShadow: "var(--shadow-xs)",
          }}
        >
          <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>
            Offers Accepted
          </span>
          <span style={{ fontSize: "26px", fontWeight: 800, color: "var(--charcoal)", marginTop: "2px", display: "block" }}>
            {acceptedCount}
          </span>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            padding: "16px 20px",
            border: "1px solid var(--border)",
            borderLeft: "4px solid var(--red)",
            boxShadow: "var(--shadow-xs)",
          }}
        >
          <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>
            Rejected
          </span>
          <span style={{ fontSize: "26px", fontWeight: 800, color: "var(--charcoal)", marginTop: "2px", display: "block" }}>
            {rejectedCount}
          </span>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ maxWidth: "420px" }}>
          <SearchBar
            placeholder="Search by student, department, role, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border)", paddingBottom: "12px", overflowX: "auto" }}>
          {[
            { key: "all", label: `All (${totalCount})` },
            { key: "pending", label: `Pending (${pendingCount})` },
            { key: "shortlisted", label: `Shortlisted (${shortlistedCount})` },
            { key: "accepted", label: `Accepted (${acceptedCount})` },
            { key: "rejected", label: `Rejected (${rejectedCount})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              style={{
                padding: "8px 18px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                border: "none",
                background: filterStatus === tab.key ? "var(--wine)" : "transparent",
                color: filterStatus === tab.key ? "#FFFFFF" : "var(--muted)",
                transition: "all var(--transition-fast)",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <EmptyState
          title="No Applications Found"
          message={
            searchTerm
              ? `No student applications matched "${searchTerm}". Try another search term.`
              : `No applications with status "${filterStatus}".`
          }
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filteredApps.map((app) => {
            const st = (app.status || "").toLowerCase();
            const borderCol =
              st === "accepted"
                ? "var(--green)"
                : st === "shortlisted"
                ? "#D97706"
                : st === "rejected"
                ? "var(--red)"
                : "var(--wine)";

            return (
              <div
                key={app.application_id}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "16px",
                  padding: "24px",
                  border: "1px solid var(--border)",
                  borderLeft: `5px solid ${borderCol}`,
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
                className="card-hover"
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
                        {app.student_name}
                      </h3>
                      <StatusBadge status={app.status} />
                    </div>

                    <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                      <span><GraduationCap size={15} style={{ verticalAlign: "middle", marginRight: "4px" }} />{app.student_department || "Dept N/A"}</span>
                      <span>• CGPA: <strong>{app.student_gpa ? `${Number(app.student_gpa).toFixed(2)}/10.00` : "N/A"}</strong></span>
                      <span>• Applied: {formatDate(app.applied_at)}</span>
                    </p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <Button size="sm" variant="outline" onClick={() => setSelectedApp(app)}>
                      View Full File
                    </Button>

                    {st === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          loading={updating}
                          disabled={updating}
                          onClick={() => handleUpdateStatus(app.application_id, "shortlisted", app.student_name)}
                        >
                          Shortlist
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          loading={updating}
                          disabled={updating}
                          style={{ color: "var(--red)", borderColor: "var(--red-bg)" }}
                          onClick={() => handleUpdateStatus(app.application_id, "rejected", app.student_name)}
                        >
                          Reject
                        </Button>
                      </>
                    )}

                    {st === "shortlisted" && (
                      <>
                        <Button
                          size="sm"
                          variant="primary"
                          loading={updating}
                          disabled={updating}
                          onClick={() => handleUpdateStatus(app.application_id, "accepted", app.student_name)}
                        >
                          Accept Offer
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate("/faculty/schedule-interview", { state: { applicationId: app.application_id } })}
                          icon={Clock}
                        >
                          Schedule Interview
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Internship summary bar */}
                <div
                  style={{
                    background: "var(--warm-white)",
                    borderRadius: "12px",
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "12px",
                    fontSize: "13px",
                    border: "1px solid var(--border-light)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Building2 size={16} style={{ color: "var(--wine)" }} />
                    <strong style={{ color: "var(--charcoal)" }}>{app.internship_title}</strong>
                    <span style={{ color: "var(--muted)" }}>({app.company_name})</span>
                  </div>

                  <div style={{ display: "flex", gap: "16px", color: "var(--muted)", flexWrap: "wrap" }}>
                    <span>Domain: <strong>{app.domain || "General"}</strong></span>
                    <span>Duration: <strong>{app.duration_weeks ? `${app.duration_weeks} wks` : app.duration || "N/A"}</strong></span>
                    <span>Stipend: <strong style={{ color: "var(--wine)" }}>{app.stipend ? `₹${Number(app.stipend).toLocaleString()}/mo` : "Disclosed"}</strong></span>
                  </div>
                </div>

                {/* Quick Snippet of qualifications / resume if present */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                  <div style={{ fontSize: "12px", color: "var(--muted)" }}>
                    {app.qualifications ? (
                      <span><strong>Key Skills:</strong> {app.qualifications}</span>
                    ) : (
                      <span>Application submitted through standard campus drive.</span>
                    )}
                  </div>

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
                      Resume Document
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Application Detail Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Candidate Review: ${selectedApp.student_name}`}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", margin: 0 }}>
                  {selectedApp.student_name}
                </h3>
                <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                  {selectedApp.student_department} • CGPA: <strong>{selectedApp.student_gpa ? `${Number(selectedApp.student_gpa).toFixed(2)}/10.00` : "N/A"}</strong> • {selectedApp.student_phone || "Phone N/A"}
                </span>
              </div>
              <StatusBadge status={selectedApp.status} />
            </div>

            {/* Target Role & Organization Box */}
            <div
              style={{
                background: "var(--cream)",
                border: "1px solid rgba(122, 31, 61, 0.2)",
                borderRadius: "12px",
                padding: "14px 18px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div style={{ fontSize: "12px", color: "var(--wine)", fontWeight: 700, textTransform: "uppercase" }}>
                Target Placement Position
              </div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--charcoal)" }}>
                {selectedApp.internship_title} at {selectedApp.company_name}
              </div>
              <div style={{ fontSize: "13px", color: "var(--muted)", display: "flex", gap: "16px", marginTop: "4px" }}>
                <span>Domain: {selectedApp.domain || "General"}</span>
                <span>Stipend: {selectedApp.stipend ? `₹${Number(selectedApp.stipend).toLocaleString()}/mo` : "Disclosed"}</span>
                <span>Applied: {formatDate(selectedApp.applied_at)}</span>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "14px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--charcoal)", marginBottom: "6px" }}>
                Key Qualifications / Declared Skills
              </h4>
              <p style={{ fontSize: "13px", color: "var(--charcoal)", background: "var(--warm-white)", padding: "12px", borderRadius: "8px", margin: 0 }}>
                {selectedApp.qualifications || "No specific qualifications listed by student."}
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--charcoal)", marginBottom: "6px" }}>
                Cover Letter / Statement of Purpose
              </h4>
              <p style={{ fontSize: "13px", color: "var(--charcoal)", background: "var(--warm-white)", padding: "14px", borderRadius: "10px", lineHeight: 1.6, whiteSpace: "pre-wrap", margin: 0 }}>
                {selectedApp.cover_letter || "No statement or cover letter provided."}
              </p>
            </div>

            {selectedApp.resume && (
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--charcoal)", marginBottom: "6px" }}>
                  Candidate Resume
                </h4>
                <a
                  href={selectedApp.resume.startsWith("http") ? selectedApp.resume : `http://localhost:5000/${selectedApp.resume.replace(/^\//, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    background: "var(--cream)",
                    color: "var(--wine)",
                    fontSize: "13px",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  <FileText size={16} />
                  Open Candidate Resume in New Window
                  <ExternalLink size={14} />
                </a>
              </div>
            )}

            {/* Quick Action Footer in Modal */}
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px", borderTop: "1px solid var(--border)", paddingTop: "16px", flexWrap: "wrap" }}>
              <Button variant="outline" onClick={() => setSelectedApp(null)}>
                Close
              </Button>

              {(selectedApp.status || "").toLowerCase() === "pending" && (
                <>
                  <Button
                    variant="outline"
                    loading={updating}
                    disabled={updating}
                    style={{ color: "var(--red)", borderColor: "var(--red-bg)" }}
                    onClick={() => {
                      handleUpdateStatus(selectedApp.application_id, "rejected", selectedApp.student_name);
                      setSelectedApp(null);
                    }}
                  >
                    Reject Candidate
                  </Button>
                  <Button
                    variant="primary"
                    loading={updating}
                    disabled={updating}
                    onClick={() => {
                      handleUpdateStatus(selectedApp.application_id, "shortlisted", selectedApp.student_name);
                      setSelectedApp(null);
                    }}
                  >
                    Shortlist Candidate
                  </Button>
                </>
              )}

              {(selectedApp.status || "").toLowerCase() === "shortlisted" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const targetId = selectedApp.application_id;
                      setSelectedApp(null);
                      navigate("/faculty/schedule-interview", { state: { applicationId: targetId } });
                    }}
                    icon={Clock}
                  >
                    Schedule Interview
                  </Button>
                  <Button
                    variant="primary"
                    loading={updating}
                    disabled={updating}
                    onClick={() => {
                      handleUpdateStatus(selectedApp.application_id, "accepted", selectedApp.student_name);
                      setSelectedApp(null);
                    }}
                  >
                    Accept Offer
                  </Button>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
