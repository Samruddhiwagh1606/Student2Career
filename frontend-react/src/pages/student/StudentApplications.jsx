import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Button } from "../../components/common/Button";
import { LoadingState, ErrorState, EmptyState } from "../../components/common/FeedbackStates";
import { Building2, Calendar, FileText, AlertCircle, Trash2 } from "lucide-react";

export function StudentApplications() {
  const { student } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
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
          Track application progress and review recruiter responses.
        </p>
      </div>

      {actionMessage && (
        <div style={{ padding: "12px 16px", borderRadius: "10px", background: "var(--green-bg)", color: "var(--green)", fontSize: "13px", fontWeight: 500 }}>
          {actionMessage}
        </div>
      )}

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
            }}
          >
            {statusKey}
          </button>
        ))}
      </div>

      {/* List */}
      {filteredApps.length === 0 ? (
        <EmptyState
          title="No Applications Found"
          message={`You have no applications with status "${filterStatus}".`}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filteredApps.map((app) => (
            <div
              key={app.application_id}
              style={{
                background: "#FFFFFF",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid var(--border)",
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
                    <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", margin: 0 }}>
                      {app.title}
                    </h3>
                    <StatusBadge status={app.status} />
                  </div>

                  <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Building2 size={15} />
                    {app.company_name} • Applied on {formatDate(app.applied_at)}
                  </p>
                </div>

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
          ))}
        </div>
      )}
    </div>
  );
}
