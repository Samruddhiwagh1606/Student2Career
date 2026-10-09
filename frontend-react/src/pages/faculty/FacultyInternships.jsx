import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { Button } from "../../components/common/Button";
import { SearchBar } from "../../components/common/SearchBar";
import { StatusBadge } from "../../components/common/StatusBadge";
import { LoadingState, ErrorState, EmptyState } from "../../components/common/FeedbackStates";
import {
  Briefcase,
  Building2,
  Calendar,
  Clock,
  PlusCircle,
  Users,
  MapPin,
} from "lucide-react";

export function FacultyInternships() {
  const { faculty, user } = useAuth();
  const navigate = useNavigate();

  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const facultyId = faculty?.faculty_id || user?.profile?.faculty_id;

  const fetchFacultyInternships = async () => {
    if (!facultyId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await api.getFacultyDetails(facultyId);
      const list = res?.internships || [];
      setInternships(list);
    } catch (err) {
      console.error("Fetch faculty internships error:", err);
      setError("Unable to load internships posted by your account.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacultyInternships();
  }, [facultyId]);

  const filteredInternships = internships.filter((i) =>
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
    return <LoadingState message="Loading your posted internships..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchFacultyInternships} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="animate-fade-in">
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
            My Internships
          </h1>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px" }}>
            Placement opportunities verified and submitted by your faculty account.
          </p>
        </div>

        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={() => navigate("/faculty/post-internship")}
        >
          Post New Internship
        </Button>
      </div>

      {/* Search Bar */}
      <div
        style={{
          background: "var(--warm-white)",
          borderRadius: "16px",
          padding: "16px 20px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-xs)",
        }}
      >
        <SearchBar
          placeholder="Filter by title, company, or domain..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* List */}
      {filteredInternships.length === 0 ? (
        <EmptyState
          title="No Internships Found"
          message={
            searchTerm
              ? "No internship postings match your search query."
              : "You haven't posted or verified any internships yet."
          }
          actionText="Post First Internship"
          onAction={() => navigate("/faculty/post-internship")}
        />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
          {filteredInternships.map((item) => (
            <div
              key={item.internship_id}
              style={{
                background: "var(--warm-white)",
                borderRadius: "20px",
                padding: "24px",
                border: "1px solid var(--border)",
                borderLeft: "5px solid var(--wine)",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "20px",
              }}
              className="card-hover"
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
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

                <p style={{ fontSize: "14px", color: "var(--muted)", display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
                  <Building2 size={15} />
                  {item.company_name}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "12px", color: "var(--charcoal)", background: "var(--warm-white)", padding: "4px 10px", borderRadius: "8px", border: "1px solid var(--border-light)" }}>
                    <strong>Domain:</strong> {item.domain || "General"}
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--charcoal)", background: "var(--warm-white)", padding: "4px 10px", borderRadius: "8px", border: "1px solid var(--border-light)" }}>
                    <strong>Duration:</strong> {item.duration_weeks ? `${item.duration_weeks} Weeks` : "N/A"}
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--wine)", background: "var(--cream)", padding: "4px 10px", borderRadius: "8px", fontWeight: 600 }}>
                    {item.stipend ? `₹${item.stipend}/mo` : "Stipend Disclosed"}
                  </span>
                </div>
              </div>

              <div
                style={{
                  paddingTop: "16px",
                  borderTop: "1px solid var(--border-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  color: "var(--muted)",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Calendar size={14} />
                  Deadline: {formatDate(item.application_deadline)}
                </span>

                <span style={{ display: "flex", alignItems: "center", gap: "4px", fontWeight: 700, color: "var(--charcoal)" }}>
                  <Users size={14} style={{ color: "var(--wine)" }} />
                  {item.application_count || 0} Applications
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
