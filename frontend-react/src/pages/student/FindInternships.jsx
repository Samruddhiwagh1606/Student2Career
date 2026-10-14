import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { SearchBar } from "../../components/common/SearchBar";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { LoadingState, ErrorState, EmptyState } from "../../components/common/FeedbackStates";
import { SkillMatchCard } from "../../components/student/SkillMatchCard";
import { SkillGap } from "../../components/student/SkillGap";
import { ApplicationFitSection } from "../../components/student/ApplicationFitSection";
import {
  Building2,
  MapPin,
  Clock,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Check,
  AlertTriangle,
  Calendar,
  Sparkles,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  Info,
} from "lucide-react";

export function FindInternships() {
  const { student } = useAuth();
  const navigate = useNavigate();

  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all"); // "all" | "campus" | "external"

  // External Application confirmation state
  const [externalLinkOpened, setExternalLinkOpened] = useState(false);
  const [confirmationResponse, setConfirmationResponse] = useState(null); // null | "yes" | "no"

  // Application Modal state
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [modalSkillMatch, setModalSkillMatch] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Existing applied internship IDs and application details map
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [appliedMap, setAppliedMap] = useState(new Map());

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        let list = [];
        if (student?.student_id) {
          // Fetch real skill match recommendations
          const recRes = await api.getRecommendedInternships(student.student_id).catch(() => null);
          if (recRes?.recommendations) {
            list = recRes.recommendations;
          } else {
            const res = await api.getInternships();
            list = res?.internships || res || [];
          }
        } else {
          const res = await api.getInternships();
          list = res?.internships || res || [];
        }

        setInternships(Array.isArray(list) ? list : []);

        if (student?.student_id) {
          const appRes = await api.getStudentApplications(student.student_id).catch(() => ({ applications: [] }));
          const apps = appRes.applications || [];
          const ids = new Set(apps.map((a) => a.internship_id));
          setAppliedIds(ids);

          const appMap = new Map();
          apps.forEach((a) => appMap.set(a.internship_id, a));
          setAppliedMap(appMap);
        }
      } catch (err) {
        console.error("Failed to load internships:", err);
        setError("Unable to load internship opportunities. Please ensure backend is running.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [student?.student_id]);

  const handleOpenApplyModal = async (internship) => {
    setSelectedInternship(internship);
    setModalSkillMatch(internship.skill_match || null);
    setCoverLetter("");
    setQualifications("");
    setResumeFile(null);
    setSubmitSuccess(false);
    setSubmitError("");
    setExternalLinkOpened(false);
    setConfirmationResponse(null);
    setApplyModalOpen(true);

    if (student?.student_id && internship.internship_id) {
      try {
        const smRes = await api.getSkillMatch(internship.internship_id, student.student_id);
        if (smRes?.success) {
          setModalSkillMatch(smRes);
        }
      } catch (e) {
        console.error("Failed to load detailed skill match:", e);
      }
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!selectedInternship || !student?.student_id) return;

    if (appliedIds.has(selectedInternship.internship_id)) {
      setSubmitError("You have already submitted an application for this position.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const formData = new FormData();
      formData.append("student_id", student.student_id);
      formData.append("internship_id", selectedInternship.internship_id);
      formData.append("cover_letter", coverLetter);
      formData.append("qualifications", qualifications);

      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      const res = await api.applyInternship(formData);

      if (res.success || res.message) {
        setSubmitSuccess(true);
        setAppliedIds((prev) => new Set([...prev, selectedInternship.internship_id]));
        setAppliedMap((prev) => {
          const updated = new Map(prev);
          updated.set(selectedInternship.internship_id, {
            application_id: res.application_id || Date.now(),
            internship_id: selectedInternship.internship_id,
            status: "pending",
            applied_at: new Date().toISOString(),
          });
          return updated;
        });
      } else {
        throw new Error(res.message || "Failed to submit application.");
      }
    } catch (err) {
      console.error("Apply error:", err);
      setSubmitError(err.message || "Unable to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  const isValidHttpUrl = (url) => {
    if (!url || typeof url !== "string") return false;
    try {
      const parsed = new URL(url.trim());
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  const isExternalOpportunity = (item) => {
    if (!item) return false;
    const url = item.apply_url || item.external_url;
    const hasValidUrl = isValidHttpUrl(url);
    const markedExternal = Boolean(
      item.is_external ||
      item.opportunity_type === "external" ||
      item.type === "external"
    );
    return Boolean(hasValidUrl && (markedExternal || url));
  };

  const campusCount = internships.filter((i) => !isExternalOpportunity(i)).length;
  const externalCount = internships.filter((i) => isExternalOpportunity(i)).length;

  // Filtered internships logic
  const filteredInternships = internships.filter((item) => {
    const isExt = isExternalOpportunity(item);
    if (typeFilter === "campus" && isExt) return false;
    if (typeFilter === "external" && !isExt) return false;

    const matchesSearch =
      (item.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.company_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.location || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept =
      departmentFilter === "all" ||
      (item.domain || item.department || "").toLowerCase() === departmentFilter.toLowerCase();

    return matchesSearch && matchesDept;
  });

  const isDeadlinePassed = (item) => {
    const d = item.application_deadline || item.deadline;
    if (!d) return false;
    const deadlineDate = new Date(d);
    if (isNaN(deadlineDate.getTime())) return false;
    deadlineDate.setHours(23, 59, 59, 999);
    return deadlineDate < new Date();
  };

  const formatDeadline = (item) => {
    const d = item.application_deadline || item.deadline;
    if (!d) return null;
    const deadlineDate = new Date(d);
    if (isNaN(deadlineDate.getTime())) return String(d).slice(0, 10);
    return deadlineDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const departments = Array.from(
    new Set(internships.map((i) => i.domain || i.department).filter(Boolean))
  );

  if (loading) {
    return <LoadingState message="Fetching approved internship opportunities..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }} className="animate-fade-in">
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
            Find Internships
          </h1>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px" }}>
            Browse and apply to verified placement opportunities approved by your college with real skill matching.
          </p>
        </div>
      </div>

      {/* Opportunity Type Filter Tabs */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {[
          { id: "all", label: "All Opportunities", count: internships.length },
          { id: "campus", label: "Campus Drives", count: campusCount },
          { id: "external", label: "External Listings", count: externalCount },
        ].map((tab) => {
          const isActive = typeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTypeFilter(tab.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 18px",
                borderRadius: "30px",
                fontSize: "13px",
                fontWeight: isActive ? 700 : 500,
                cursor: "pointer",
                border: isActive ? "1px solid var(--wine)" : "1px solid var(--border)",
                background: isActive ? "var(--wine)" : "#FFFFFF",
                color: isActive ? "#FFFFFF" : "var(--charcoal)",
                transition: "all var(--transition-fast)",
                boxShadow: isActive ? "0 2px 8px rgba(122, 31, 61, 0.2)" : "var(--shadow-xs)",
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "2px 7px",
                  borderRadius: "10px",
                  background: isActive ? "rgba(255, 255, 255, 0.25)" : "var(--cream)",
                  color: isActive ? "#FFFFFF" : "var(--wine)",
                  border: isActive ? "none" : "1px solid rgba(122, 31, 61, 0.15)",
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          padding: "20px",
          border: "1px solid var(--border)",
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          alignItems: "center",
          boxShadow: "var(--shadow-xs)",
        }}
      >
        <div style={{ flex: "1 1 300px" }}>
          <SearchBar
            placeholder="Search by title, company, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          style={{
            padding: "11px 16px",
            fontSize: "14px",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            background: "var(--warm-white)",
            color: "var(--charcoal)",
            outline: "none",
            minWidth: "180px",
            cursor: "pointer",
          }}
        >
          <option value="all">All Domains & Departments</option>
          {departments.map((dept, idx) => (
            <option key={idx} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Internship Cards Grid */}
      {filteredInternships.length === 0 ? (
        typeFilter === "external" ? (
          <EmptyState
            title="No External Internship Listings Found"
            message={
              externalCount === 0
                ? "Currently, all active opportunities in College2Career are verified on-campus recruiting drives hosted through the institutional placement cell. When off-campus corporate partner postings are registered by coordinators, they will appear here with direct application links."
                : "No external listings match your active search and domain filters."
            }
            actionText="View Campus Drives"
            onAction={() => {
              setTypeFilter("campus");
              setSearchTerm("");
              setDepartmentFilter("all");
            }}
          />
        ) : (
          <EmptyState
            title="No Internships Found"
            message="No matching internship listings match your search filters."
            actionText="Reset Filters"
            onAction={() => {
              setSearchTerm("");
              setDepartmentFilter("all");
              setTypeFilter("all");
            }}
          />
        )
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {filteredInternships.map((item) => {
            const isExt = isExternalOpportunity(item);
            const isApplied = appliedIds.has(item.internship_id);
            const isPassed = isDeadlinePassed(item);
            const deadlineText = formatDeadline(item);
            const sm = item.skill_match || {};
            const available = sm.available;
            const matchPct = sm.match_percentage;

            return (
              <div
                key={item.internship_id}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "20px",
                  padding: "24px",
                  border: isPassed ? "1px solid rgba(220, 38, 38, 0.25)" : "1px solid var(--border)",
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "20px",
                  opacity: isPassed ? 0.92 : 1,
                }}
                className="card-hover"
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "12px",
                          background: isExt ? "var(--terracotta)" : "var(--wine)",
                          color: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: "16px",
                          flexShrink: 0,
                        }}
                      >
                        {item.company_name ? item.company_name.charAt(0).toUpperCase() : "C"}
                      </div>
                      <div>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "var(--muted)",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Listing #{item.internship_id}
                        </span>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--charcoal)", display: "flex", alignItems: "center", gap: "6px" }}>
                          <Building2 size={14} style={{ color: isExt ? "var(--terracotta)" : "var(--wine)" }} />
                          {item.company_name}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
                      {isExt ? (
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "var(--terracotta)",
                            background: "var(--terracotta-subtle)",
                            padding: "4px 10px",
                            borderRadius: "20px",
                            border: "1px solid rgba(231, 111, 81, 0.25)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <ExternalLink size={12} /> EXTERNAL
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "var(--wine)",
                            background: "var(--cream)",
                            padding: "4px 10px",
                            borderRadius: "20px",
                            border: "1px solid rgba(122, 31, 61, 0.25)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <ShieldCheck size={12} /> CAMPUS DRIVE
                        </span>
                      )}

                      {isApplied && (
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "var(--wine)",
                            background: "var(--cream)",
                            padding: "4px 10px",
                            borderRadius: "20px",
                            border: "1px solid rgba(122, 31, 61, 0.25)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <CheckCircle2 size={12} /> Applied: {(appliedMap.get(item.internship_id)?.status || "Pending").toUpperCase()}
                        </span>
                      )}

                      {isPassed && (
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "var(--red)",
                            background: "var(--red-bg)",
                            padding: "4px 10px",
                            borderRadius: "20px",
                            border: "1px solid rgba(220, 38, 38, 0.25)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <AlertTriangle size={12} /> Deadline Passed
                        </span>
                      )}

                      {available && matchPct !== null ? (
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 800,
                            color: matchPct >= 75 ? "var(--wine)" : "var(--terracotta)",
                            background: matchPct >= 75 ? "var(--cream)" : "var(--terracotta-subtle)",
                            padding: "4px 12px",
                            borderRadius: "20px",
                            border: matchPct >= 75 ? "1px solid rgba(122, 31, 61, 0.2)" : "1px solid rgba(231, 111, 81, 0.2)",
                          }}
                        >
                          {matchPct}% Match
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            color: "var(--muted)",
                            background: "var(--warm-white)",
                            padding: "4px 10px",
                            borderRadius: "20px",
                            border: "1px solid var(--border)",
                          }}
                        >
                          Skill match unavailable
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", marginBottom: "4px" }}>
                    {item.title}
                  </h3>

                  <div style={{ fontSize: "14px", color: "var(--muted)", display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
                    <Building2 size={15} />
                    {item.company_name}
                  </div>

                  <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.5, marginBottom: "16px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {item.description || "No description provided."}
                  </p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                    {item.domain && (
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--charcoal)", background: "var(--warm-white)", padding: "4px 10px", borderRadius: "8px", border: "1px solid var(--border-light)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <Briefcase size={13} style={{ color: "var(--wine)" }} />
                        {item.domain}
                      </span>
                    )}
                    {item.domain && student?.department && (
                      <span
                        style={{
                          fontSize: "11.5px",
                          fontWeight: 700,
                          color: item.domain.toLowerCase().includes(student.department.toLowerCase()) ? "var(--green)" : "var(--muted)",
                          background: item.domain.toLowerCase().includes(student.department.toLowerCase()) ? "var(--green-bg)" : "var(--warm-white)",
                          padding: "4px 10px",
                          borderRadius: "8px",
                          border: "1px solid var(--border-light)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {item.domain.toLowerCase().includes(student.department.toLowerCase()) ? "✓ Matches Major" : `Open to ${item.domain}`}
                      </span>
                    )}
                    <span style={{ fontSize: "12px", color: "var(--charcoal)", background: "var(--warm-white)", padding: "4px 10px", borderRadius: "8px", border: "1px solid var(--border-light)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <MapPin size={13} style={{ color: "var(--terracotta)" }} />
                      {item.location || "Remote / On-site"}
                    </span>
                    <span style={{ fontSize: "12px", color: "var(--charcoal)", background: "var(--warm-white)", padding: "4px 10px", borderRadius: "8px", border: "1px solid var(--border-light)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={13} style={{ color: "var(--muted)" }} />
                      {item.duration_weeks ? `${item.duration_weeks} Weeks` : item.duration || "3 Months"}
                    </span>
                    {deadlineText && !isPassed && (
                      <span style={{ fontSize: "12px", color: "var(--charcoal)", background: "var(--warm-white)", padding: "4px 10px", borderRadius: "8px", border: "1px solid var(--border-light)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <Clock size={13} style={{ color: "var(--terracotta)" }} />
                        Closes: {deadlineText}
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: "11.5px",
                        color: "var(--charcoal)",
                        background: "var(--warm-white)",
                        padding: "4px 10px",
                        borderRadius: "8px",
                        border: "1px solid var(--border-light)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <strong>Eligibility:</strong> {item.eligibility || `Open to all eligible in ${item.domain || "department"}`}
                    </span>
                  </div>

                  {/* Skills pill preview if available */}
                  {sm.matching_skills?.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", paddingTop: "10px", borderTop: "1px solid var(--border-light)" }}>
                      {sm.matching_skills.slice(0, 3).map((sk, idx) => (
                        <span key={idx} style={{ fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "6px", background: "var(--green-bg)", color: "var(--green)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <Check size={11} /> {sk}
                        </span>
                      ))}
                      {sm.missing_skills?.length > 0 && (
                        <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "6px", background: "var(--terracotta-subtle)", color: "var(--terracotta)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <AlertTriangle size={11} /> {sm.missing_skills[0]}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    paddingTop: "16px",
                    borderTop: "1px solid var(--border-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  <div>
                    <span style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>
                      Monthly Stipend
                    </span>
                    <span style={{ fontSize: "16px", fontWeight: 800, color: "var(--wine)" }}>
                      {item.stipend ? `₹${Number(item.stipend).toLocaleString()}/mo` : "Stipend Disclosed"}
                    </span>
                  </div>

                  {isApplied ? (
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <Link to="/student/applications" style={{ textDecoration: "none" }}>
                        <Button size="sm" variant="secondary" icon={CheckCircle2}>
                          Track Status
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" onClick={() => handleOpenApplyModal(item)}>
                        Details
                      </Button>
                    </div>
                  ) : isPassed ? (
                    <Button size="sm" variant="outline" disabled style={{ opacity: 0.65, cursor: "not-allowed", color: "var(--red)", borderColor: "var(--red-bg)" }}>
                      Deadline Passed
                    </Button>
                  ) : isExt ? (
                    <Button
                      size="sm"
                      variant="primary"
                      icon={ExternalLink}
                      onClick={() => handleOpenApplyModal(item)}
                    >
                      Apply Externally
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleOpenApplyModal(item)}
                    >
                      View & Apply
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Apply & Details Modal */}
      {selectedInternship && (
        <Modal
          isOpen={applyModalOpen}
          onClose={() => setApplyModalOpen(false)}
          title={`Internship Opportunity: ${selectedInternship.title}`}
        >
          {submitSuccess ? (
            <div style={{ padding: "20px 8px", textAlign: "center" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "var(--cream)",
                  border: "2px solid var(--wine)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px auto",
                  color: "var(--wine)",
                }}
              >
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--charcoal)", marginBottom: "8px" }}>
                Application Submitted Successfully!
              </h3>
              <p style={{ fontSize: "14px", color: "var(--muted)", maxWidth: "480px", margin: "0 auto 20px auto", lineHeight: 1.5 }}>
                Your candidacy for <strong>{selectedInternship.title}</strong> at <strong>{selectedInternship.company_name}</strong> has been received and routed for mentor & recruiter review.
              </p>

              <div
                style={{
                  background: "var(--warm-white)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  maxWidth: "480px",
                  margin: "0 auto 24px auto",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ color: "var(--muted)" }}>Target Role:</span>
                  <span style={{ fontWeight: 600, color: "var(--charcoal)" }}>{selectedInternship.title}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ color: "var(--muted)" }}>Organization:</span>
                  <span style={{ fontWeight: 600, color: "var(--charcoal)" }}>{selectedInternship.company_name}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ color: "var(--muted)" }}>Stipend:</span>
                  <span style={{ fontWeight: 700, color: "var(--wine)" }}>
                    {selectedInternship.stipend ? `₹${Number(selectedInternship.stipend).toLocaleString()}/mo` : "Disclosed on Selection"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ color: "var(--muted)" }}>Status:</span>
                  <span style={{ fontWeight: 700, color: "var(--terracotta)", textTransform: "uppercase" }}>
                    Pending Review
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                <Button
                  variant="outline"
                  onClick={() => setApplyModalOpen(false)}
                >
                  Browse More Internships
                </Button>
                <Button
                  variant="primary"
                  icon={ArrowRight}
                  onClick={() => {
                    setApplyModalOpen(false);
                    navigate("/student/applications");
                  }}
                >
                  Track in My Applications
                </Button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* 1. REAL SMART SKILL MATCH CARD */}
              <SkillMatchCard skillMatch={modalSkillMatch} />

              {/* 2. REAL SKILL GAP CARD */}
              {modalSkillMatch?.missing_skills && (
                <SkillGap missingSkills={modalSkillMatch.missing_skills} />
              )}

              {/* 3. YOUR APPLICATION FIT CHECKLIST */}
              {modalSkillMatch?.application_fit && (
                <ApplicationFitSection
                  fitData={modalSkillMatch.application_fit}
                  skillMatch={modalSkillMatch}
                />
              )}

              {/* 4. EXTERNAL OPPORTUNITY, ALREADY APPLIED NOTICE OR APPLICATION FORM */}
              {isExternalOpportunity(selectedInternship) ? (
                <div
                  style={{
                    background: "var(--cream)",
                    border: "1px solid rgba(122, 31, 61, 0.2)",
                    borderRadius: "14px",
                    padding: "22px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          background: "var(--terracotta)",
                          color: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ExternalLink size={20} />
                      </div>
                      <div>
                        <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--wine)" }}>
                          External Employer Application
                        </span>
                        <span style={{ fontSize: "12px", color: "var(--muted)", display: "block" }}>
                          Listing #{selectedInternship.internship_id} • {selectedInternship.company_name}
                        </span>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "var(--terracotta)",
                        background: "var(--terracotta-subtle)",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        border: "1px solid rgba(231, 111, 81, 0.25)",
                      }}
                    >
                      OFF-CAMPUS POSTING
                    </span>
                  </div>

                  <p style={{ fontSize: "13.5px", color: "var(--charcoal)", lineHeight: 1.5, margin: 0 }}>
                    This opportunity is hosted directly on <strong>{selectedInternship.company_name}</strong>'s official recruitment portal. Applications are processed outside of the College2Career internal submission database.
                  </p>

                  {/* Step 1: Open Employer Link */}
                  <div
                    style={{
                      padding: "14px 16px",
                      borderRadius: "10px",
                      background: "#FFFFFF",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--charcoal)" }}>
                        Step 1: Complete Application on Employer Portal
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>
                        Opens the employer's official job description and submission form in a new tab.
                      </div>
                    </div>

                    <a
                      href={(selectedInternship.apply_url || selectedInternship.external_url || "").trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                      onClick={() => setExternalLinkOpened(true)}
                    >
                      <Button variant="primary" size="sm" icon={ExternalLink}>
                        Open Employer Career Page
                      </Button>
                    </a>
                  </div>

                  {/* Step 2: Student Confirmation Question */}
                  <div
                    style={{
                      padding: "16px",
                      borderRadius: "10px",
                      background: "#FFFFFF",
                      border: "1px solid var(--border)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--charcoal)", display: "flex", alignItems: "center", gap: "6px" }}>
                        <HelpCircle size={15} style={{ color: "var(--wine)" }} />
                        Step 2: Student Application Status Confirmation
                      </div>
                      <p style={{ fontSize: "13px", color: "var(--charcoal)", margin: "6px 0 0", lineHeight: 1.4 }}>
                        Did you submit your application on the employer's website?
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <button
                        type="button"
                        onClick={() => setConfirmationResponse("yes")}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "12.5px",
                          fontWeight: 700,
                          cursor: "pointer",
                          border: confirmationResponse === "yes" ? "2px solid var(--green)" : "1px solid var(--border)",
                          background: confirmationResponse === "yes" ? "var(--green-bg)" : "var(--warm-white)",
                          color: confirmationResponse === "yes" ? "var(--green)" : "var(--charcoal)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          transition: "all var(--transition-fast)",
                        }}
                      >
                        <CheckCircle2 size={15} />
                        YES, I APPLIED
                      </button>

                      <button
                        type="button"
                        onClick={() => setConfirmationResponse("no")}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "12.5px",
                          fontWeight: 700,
                          cursor: "pointer",
                          border: confirmationResponse === "no" ? "2px solid var(--terracotta)" : "1px solid var(--border)",
                          background: confirmationResponse === "no" ? "var(--terracotta-subtle)" : "var(--warm-white)",
                          color: confirmationResponse === "no" ? "var(--terracotta)" : "var(--charcoal)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          transition: "all var(--transition-fast)",
                        }}
                      >
                        NO, NOT YET
                      </button>
                    </div>

                    {/* Confirmation Response Outcomes */}
                    {confirmationResponse === "yes" && (
                      <div
                        style={{
                          padding: "12px 14px",
                          borderRadius: "8px",
                          background: "var(--green-bg)",
                          color: "var(--green)",
                          fontSize: "12.5px",
                          lineHeight: 1.5,
                          border: "1px solid rgba(64, 112, 80, 0.25)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                          <CheckCircle2 size={15} />
                          Response Recorded (Student-Reported)
                        </div>
                        <div>
                          Thank you for confirming your external submission. Please note: This acknowledgement is student-reported for your current session. College2Career does not automatically synchronize status updates with external corporate ATS systems without institutional faculty verification.
                        </div>
                      </div>
                    )}

                    {confirmationResponse === "no" && (
                      <div
                        style={{
                          padding: "12px 14px",
                          borderRadius: "8px",
                          background: "var(--warm-white)",
                          color: "var(--muted)",
                          fontSize: "12.5px",
                          lineHeight: 1.5,
                          border: "1px solid var(--border-light)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        <div style={{ fontWeight: 600, color: "var(--charcoal)" }}>
                          Application Pending
                        </div>
                        <div>
                          No problem! You can return to this listing anytime before the application deadline to access the employer portal and submit your materials.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Institutional Disclosure Box */}
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: "8px",
                      background: "var(--warm-white)",
                      border: "1px solid var(--border-light)",
                      fontSize: "12px",
                      color: "var(--muted)",
                      lineHeight: 1.5,
                    }}
                  >
                    <strong>Institutional Disclosure:</strong> External applications are submitted directly to the third-party employer. College2Career does not create a fake internal database application record for external jobs. Off-campus internship offers can be brought to your Faculty Coordinator for academic credit approval.
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "4px" }}>
                    <Button variant="outline" size="sm" onClick={() => setApplyModalOpen(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              ) : appliedIds.has(selectedInternship.internship_id) ? (
                <div
                  style={{
                    background: "var(--cream)",
                    border: "1px solid rgba(122, 31, 61, 0.2)",
                    borderRadius: "12px",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <CheckCircle2 size={20} style={{ color: "var(--wine)" }} />
                      <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--wine)" }}>
                        Application Already Submitted
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        background: "var(--wine)",
                        color: "#fff",
                      }}
                    >
                      {appliedMap.get(selectedInternship.internship_id)?.status || "PENDING"}
                    </span>
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--charcoal)", lineHeight: 1.5, margin: 0 }}>
                    You have already applied for this position. Your application is recorded in the placement portal and is being tracked by faculty coordinators.
                  </p>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "4px" }}>
                    <Button variant="outline" size="sm" onClick={() => setApplyModalOpen(false)}>
                      Close
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={ArrowRight}
                      onClick={() => {
                        setApplyModalOpen(false);
                        navigate("/student/applications");
                      }}
                    >
                      View in My Applications
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {isDeadlinePassed(selectedInternship) && (
                    <div style={{ padding: "12px 16px", borderRadius: "10px", background: "var(--red-bg)", color: "var(--red)", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", border: "1px solid rgba(220, 38, 38, 0.25)" }}>
                      <AlertTriangle size={16} />
                      <span>Applications are closed for this opportunity as the deadline ({formatDeadline(selectedInternship)}) has passed.</span>
                    </div>
                  )}

                  {submitError && (
                    <div style={{ padding: "12px", borderRadius: "8px", background: "var(--red-bg)", color: "var(--red)", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <AlertCircle size={16} />
                      {submitError}
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--charcoal)", display: "block", marginBottom: "6px" }}>
                      Cover Letter / Introduction
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Explain why you are a great fit for this internship..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
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

                  <div>
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--charcoal)", display: "block", marginBottom: "6px" }}>
                      Key Qualifications / Skills
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Java, SQL, Git, Communication"
                      value={qualifications}
                      onChange={(e) => setQualifications(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "11px 14px",
                        borderRadius: "10px",
                        border: "1px solid var(--border)",
                        fontSize: "14px",
                        outline: "none",
                      }}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--charcoal)", display: "block", marginBottom: "6px" }}>
                      Upload Resume (PDF format)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                      style={{ fontSize: "13px", color: "var(--muted)" }}
                    />
                    {student?.resume && !resumeFile && (
                      <span style={{ fontSize: "12px", color: "var(--green)", display: "block", marginTop: "4px" }}>
                        ✓ Profile resume attached by default
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
                    <Button variant="outline" onClick={() => setApplyModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      loading={submitting}
                      disabled={isDeadlinePassed(selectedInternship)}
                    >
                      {isDeadlinePassed(selectedInternship) ? "Deadline Passed" : "Submit Application"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
