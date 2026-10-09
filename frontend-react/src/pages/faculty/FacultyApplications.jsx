import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { LoadingState, ErrorState, EmptyState } from "../../components/common/FeedbackStates";
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
} from "lucide-react";

export function FacultyApplications() {
  const { faculty, user } = useAuth();
  const navigate = useNavigate();

  const facultyId = faculty?.faculty_id || user?.profile?.faculty_id;

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterStatus, setFilterStatus] = useState("all");

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

  const handleUpdateStatus = async (appId, newStatus) => {
    if (!facultyId) return;

    try {
      setUpdating(true);
      setActionSuccess("");

      const res = await api.updateApplicationStatus(appId, facultyId, newStatus);

      if (res.success || res.message) {
        setActionSuccess(`Application status updated to "${newStatus}"!`);
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
    if (filterStatus === "all") return true;
    return (app.status || "").toLowerCase() === filterStatus.toLowerCase();
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

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
        <div style={{ padding: "12px 16px", borderRadius: "10px", background: "var(--green-bg)", color: "var(--green)", fontSize: "13px", fontWeight: 600 }}>
          {actionSuccess}
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border)", paddingBottom: "12px", overflowX: "auto" }}>
        {["all", "pending", "shortlisted", "accepted", "rejected"].map((statusKey) => (
          <button
            key={statusKey}
            onClick={() => setFilterStatus(statusKey)}
            style={{
              padding: "8px 18px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              border: "none",
              background: filterStatus === statusKey ? "var(--wine)" : "transparent",
              color: filterStatus === statusKey ? "#FFFFFF" : "var(--muted)",
              transition: "all var(--transition-fast)",
              textTransform: "capitalize",
            }}
          >
            {statusKey}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <EmptyState
          title="No Applications Found"
          message={`No applications with status "${filterStatus}".`}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filteredApps.map((app) => (
            <div
              key={app.application_id}
              style={{
                background: "var(--warm-white)",
                borderRadius: "20px",
                padding: "24px",
                border: "1px solid var(--border)",
                borderLeft: "5px solid var(--wine)",
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
                    <span>• GPA: <strong>{app.student_gpa ? `${app.student_gpa}/4.0` : "N/A"}</strong></span>
                    <span>• Applied: {formatDate(app.applied_at)}</span>
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <Button size="sm" variant="outline" onClick={() => setSelectedApp(app)}>
                    View Full Application
                  </Button>

                  {app.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        variant="secondary"
                        loading={updating}
                        onClick={() => handleUpdateStatus(app.application_id, "shortlisted")}
                      >
                        Shortlist
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        loading={updating}
                        style={{ color: "var(--red)", borderColor: "var(--red-bg)" }}
                        onClick={() => handleUpdateStatus(app.application_id, "rejected")}
                      >
                        Reject
                      </Button>
                    </>
                  )}

                  {app.status === "shortlisted" && (
                    <>
                      <Button
                        size="sm"
                        variant="primary"
                        loading={updating}
                        onClick={() => handleUpdateStatus(app.application_id, "accepted")}
                      >
                        Accept Offer
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate("/faculty/schedule-interview")}
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
                <div>
                  <strong style={{ color: "var(--charcoal)" }}>{app.internship_title}</strong>
                  <span style={{ color: "var(--muted)", marginLeft: "8px" }}>({app.company_name})</span>
                </div>

                <div style={{ display: "flex", gap: "16px", color: "var(--muted)" }}>
                  <span>Domain: {app.domain || "N/A"}</span>
                  <span>Duration: {app.duration_weeks ? `${app.duration_weeks} wks` : "N/A"}</span>
                  <span>Stipend: {app.stipend ? `₹${app.stipend}/mo` : "Disclosed"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Application Detail Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Application: ${selectedApp.student_name}`}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", margin: 0 }}>
                  {selectedApp.student_name}
                </h3>
                <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                  {selectedApp.student_department} • GPA {selectedApp.student_gpa ? `${selectedApp.student_gpa}/4.0` : "N/A"} • {selectedApp.student_phone || "Phone N/A"}
                </span>
              </div>
              <StatusBadge status={selectedApp.status} />
            </div>

            <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "16px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--charcoal)", marginBottom: "6px" }}>
                Qualifications / Skills
              </h4>
              <p style={{ fontSize: "13px", color: "var(--charcoal)", background: "var(--warm-white)", padding: "12px", borderRadius: "8px" }}>
                {selectedApp.qualifications || "None specified."}
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--charcoal)", marginBottom: "6px" }}>
                Cover Letter
              </h4>
              <p style={{ fontSize: "13px", color: "var(--charcoal)", background: "var(--warm-white)", padding: "14px", borderRadius: "10px", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {selectedApp.cover_letter || "No cover letter provided."}
              </p>
            </div>

            {selectedApp.resume && (
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--charcoal)", marginBottom: "6px" }}>
                  Attached Resume File
                </h4>
                <a
                  href={`http://localhost:5000${selectedApp.resume}`}
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
                  View Resume Document (PDF)
                  <ExternalLink size={14} />
                </a>
              </div>
            )}

            {/* Quick Action Footer in Modal */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
              <Button variant="outline" onClick={() => setSelectedApp(null)}>
                Close
              </Button>
              {selectedApp.status === "pending" && (
                <Button
                  variant="primary"
                  onClick={() => {
                    handleUpdateStatus(selectedApp.application_id, "shortlisted");
                    setSelectedApp(null);
                  }}
                >
                  Shortlist Student
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
