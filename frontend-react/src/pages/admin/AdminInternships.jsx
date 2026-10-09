import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Button } from "../../components/common/Button";
import { StatusBadge } from "../../components/common/StatusBadge";
import { SearchBar } from "../../components/common/SearchBar";
import { LoadingState, ErrorState, EmptyState } from "../../components/common/FeedbackStates";
import {
  Briefcase,
  CheckCircle2,
  XCircle,
  Building2,
  Calendar,
  Clock,
  User,
  ShieldCheck,
} from "lucide-react";

export function AdminInternships() {
  const [reviewList, setReviewList] = useState([]);
  const [approvedList, setApprovedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pending"); // "pending" | "approved"
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [actionSuccess, setActionSuccess] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const reviewRes = await api.getInternshipsAdminReview().catch(() => []);
      setReviewList(Array.isArray(reviewRes) ? reviewRes : []);

      const approvedRes = await api.getInternships().catch(() => []);
      const allAppr = approvedRes?.internships || approvedRes || [];
      setApprovedList(Array.isArray(allAppr) ? allAppr : []);
    } catch (err) {
      console.error("Admin internships fetch error:", err);
      setError("Unable to load internship postings for admin review.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (internshipId, status) => {
    try {
      setUpdatingId(internshipId);
      setActionSuccess("");
      const res = await api.updateInternshipStatus(internshipId, status);

      if (res.success || res.message) {
        setActionSuccess(`Internship status updated to "${status}" successfully!`);
        loadData();
      } else {
        alert(res.message || "Failed to update internship status.");
      }
    } catch (err) {
      alert(err.message || "Unable to update internship status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const currentList = activeTab === "pending" ? reviewList : approvedList;

  const filteredList = currentList.filter(
    (i) =>
      (i.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.company_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.domain || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  if (loading) {
    return <LoadingState message="Fetching internship postings for institutional review..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
          Internship Institutional Review
        </h1>
        <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px" }}>
          Approve faculty-verified internship postings to publish them live for student applications.
        </p>
      </div>

      {actionSuccess && (
        <div style={{ padding: "12px 16px", borderRadius: "10px", background: "var(--green-bg)", color: "var(--green)", fontSize: "13px", fontWeight: 600 }}>
          {actionSuccess}
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
          <button
            onClick={() => setActiveTab("pending")}
            style={{
              padding: "8px 18px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              border: "none",
              background: activeTab === "pending" ? "var(--wine)" : "transparent",
              color: activeTab === "pending" ? "#FFFFFF" : "var(--muted)",
              transition: "all var(--transition-fast)",
            }}
          >
            Awaiting Approval ({reviewList.length})
          </button>

          <button
            onClick={() => setActiveTab("approved")}
            style={{
              padding: "8px 18px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              border: "none",
              background: activeTab === "approved" ? "var(--wine)" : "transparent",
              color: activeTab === "approved" ? "#FFFFFF" : "var(--muted)",
              transition: "all var(--transition-fast)",
            }}
          >
            Approved Postings ({approvedList.length})
          </button>
        </div>

        <div style={{ minWidth: "260px" }}>
          <SearchBar
            placeholder="Search by title, company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Internships Grid */}
      {filteredList.length === 0 ? (
        <EmptyState
          title="No Internships in This Category"
          message={
            activeTab === "pending"
              ? "No faculty-verified internship postings are currently awaiting institutional approval."
              : "No approved internship postings available."
          }
        />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
          {filteredList.map((item) => (
            <div
              key={item.internship_id}
              style={{
                background: "#FFFFFF",
                borderRadius: "20px",
                padding: "24px",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "20px",
              }}
              className="card-hover"
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "12px",
                      background: "var(--wine)",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "16px",
                    }}
                  >
                    {item.company_name ? item.company_name.charAt(0).toUpperCase() : "C"}
                  </div>

                  <StatusBadge status={item.status} />
                </div>

                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", marginBottom: "4px" }}>
                  {item.title}
                </h3>

                <p style={{ fontSize: "14px", color: "var(--muted)", display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
                  <Building2 size={15} />
                  {item.company_name}
                </p>

                <div style={{ fontSize: "12px", color: "var(--charcoal)", display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
                  <div><strong>Domain:</strong> {item.domain || "General"}</div>
                  <div><strong>Duration:</strong> {item.duration_weeks ? `${item.duration_weeks} Weeks` : "N/A"}</div>
                  <div><strong>Stipend:</strong> {item.stipend ? `₹${item.stipend}/mo` : "Disclosed"}</div>
                  {item.faculty_name && (
                    <div style={{ color: "var(--wine)", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                      <ShieldCheck size={14} /> Verified by Prof. {item.faculty_name}
                    </div>
                  )}
                </div>

                <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {item.description || "No description provided."}
                </p>
              </div>

              {item.status === "faculty_verified" && (
                <div
                  style={{
                    paddingTop: "16px",
                    borderTop: "1px solid var(--border-light)",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Button
                    size="sm"
                    variant="primary"
                    icon={CheckCircle2}
                    loading={updatingId === item.internship_id}
                    onClick={() => handleUpdateStatus(item.internship_id, "approved")}
                    style={{ flex: 1 }}
                  >
                    Approve Posting
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    icon={XCircle}
                    loading={updatingId === item.internship_id}
                    style={{ color: "var(--red)", borderColor: "var(--red-bg)" }}
                    onClick={() => handleUpdateStatus(item.internship_id, "rejected")}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
