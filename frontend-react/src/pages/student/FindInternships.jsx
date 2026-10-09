import React, { useEffect, useState } from "react";
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
} from "lucide-react";

export function FindInternships() {
  const { student } = useAuth();

  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

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

  // Existing applied internship IDs map
  const [appliedIds, setAppliedIds] = useState(new Set());

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
    if (!selectedInternship || !student?.student_id) return;

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
        setTimeout(() => {
          setApplyModalOpen(false);
        }, 1800);
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

  // Filtered internships logic
  const filteredInternships = internships.filter((item) => {
    const matchesSearch =
      (item.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.company_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.location || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept =
      departmentFilter === "all" ||
      (item.domain || item.department || "").toLowerCase() === departmentFilter.toLowerCase();

    return matchesSearch && matchesDept;
  });

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
        <EmptyState
          title="No Internships Found"
          message="No matching internship listings match your search filters."
          actionText="Reset Filters"
          onAction={() => {
            setSearchTerm("");
            setDepartmentFilter("all");
          }}
        />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {filteredInternships.map((item) => {
            const isApplied = appliedIds.has(item.internship_id);
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
                    <span style={{ fontSize: "12px", color: "var(--charcoal)", background: "var(--warm-white)", padding: "4px 10px", borderRadius: "8px", border: "1px solid var(--border-light)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <MapPin size={13} style={{ color: "var(--terracotta)" }} />
                      {item.location || "Remote / On-site"}
                    </span>
                    <span style={{ fontSize: "12px", color: "var(--charcoal)", background: "var(--warm-white)", padding: "4px 10px", borderRadius: "8px", border: "1px solid var(--border-light)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={13} style={{ color: "var(--muted)" }} />
                      {item.duration_weeks ? `${item.duration_weeks} Weeks` : item.duration || "3 Months"}
                    </span>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--wine)", background: "var(--cream)", padding: "4px 10px", borderRadius: "8px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <ShieldCheck size={13} /> Verified by Institution
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
                  }}
                >
                  <span style={{ fontSize: "15px", fontWeight: 800, color: "var(--wine)" }}>
                    {item.stipend ? `₹${Number(item.stipend).toLocaleString()}/mo` : "Stipend Disclosed"}
                  </span>

                  {isApplied ? (
                    <Button size="sm" variant="secondary" disabled icon={CheckCircle2}>
                      Applied
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
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <CheckCircle2 size={48} style={{ color: "var(--green)", marginBottom: "16px" }} />
              <h3 style={{ fontSize: "20px", fontWeight: 700, color: "var(--charcoal)", marginBottom: "8px" }}>
                Application Submitted!
              </h3>
              <p style={{ fontSize: "14px", color: "var(--muted)" }}>
                Your application for {selectedInternship.title} at {selectedInternship.company_name} has been received.
              </p>
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

              {/* 4. APPLICATION FORM */}
              <form onSubmit={handleApplySubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
                  <Button type="submit" variant="primary" loading={submitting}>
                    Submit Application
                  </Button>
                </div>
              </form>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
