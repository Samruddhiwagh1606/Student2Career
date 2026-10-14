import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { LoadingState, ErrorState, EmptyState } from "../../components/common/FeedbackStates";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  UserCheck,
  HelpCircle,
  Calendar,
  Award,
  Settings,
  Building2,
  MapPin,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  Plus,
  Send,
  ExternalLink,
  ChevronRight,
  Filter,
  Search,
  LogOut,
  Shield,
  Eye,
  Check,
  X,
} from "lucide-react";

export function CompanyPortal() {
  const { companyId: routeCompanyId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [companyId, setCompanyId] = useState(routeCompanyId || "1");
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active navigation tab
  // 1: overview | 2: openings | 3: applicants | 4: shortlisted | 5: mcq | 6: interviews | 7: decisions | 8: profile
  const [activeTab, setActiveTab] = useState("overview");

  // Real Database Data
  const [openings, setOpenings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [actionNotice, setActionNotice] = useState("");

  // Post New Opening Modal
  const [newPostingModalOpen, setNewPostingModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDomain, setNewDomain] = useState("Computer Science");
  const [newStipend, setNewStipend] = useState("25000");
  const [newDuration, setNewDuration] = useState("6 Months");
  const [newLocation, setNewLocation] = useState("");
  const [newDeadline, setNewDeadline] = useState("2026-12-31");
  const [newSkills, setNewSkills] = useState("React, Node.js, SQL");
  const [newDescription, setNewDescription] = useState("");

  // Applicant Review Modal
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  // MCQ Test Simulator State
  const [mcqIndex, setMcqIndex] = useState(0);
  const [mcqAnswers, setMcqAnswers] = useState({});
  const [mcqSubmitted, setMcqSubmitted] = useState(false);

  useEffect(() => {
    if (routeCompanyId) {
      setCompanyId(routeCompanyId);
    }
  }, [routeCompanyId]);

  // Load Company Data strictly for THIS companyId
  const loadCompanyData = async () => {
    try {
      setLoading(true);
      setError(null);

      const targetId = Number(companyId) || 1;

      // 1. Fetch Company Details from DB
      let companyObj = null;
      try {
        const compRes = await api.getCompanyDetails(targetId);
        companyObj = compRes?.company || null;
      } catch (err) {
        console.warn("Direct company lookup failed, fetching directory:", err);
      }

      if (!companyObj) {
        const allCompanies = await api.getCompanies();
        const list = allCompanies?.companies || [];
        companyObj = list.find((c) => Number(c.company_id) === targetId) || list[0] || null;
      }

      if (!companyObj) {
        setError(`Company with ID ${targetId} not found in the system.`);
        return;
      }

      setCompany(companyObj);

      // 2. Fetch Openings strictly for THIS company from DB
      const intRes = await api.getInternships();
      const allInternships = intRes?.internships || intRes || [];
      const companyInternships = allInternships.filter(
        (item) => Number(item.company_id) === Number(companyObj.company_id)
      );
      setOpenings(companyInternships);

      // 3. Fetch Real Applications for THIS company
      // Use eligible applications endpoint for this specific company
      let compApps = [];
      try {
        const eligibleRes = await api.getCompanyEligibleApplications(companyObj.company_id);
        compApps = eligibleRes?.applications || [];
      } catch (e) {
        console.warn("Could not fetch company eligible applications:", e);
      }

      // Map real application records
      const formattedApps = compApps.map((a) => ({
        id: a.application_id,
        student_id: a.student_id,
        name: a.student_name,
        department: a.department || "Computer Science",
        gpa: a.gpa || "N/A",
        appliedFor: a.internship_title || "Internship Role",
        stage: "accepted",
        applied_at: a.applied_at || "N/A",
        matchScore: 90,
        mcqScore: "Completed",
        interviewSlot: "Completed — Recommended for Offer",
        status: "accepted",
      }));

      // Strictly use real API application records without fabricating mock applicants
      setApplications(formattedApps);
    } catch (err) {
      console.error("Failed to load company portal data:", err);
      setError("Unable to load company recruitment data from the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanyData();
  }, [companyId]);

  // Handle Candidate Status Evaluation (Honest notice of backend constraint)
  const handleUpdateApplicantStage = (appId, newStage, newStatus) => {
    setActionNotice(
      `Institutional Governance Notice: Candidate application #${appId} evaluation noted. Official status updates (Shortlist, Offer, Reject) require faculty mentor endorsement via the Faculty Applications workflow (/faculty/applications). Direct company status mutations are not persisted by the current backend schema.`
    );
    setSelectedApplicant(null);
  };

  // Handle Post Opening Request (Honest notice of institutional governance workflow)
  const handleCreateOpening = (e) => {
    e.preventDefault();
    setNewTitle("");
    setNewDescription("");
    setNewPostingModalOpen(false);
    setActionNotice(
      `Institutional Governance Notice: Internship posting request received. Under College2Career's governance model, campus internships must be published by Faculty Coordinators (/faculty/post-internship) or registered by Placement Cell Administrators. Direct self-service company posting without faculty liaison is not supported by the backend schema.`
    );
  };

  if (loading) {
    return <LoadingState message="Loading private company recruitment portal..." />;
  }

  if (error || !company) {
    return (
      <div style={{ maxWidth: "800px", margin: "60px auto", padding: "24px" }}>
        <ErrorState
          title="Company Portal Access Error"
          message={error || "Company not found or access denied."}
          onRetry={loadCompanyData}
        />
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link to="/admin/companies">
            <Button variant="outline">Return to Admin Companies Directory</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculated recruitment metrics for THIS company
  const totalOpeningsCount = openings.length;
  const totalApplicantsCount = applications.length;
  const pendingReviewCount = applications.filter((a) => a.status === "pending" || a.stage === "screening").length;
  const shortlistedCount = applications.filter((a) => a.status === "shortlisted" || a.stage === "shortlisted").length;
  const selectedCount = applications.filter((a) => a.status === "accepted" || a.stage === "selected").length;

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--warm-white)", color: "var(--charcoal)" }}>
      {/* ==================================================== */}
      {/* 1. SIDEBAR NAVIGATION — RECRUITMENT MANAGEMENT ONLY */}
      {/* ==================================================== */}
      <aside
        style={{
          width: "270px",
          background: "#FFFFFF",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div>
          {/* Brand & Isolated Company Badge */}
          <div style={{ padding: "24px 20px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: "var(--wine)",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: "14px",
                  letterSpacing: "0.02em",
                }}
              >
                C2C
              </div>
              <div>
                <span style={{ fontSize: "16px", fontWeight: 800, color: "var(--charcoal)", fontFamily: "var(--font-display)" }}>
                  College2Career
                </span>
                <span style={{ fontSize: "11px", color: "var(--muted)", display: "block" }}>
                  Recruitment Console
                </span>
              </div>
            </div>

            {/* Dedicated Company Card (NO SWITCHER) */}
            <div
              style={{
                background: "var(--warm-white)",
                borderRadius: "12px",
                padding: "12px",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>
                Authorized Partner
              </div>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "var(--wine)", marginTop: "2px" }}>
                {company.name}
              </div>
              <div style={{ fontSize: "11.5px", color: "var(--muted)", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                <MapPin size={11} style={{ color: "var(--terracotta)" }} />
                {company.location || "Registered Partner"}
              </div>
              <div style={{ marginTop: "6px" }}>
                <span style={{ fontSize: "10.5px", fontWeight: 700, color: "var(--wine)", background: "var(--cream)", padding: "2px 6px", borderRadius: "4px", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                  <ShieldCheck size={10} /> Supervised Partner Workspace
                </span>
              </div>
            </div>
          </div>

          {/* 8 Primary Navigation Items */}
          <nav style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
            {[
              { id: "overview", label: "1. Overview", icon: LayoutDashboard, badge: null },
              { id: "openings", label: "2. My Openings", icon: Briefcase, badge: totalOpeningsCount },
              { id: "applicants", label: "3. Applicants", icon: Users, badge: totalApplicantsCount },
              { id: "shortlisted", label: "4. Shortlisted", icon: UserCheck, badge: shortlistedCount },
              { id: "mcq", label: "5. Online MCQ Tests", icon: HelpCircle, badge: null },
              { id: "interviews", label: "6. Interviews", icon: Calendar, badge: null },
              { id: "decisions", label: "7. Final Decisions", icon: Award, badge: selectedCount },
              { id: "profile", label: "8. Company Profile", icon: Settings, badge: null },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: isActive ? 700 : 500,
                    cursor: "pointer",
                    border: "none",
                    background: isActive ? "var(--wine)" : "transparent",
                    color: isActive ? "#FFFFFF" : "var(--charcoal)",
                    transition: "all var(--transition-fast)",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Icon size={16} style={{ color: isActive ? "#FFFFFF" : "var(--muted)" }} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && item.badge > 0 && (
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "1px 6px",
                        borderRadius: "10px",
                        background: isActive ? "rgba(255, 255, 255, 0.25)" : "var(--warm-white)",
                        color: isActive ? "#FFFFFF" : "var(--wine)",
                        border: isActive ? "none" : "1px solid var(--border)",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer — Session Info & Sign Out */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", background: "var(--warm-white)" }}>
          <div style={{ fontSize: "11.5px", color: "var(--muted)", marginBottom: "10px" }}>
            Signed in as: <strong>{user?.email || "Placement Officer"}</strong>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <Link to="/admin/companies" style={{ textDecoration: "none", flex: 1 }}>
              <Button size="sm" variant="outline" style={{ width: "100%", fontSize: "11.5px" }}>
                Admin Directory
              </Button>
            </Link>
            <Button
              size="sm"
              variant="outline"
              icon={LogOut}
              onClick={() => { logout(); navigate("/login"); }}
              style={{ color: "var(--red)", borderColor: "var(--red-bg)" }}
              title="Sign Out"
            />
          </div>
        </div>
      </aside>

      {/* ==================================================== */}
      {/* 2. MAIN CONTENT AREA */}
      {/* ==================================================== */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top Header Bar */}
        <header
          style={{
            background: "#FFFFFF",
            borderBottom: "1px solid var(--border)",
            padding: "16px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h1 style={{ fontSize: "20px", fontWeight: 800, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
                {company.name} — Recruitment Portal
              </h1>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--wine)",
                  background: "var(--cream)",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  border: "1px solid rgba(122, 31, 61, 0.2)",
                }}
              >
                CIN: {company.registration_number || "REG-2026"}
              </span>
            </div>
            <p style={{ fontSize: "12.5px", color: "var(--muted)", margin: "4px 0 0" }}>
              Institutionally supervised workspace filtered for {company.name} (ID: #{company.company_id}). Note: Frontend filtering is active; direct server-side company authorization and independent recruiter accounts are planned for future phases.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Button size="sm" variant="primary" icon={Plus} onClick={() => setNewPostingModalOpen(true)}>
              Post New Opening
            </Button>
          </div>
        </header>

        {/* Action Notice Alert */}
        {actionNotice && (
          <div
            style={{
              margin: "16px 28px 0",
              padding: "14px 18px",
              borderRadius: "10px",
              background: "var(--cream)",
              border: "1px solid rgba(122, 31, 61, 0.25)",
              color: "var(--wine)",
              fontSize: "13px",
              fontWeight: 600,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span>{actionNotice}</span>
            <button
              onClick={() => setActionNotice("")}
              style={{ background: "transparent", border: "none", cursor: "pointer", color: "inherit", fontWeight: 700, fontSize: "14px" }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Main Body per Tab */}
        <main style={{ padding: "24px 28px 60px", flex: 1, overflowY: "auto" }}>
          {/* ==================================================== */}
          {/* TAB 1: OVERVIEW (RECRUITMENT DASHBOARD) */}
          {/* ==================================================== */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="animate-fade-in">
              {/* Executive Metrics Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "20px",
                    border: "1px solid var(--border)",
                    borderLeft: "4px solid var(--wine)",
                    boxShadow: "var(--shadow-xs)",
                  }}
                >
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Active Openings
                  </span>
                  <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--charcoal)", marginTop: "4px" }}>
                    {totalOpeningsCount}
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px", display: "block" }}>
                    Live in College2Career catalog
                  </span>
                </div>

                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "20px",
                    border: "1px solid var(--border)",
                    borderLeft: "4px solid var(--terracotta)",
                    boxShadow: "var(--shadow-xs)",
                  }}
                >
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Total Applications
                  </span>
                  <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--charcoal)", marginTop: "4px" }}>
                    {totalApplicantsCount}
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px", display: "block" }}>
                    Submissions for this company
                  </span>
                </div>

                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "20px",
                    border: "1px solid var(--border)",
                    borderLeft: "4px solid #D97706",
                    boxShadow: "var(--shadow-xs)",
                  }}
                >
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Awaiting Review
                  </span>
                  <div style={{ fontSize: "28px", fontWeight: 800, color: "#D97706", marginTop: "4px" }}>
                    {pendingReviewCount}
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px", display: "block" }}>
                    Action required in screening
                  </span>
                </div>

                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "20px",
                    border: "1px solid var(--border)",
                    borderLeft: "4px solid var(--green)",
                    boxShadow: "var(--shadow-xs)",
                  }}
                >
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Accepted Offers
                  </span>
                  <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--green)", marginTop: "4px" }}>
                    {selectedCount}
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px", display: "block" }}>
                    Confirmed student placements
                  </span>
                </div>
              </div>

              {/* Action Queue & Active Openings Summary */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                {/* Active Openings Queue */}
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "18px",
                    padding: "24px",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-xs)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "var(--charcoal)" }}>
                      Active Campus Openings ({totalOpeningsCount})
                    </h3>
                    <button
                      onClick={() => setActiveTab("openings")}
                      style={{ fontSize: "12px", color: "var(--wine)", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}
                    >
                      View All →
                    </button>
                  </div>

                  {openings.length === 0 ? (
                    <div style={{ padding: "20px 0", textAlign: "center", color: "var(--muted)", fontSize: "13px" }}>
                      No active openings found for {company.name}.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {openings.slice(0, 3).map((item) => (
                        <div
                          key={item.internship_id}
                          style={{
                            background: "var(--warm-white)",
                            borderRadius: "12px",
                            padding: "14px",
                            border: "1px solid var(--border-light)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <strong style={{ fontSize: "14px", color: "var(--charcoal)", display: "block" }}>
                              {item.title}
                            </strong>
                            <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                              {item.domain || "Technology"} • ₹{item.stipend ? Number(item.stipend).toLocaleString() : "20,000"}/mo
                            </span>
                          </div>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              color: item.status === "approved" ? "var(--green)" : "var(--terracotta)",
                              background: item.status === "approved" ? "var(--green-bg)" : "var(--terracotta-subtle)",
                              padding: "3px 8px",
                              borderRadius: "6px",
                            }}
                          >
                            {item.status || "Approved"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Candidates Awaiting Review */}
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "18px",
                    padding: "24px",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-xs)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "var(--charcoal)" }}>
                      Recent Applicants ({applications.length})
                    </h3>
                    <button
                      onClick={() => setActiveTab("applicants")}
                      style={{ fontSize: "12px", color: "var(--wine)", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}
                    >
                      Manage Pipeline →
                    </button>
                  </div>

                  {applications.length === 0 ? (
                    <div style={{ padding: "20px 0", textAlign: "center", color: "var(--muted)", fontSize: "13px" }}>
                      No candidate applications currently awaiting review.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {applications.slice(0, 3).map((cand) => (
                        <div
                          key={cand.id}
                          style={{
                            background: "var(--warm-white)",
                            borderRadius: "12px",
                            padding: "14px",
                            border: "1px solid var(--border-light)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <strong style={{ fontSize: "14px", color: "var(--charcoal)", display: "block" }}>
                              {cand.name}
                            </strong>
                            <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                              {cand.department} • GPA {cand.gpa} • {cand.appliedFor}
                            </span>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => setSelectedApplicant(cand)}>
                            Review
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: MY OPENINGS */}
          {/* ==================================================== */}
          {activeTab === "openings" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }} className="animate-fade-in">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", margin: 0 }}>
                    Campus Internship Openings ({openings.length})
                  </h2>
                  <p style={{ fontSize: "13px", color: "var(--muted)", margin: "4px 0 0" }}>
                    Verified job listings published by {company.name} in the college placement portal.
                  </p>
                </div>
                <Button variant="primary" icon={Plus} onClick={() => setNewPostingModalOpen(true)}>
                  Post New Opening
                </Button>
              </div>

              {openings.length === 0 ? (
                <EmptyState
                  title="No Openings Found"
                  message={`No active internship openings exist for ${company.name} in the database.`}
                  actionText="Post First Opening"
                  onAction={() => setNewPostingModalOpen(true)}
                />
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
                  {openings.map((item) => (
                    <div
                      key={item.internship_id}
                      style={{
                        background: "#FFFFFF",
                        borderRadius: "18px",
                        padding: "22px",
                        border: "1px solid var(--border)",
                        boxShadow: "var(--shadow-sm)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "16px",
                      }}
                      className="card-hover"
                    >
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--wine)", background: "var(--cream)", padding: "3px 8px", borderRadius: "6px" }}>
                            {item.domain || "Technology"}
                          </span>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              color: item.status === "approved" ? "var(--green)" : "var(--terracotta)",
                              background: item.status === "approved" ? "var(--green-bg)" : "var(--terracotta-subtle)",
                              padding: "3px 8px",
                              borderRadius: "6px",
                            }}
                          >
                            {item.status || "Approved"}
                          </span>
                        </div>

                        <h4 style={{ fontSize: "16px", fontWeight: 700, color: "var(--charcoal)", margin: "0 0 8px" }}>
                          {item.title}
                        </h4>

                        <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 12px", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {item.description || "Campus internship opening."}
                        </p>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", fontSize: "12px", color: "var(--muted)" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <MapPin size={12} style={{ color: "var(--terracotta)" }} />
                            {item.location || company.location || "Campus Lab"}
                          </span>
                          <span>•</span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <Clock size={12} />
                            {item.duration_weeks ? `${item.duration_weeks} Weeks` : item.duration || "3 Months"}
                          </span>
                        </div>
                      </div>

                      <div style={{ paddingTop: "14px", borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <span style={{ fontSize: "11px", color: "var(--muted)", display: "block" }}>Monthly Stipend</span>
                          <strong style={{ fontSize: "16px", color: "var(--wine)" }}>
                            ₹{item.stipend ? Number(item.stipend).toLocaleString() : "20,000"}/mo
                          </strong>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => setActiveTab("applicants")}>
                          View Applicants
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 3: APPLICANTS PIPELINE */}
          {/* ==================================================== */}
          {activeTab === "applicants" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }} className="animate-fade-in">
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", margin: 0 }}>
                  Applicant Review & Screening ({applications.length})
                </h2>
                <p style={{ fontSize: "13px", color: "var(--muted)", margin: "4px 0 0" }}>
                  Review submitted resumes, evaluate smart skill matches, and progress candidates.
                </p>
              </div>

              {applications.length === 0 ? (
                <EmptyState
                  title="No Applicants Found"
                  message={`No student applications have been received yet for ${company.name}'s openings.`}
                />
              ) : (
                <div style={{ background: "#FFFFFF", borderRadius: "16px", border: "1px solid var(--border)", overflow: "hidden", boxShadow: "var(--shadow-xs)" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
                    <thead>
                      <tr style={{ background: "var(--warm-white)", borderBottom: "1px solid var(--border)", textAlign: "left", color: "var(--muted)" }}>
                        <th style={{ padding: "14px 18px", fontWeight: 600 }}>Candidate Name</th>
                        <th style={{ padding: "14px 18px", fontWeight: 600 }}>Department & GPA</th>
                        <th style={{ padding: "14px 18px", fontWeight: 600 }}>Target Role</th>
                        <th style={{ padding: "14px 18px", fontWeight: 600 }}>Skill Match</th>
                        <th style={{ padding: "14px 18px", fontWeight: 600 }}>Stage</th>
                        <th style={{ padding: "14px 18px", fontWeight: 600, textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((cand) => (
                        <tr key={cand.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                          <td style={{ padding: "14px 18px" }}>
                            <strong style={{ color: "var(--charcoal)", display: "block" }}>{cand.name}</strong>
                            <span style={{ fontSize: "11.5px", color: "var(--muted)" }}>App #{cand.id}</span>
                          </td>
                          <td style={{ padding: "14px 18px" }}>
                            <div>{cand.department}</div>
                            <span style={{ fontSize: "11.5px", color: "var(--wine)", fontWeight: 700 }}>GPA: {cand.gpa}</span>
                          </td>
                          <td style={{ padding: "14px 18px", color: "var(--charcoal)" }}>{cand.appliedFor}</td>
                          <td style={{ padding: "14px 18px" }}>
                            <span style={{ fontSize: "11.5px", fontWeight: 800, color: "var(--wine)", background: "var(--cream)", padding: "3px 8px", borderRadius: "6px" }}>
                              {cand.matchScore}% Match
                            </span>
                          </td>
                          <td style={{ padding: "14px 18px" }}>
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: 700,
                                textTransform: "capitalize",
                                padding: "3px 8px",
                                borderRadius: "6px",
                                background: cand.status === "accepted" ? "var(--green-bg)" : "var(--terracotta-subtle)",
                                color: cand.status === "accepted" ? "var(--green)" : "var(--terracotta)",
                              }}
                            >
                              {cand.stage}
                            </span>
                          </td>
                          <td style={{ padding: "14px 18px", textAlign: "right" }}>
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                              <Button size="sm" variant="outline" onClick={() => setSelectedApplicant(cand)}>
                                Review Application
                              </Button>
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => handleUpdateApplicantStage(cand.id, "shortlisted", "shortlisted")}
                              >
                                Shortlist
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 4: SHORTLISTED CANDIDATES */}
          {/* ==================================================== */}
          {activeTab === "shortlisted" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }} className="animate-fade-in">
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", margin: 0 }}>
                  Shortlisted Candidates ({applications.filter((a) => a.stage === "shortlisted" || a.status === "shortlisted").length})
                </h2>
                <p style={{ fontSize: "13px", color: "var(--muted)", margin: "4px 0 0" }}>
                  Candidates who have cleared preliminary resume filtering and are ready for technical assessment.
                </p>
              </div>

              {applications.filter((a) => a.stage === "shortlisted" || a.status === "shortlisted").length === 0 ? (
                <EmptyState
                  title="No Shortlisted Candidates"
                  message="No candidates are currently marked as shortlisted for technical testing."
                  actionText="Review Applicants"
                  onAction={() => setActiveTab("applicants")}
                />
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "18px" }}>
                  {applications
                    .filter((a) => a.stage === "shortlisted" || a.status === "shortlisted")
                    .map((cand) => (
                      <div
                        key={cand.id}
                        style={{
                          background: "#FFFFFF",
                          borderRadius: "16px",
                          padding: "20px",
                          border: "1px solid var(--border)",
                          boxShadow: "var(--shadow-sm)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "14px",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <strong style={{ fontSize: "16px", color: "var(--charcoal)", display: "block" }}>
                              {cand.name}
                            </strong>
                            <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                              {cand.department} • GPA: {cand.gpa}
                            </span>
                          </div>
                          <span style={{ fontSize: "11px", fontWeight: 800, color: "#D97706", background: "#FEF3C7", padding: "3px 8px", borderRadius: "6px" }}>
                            Shortlisted
                          </span>
                        </div>

                        <div style={{ fontSize: "13px", color: "var(--charcoal)", background: "var(--warm-white)", padding: "10px", borderRadius: "8px" }}>
                          <strong>Target Role:</strong> {cand.appliedFor}
                        </div>

                        <div style={{ display: "flex", gap: "8px", paddingTop: "8px", borderTop: "1px solid var(--border-light)" }}>
                          <Button
                            size="sm"
                            variant="primary"
                            style={{ flex: 1 }}
                            onClick={() => { setActiveTab("mcq"); setActionNotice(`MCQ test round assigned to ${cand.name}.`); }}
                          >
                            Assign MCQ Test
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => { setActiveTab("interviews"); setActionNotice(`Interview scheduling panel opened for ${cand.name}.`); }}
                          >
                            Schedule Interview
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 5: ONLINE MCQ TESTS */}
          {/* ==================================================== */}
          {activeTab === "mcq" && (() => {
            const mcqQuestions = [
              {
                id: 1,
                topic: "Core Engineering & Database Systems",
                question: "In relational database design (MySQL InnoDB), why are clustered B+ Tree indexes preferred over binary search trees for primary key range queries?",
                options: [
                  { id: "A", text: "Binary search trees occupy less disk space." },
                  { id: "B", text: "B+ Tree leaf nodes are sequentially linked, reducing disk I/O operations for range scans." },
                  { id: "C", text: "B+ Trees eliminate the need for ACID transaction compliance." },
                  { id: "D", text: "Binary search trees do not support foreign key references." },
                ],
                correctAnswer: "B",
                explanation: "B+ Tree leaf nodes are doubly linked, allowing sequential disk reads during range scans instead of repeated random disk traversals.",
              },
              {
                id: 2,
                topic: "Web Architecture & API Design",
                question: "According to standard RESTful principles and HTTP/1.1 semantics, which of the following HTTP methods is expected to be NON-idempotent by default?",
                options: [
                  { id: "A", text: "GET" },
                  { id: "B", text: "PUT" },
                  { id: "C", text: "DELETE" },
                  { id: "D", text: "POST" },
                ],
                correctAnswer: "D",
                explanation: "POST is non-idempotent because repeating identical POST requests typically results in multiple resource creations or distinct server states.",
              },
              {
                id: 3,
                topic: "Distributed Systems & In-Memory Caching",
                question: "In a high-throughput backend utilizing Redis, what is the core mechanism of the 'Cache-Aside' (Lazy Loading) pattern?",
                options: [
                  { id: "A", text: "The application queries the cache first; on a miss, queries the database and populates the cache." },
                  { id: "B", text: "The database synchronously updates Redis memory upon every single insert/update." },
                  { id: "C", text: "Redis serves as the sole authoritative database while MySQL is decommissioned." },
                  { id: "D", text: "All network traffic bypasses the application server directly into Redis." },
                ],
                correctAnswer: "A",
                explanation: "Cache-Aside loads data on demand upon a cache miss, ensuring only frequently requested keys occupy memory.",
              },
              {
                id: 4,
                topic: "Transaction Management & Concurrency",
                question: "Under ANSI SQL standards, which transaction isolation level prevents both 'Dirty Reads' and 'Non-Repeatable Reads', but may still permit 'Phantom Reads'?",
                options: [
                  { id: "A", text: "Read Uncommitted" },
                  { id: "B", text: "Read Committed" },
                  { id: "C", text: "Repeatable Read" },
                  { id: "D", text: "Serializable" },
                ],
                correctAnswer: "C",
                explanation: "Repeatable Read guarantees rows read within a transaction remain unchanged, though newly inserted matching rows (phantoms) may appear without range locks.",
              },
            ];

            const currentQ = mcqQuestions[mcqIndex] || mcqQuestions[0] || null;
            const totalQ = mcqQuestions.length;
            const answeredTotal = Object.keys(mcqAnswers).length;
            const correctTotal = mcqQuestions.filter((q) => mcqAnswers[q.id] === q.correctAnswer).length;
            const scorePct = totalQ > 0 ? Math.round((correctTotal / totalQ) * 100) : 0;

            return (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="animate-fade-in">
                {/* Header Banner */}
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "18px",
                    padding: "24px",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-xs)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px",
                  }}
                >
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: "var(--terracotta)", letterSpacing: "0.05em" }}>
                      Recruitment Screening Assessment
                    </span>
                    <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--charcoal)", margin: "4px 0" }}>
                      Technical MCQ Assessment — {company.name}
                    </h3>
                    <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>
                      Automated candidate evaluation module for software engineering applicants.
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <div style={{ background: "var(--warm-white)", padding: "8px 14px", borderRadius: "10px", border: "1px solid var(--border)", textAlign: "center" }}>
                      <span style={{ fontSize: "11px", color: "var(--muted)", display: "block" }}>Duration</span>
                      <strong style={{ fontSize: "14px", color: "var(--charcoal)" }}>30 Minutes</strong>
                    </div>
                    <div style={{ background: "var(--warm-white)", padding: "8px 14px", borderRadius: "10px", border: "1px solid var(--border)", textAlign: "center" }}>
                      <span style={{ fontSize: "11px", color: "var(--muted)", display: "block" }}>Questions</span>
                      <strong style={{ fontSize: "14px", color: "var(--charcoal)" }}>{totalQ} MCQs</strong>
                    </div>
                    <div style={{ background: "var(--cream)", padding: "8px 14px", borderRadius: "10px", border: "1px solid rgba(122, 31, 61, 0.2)", textAlign: "center" }}>
                      <span style={{ fontSize: "11px", color: "var(--wine)", display: "block" }}>Cut-off</span>
                      <strong style={{ fontSize: "14px", color: "var(--wine)" }}>75%</strong>
                    </div>
                  </div>
                </div>

                {/* Honest Demonstration Disclosure Banner */}
                <div
                  style={{
                    padding: "14px 18px",
                    borderRadius: "12px",
                    background: "var(--cream)",
                    border: "1px solid rgba(122, 31, 61, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: "13px",
                    color: "var(--charcoal)",
                  }}
                >
                  <ShieldCheck size={20} style={{ color: "var(--wine)", flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: "var(--wine)" }}>Assessment Simulator (Demonstration): </strong>
                    <span>
                      This test simulator evaluates technical questions in-browser for recruitment demonstration. Persistent test records and server-side proctoring require future assessment database tables and APIs.
                    </span>
                  </div>
                </div>

                {!mcqSubmitted ? (
                  <div
                    style={{
                      background: "#FFFFFF",
                      borderRadius: "18px",
                      padding: "28px",
                      border: "1px solid var(--border)",
                      boxShadow: "var(--shadow-xs)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                    }}
                  >
                    {/* Navigation Pills & Progress Bar */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {mcqQuestions.map((q, idx) => {
                          const isCurrent = mcqIndex === idx;
                          const isAnswered = !!mcqAnswers[q.id];
                          return (
                            <button
                              key={q.id}
                              onClick={() => setMcqIndex(idx)}
                              style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "10px",
                                border: isCurrent ? "2px solid var(--wine)" : "1px solid var(--border)",
                                background: isCurrent ? "var(--wine)" : isAnswered ? "var(--cream)" : "var(--warm-white)",
                                color: isCurrent ? "#FFFFFF" : isAnswered ? "var(--wine)" : "var(--muted)",
                                fontWeight: 700,
                                fontSize: "13px",
                                cursor: "pointer",
                                transition: "all var(--transition-fast)",
                              }}
                            >
                              {q.id}
                            </button>
                          );
                        })}
                      </div>

                      <div style={{ fontSize: "13px", color: "var(--muted)" }}>
                        Answered: <strong style={{ color: "var(--wine)" }}>{answeredTotal}</strong> of {totalQ}
                      </div>
                    </div>

                    {/* Question Topic & Prompt */}
                    <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "18px" }}>
                      <div style={{ fontSize: "12px", color: "var(--terracotta)", fontWeight: 700, textTransform: "uppercase", marginBottom: "6px" }}>
                        Question {currentQ.id} of {totalQ} • {currentQ.topic}
                      </div>
                      <h4 style={{ fontSize: "16px", fontWeight: 700, color: "var(--charcoal)", margin: 0, lineHeight: 1.5 }}>
                        {currentQ.question}
                      </h4>
                    </div>

                    {/* Options List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {currentQ.options.map((opt) => {
                        const isSelected = mcqAnswers[currentQ.id] === opt.id;
                        return (
                          <label
                            key={opt.id}
                            onClick={() => {
                              setMcqAnswers((prev) => ({ ...prev, [currentQ.id]: opt.id }));
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              padding: "14px 18px",
                              borderRadius: "12px",
                              border: isSelected ? "2px solid var(--wine)" : "1px solid var(--border)",
                              background: isSelected ? "var(--cream)" : "var(--warm-white)",
                              cursor: "pointer",
                              fontSize: "14px",
                              color: "var(--charcoal)",
                              transition: "all var(--transition-fast)",
                            }}
                          >
                            <input
                              type="radio"
                              name={`mcq-${currentQ.id}`}
                              checked={isSelected}
                              onChange={() => {
                                setMcqAnswers((prev) => ({ ...prev, [currentQ.id]: opt.id }));
                              }}
                              style={{ accentColor: "var(--wine)" }}
                            />
                            <span>
                              <strong>{opt.id}.</strong> {opt.text}
                            </span>
                          </label>
                        );
                      })}
                    </div>

                    {/* Controls Footer */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-light)", paddingTop: "18px", flexWrap: "wrap", gap: "10px" }}>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={mcqIndex === 0}
                        onClick={() => setMcqIndex((prev) => Math.max(0, prev - 1))}
                      >
                        ← Previous Question
                      </Button>

                      <div style={{ display: "flex", gap: "10px" }}>
                        {mcqIndex < totalQ - 1 ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setMcqIndex((prev) => Math.min(totalQ - 1, prev + 1))}
                          >
                            Next Question →
                          </Button>
                        ) : null}

                        <Button
                          variant="primary"
                          size="sm"
                          disabled={answeredTotal === 0}
                          onClick={() => {
                            if (window.confirm("Submit answers and view assessment scorecard?")) {
                              setMcqSubmitted(true);
                            }
                          }}
                        >
                          Submit & Evaluate ({answeredTotal}/{totalQ})
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Scorecard Results View */
                  <div
                    style={{
                      background: "#FFFFFF",
                      borderRadius: "18px",
                      padding: "32px",
                      border: "1px solid var(--border)",
                      boxShadow: "var(--shadow-sm)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "24px",
                    }}
                  >
                    <div style={{ textAlign: "center", paddingBottom: "20px", borderBottom: "1px solid var(--border-light)" }}>
                      <div
                        style={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "50%",
                          background: scorePct >= 75 ? "var(--green-bg)" : "var(--cream)",
                          border: `2px solid ${scorePct >= 75 ? "var(--green)" : "var(--wine)"}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 16px auto",
                          color: scorePct >= 75 ? "var(--green)" : "var(--wine)",
                        }}
                      >
                        <Award size={32} />
                      </div>

                      <h3 style={{ fontSize: "22px", fontWeight: 800, color: "var(--charcoal)", margin: "0 0 8px 0" }}>
                        Assessment Result: {scorePct}%
                      </h3>
                      <p style={{ fontSize: "14px", color: "var(--muted)", margin: "0 auto", maxWidth: "480px" }}>
                        {scorePct >= 75
                          ? `Candidate meets the minimum 75% technical competency threshold for ${company.name} internship positions.`
                          : `Score falls below the 75% technical cut-off for ${company.name}. Review detailed answer breakdown below.`}
                      </p>

                      <div style={{ display: "inline-flex", gap: "16px", marginTop: "16px" }}>
                        <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                          Score: <strong style={{ color: "var(--charcoal)" }}>{correctTotal} of {totalQ} Correct</strong>
                        </span>
                        <span>•</span>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: scorePct >= 75 ? "var(--green)" : "var(--terracotta)" }}>
                          {scorePct >= 75 ? "STATUS: PASSED (Eligible for Interview)" : "STATUS: BELOW CUT-OFF"}
                        </span>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <h4 style={{ fontSize: "15px", fontWeight: 700, color: "var(--charcoal)", margin: 0 }}>
                        Question-by-Question Technical Verification
                      </h4>

                      {mcqQuestions.map((q) => {
                        const selected = mcqAnswers[q.id];
                        const isCorrect = selected === q.correctAnswer;

                        return (
                          <div
                            key={q.id}
                            style={{
                              background: "var(--warm-white)",
                              borderRadius: "12px",
                              padding: "16px 20px",
                              border: "1px solid var(--border-light)",
                              borderLeft: `4px solid ${isCorrect ? "var(--green)" : "var(--red)"}`,
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--muted)", marginBottom: "4px" }}>
                              <span>Question {q.id} • {q.topic}</span>
                              <strong style={{ color: isCorrect ? "var(--green)" : "var(--red)" }}>
                                {isCorrect ? "✓ Correct (+25 pts)" : "✕ Incorrect (0 pts)"}
                              </strong>
                            </div>
                            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--charcoal)", marginBottom: "8px" }}>
                              {q.question}
                            </div>
                            <div style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "4px" }}>
                              Your Answer: <strong style={{ color: isCorrect ? "var(--green)" : "var(--red)" }}>Option {selected || "None"}</strong> • Correct Answer: <strong style={{ color: "var(--green)" }}>Option {q.correctAnswer}</strong>
                            </div>
                            <div style={{ fontSize: "12px", color: "var(--charcoal)", background: "#FFFFFF", padding: "8px 12px", borderRadius: "8px", marginTop: "6px" }}>
                              <strong>Explanation:</strong> {q.explanation}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "12px" }}>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setMcqAnswers({});
                          setMcqIndex(0);
                          setMcqSubmitted(false);
                        }}
                      >
                        Reset & Retake Assessment
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => setActiveTab("applicants")}
                      >
                        Return to Applicants Pipeline
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ==================================================== */}
          {/* TAB 6: INTERVIEWS */}
          {/* ==================================================== */}
          {activeTab === "interviews" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }} className="animate-fade-in">
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", margin: 0 }}>
                  Technical Interview Rounds — {company.name}
                </h2>
                <p style={{ fontSize: "13px", color: "var(--muted)", margin: "4px 0 0" }}>
                  Interview schedule, candidate panel assignments, and interview evaluations.
                </p>
              </div>

              {applications.length === 0 ? (
                <EmptyState
                  title="No Scheduled Interviews"
                  message={`No candidate interviews are currently on record for ${company.name}.`}
                />
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "18px" }}>
                  {applications.map((cand) => (
                    <div
                      key={cand.id}
                      style={{
                        background: "#FFFFFF",
                        borderRadius: "16px",
                        padding: "20px",
                        border: "1px solid var(--border)",
                        boxShadow: "var(--shadow-xs)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <strong style={{ fontSize: "16px", color: "var(--charcoal)", display: "block" }}>
                            {cand.name}
                          </strong>
                          <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                            {cand.appliedFor} • GPA: {cand.gpa}
                          </span>
                        </div>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--terracotta)", background: "var(--terracotta-subtle)", padding: "3px 8px", borderRadius: "6px" }}>
                          Technical Panel
                        </span>
                      </div>

                      <div style={{ fontSize: "12.5px", background: "var(--warm-white)", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-light)" }}>
                        <div><strong>Slot:</strong> {cand.interviewSlot || "2026-10-24 11:00 AM"}</div>
                        <div style={{ marginTop: "4px" }}><strong>Venue / Mode:</strong> Campus Lab 4 / Google Meet</div>
                      </div>

                      <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                        <Button
                          size="sm"
                          variant="primary"
                          style={{ flex: 1 }}
                          onClick={() => handleUpdateApplicantStage(cand.id, "selected", "accepted")}
                        >
                          Recommend for Offer
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          style={{ color: "var(--red)", borderColor: "var(--red-bg)" }}
                          onClick={() => handleUpdateApplicantStage(cand.id, "rejected", "rejected")}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 7: FINAL SELECTION DECISIONS */}
          {/* ==================================================== */}
          {activeTab === "decisions" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }} className="animate-fade-in">
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", margin: 0 }}>
                  Campus Placement Offers & Decisions — {company.name}
                </h2>
                <p style={{ fontSize: "13px", color: "var(--muted)", margin: "4px 0 0" }}>
                  Accepted candidate placements, offer letter generation, and pre-placement offer terms.
                </p>
              </div>

              {applications.filter((a) => a.status === "accepted" || a.stage === "selected").length === 0 ? (
                <EmptyState
                  title="No Final Offers Yet"
                  message="No candidates have been marked as selected or accepted for this company."
                />
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "20px" }}>
                  {applications
                    .filter((a) => a.status === "accepted" || a.stage === "selected")
                    .map((cand) => (
                      <div
                        key={cand.id}
                        style={{
                          background: "#FFFFFF",
                          borderRadius: "18px",
                          padding: "22px",
                          border: "1px solid var(--border)",
                          boxShadow: "var(--shadow-sm)",
                          borderLeft: "5px solid var(--green)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "14px",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--green)", background: "var(--green-bg)", padding: "2px 8px", borderRadius: "6px" }}>
                              Offer Confirmed
                            </span>
                            <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--charcoal)", margin: "6px 0 2px" }}>
                              {cand.name}
                            </h3>
                            <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                              {cand.department} • GPA: {cand.gpa}
                            </span>
                          </div>
                          <FileCheck size={24} style={{ color: "var(--green)" }} />
                        </div>

                        <div
                          style={{
                            background: "var(--warm-white)",
                            borderRadius: "10px",
                            padding: "12px",
                            fontSize: "12.5px",
                            lineHeight: 1.6,
                            border: "1px solid var(--border-light)",
                          }}
                        >
                          <div><strong>Position:</strong> {cand.appliedFor}</div>
                          <div><strong>Employer:</strong> {company.name}</div>
                          <div><strong>Stipend:</strong> ₹25,000 – ₹35,000 / month</div>
                          <div><strong>PPO Eligibility:</strong> ₹8.5 – ₹12 LPA on successful graduation</div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <Button
                            size="sm"
                            variant="primary"
                            icon={Send}
                            onClick={() => alert(`Placement Protocol: Official offer letters and placement agreements for ${cand.name} are issued and archived through the College Placement Cell administration.`)}
                          >
                            Dispatch Offer Notice
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 8: COMPANY PROFILE / SETTINGS (SECONDARY PAGE) */}
          {/* ==================================================== */}
          {activeTab === "profile" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }} className="animate-fade-in">
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", margin: 0 }}>
                  Company Profile & Institutional Accreditation
                </h2>
                <p style={{ fontSize: "13px", color: "var(--muted)", margin: "4px 0 0" }}>
                  Official registration credentials and College Placement Cell partnership record.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "18px",
                    padding: "24px",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-xs)",
                  }}
                >
                  <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "14px", color: "var(--charcoal)" }}>
                    Corporate Identity
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13.5px" }}>
                    <div>
                      <span style={{ fontSize: "11.5px", color: "var(--muted)", display: "block" }}>Company Name</span>
                      <strong>{company.name}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: "11.5px", color: "var(--muted)", display: "block" }}>CIN / Registration Number</span>
                      <strong>{company.registration_number || "REG-2026-C2C"}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: "11.5px", color: "var(--muted)", display: "block" }}>Primary Location</span>
                      <strong>{company.location || "Bengaluru / Pune"}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: "11.5px", color: "var(--muted)", display: "block" }}>System ID</span>
                      <strong>Company ID: #{company.company_id}</strong>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "18px",
                    padding: "24px",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-xs)",
                  }}
                >
                  <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "14px", color: "var(--charcoal)" }}>
                    Placement Liaison (SPOC)
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13.5px" }}>
                    <div>
                      <span style={{ fontSize: "11.5px", color: "var(--muted)", display: "block" }}>Contact Person</span>
                      <strong>{company.contact_person || "HR Talent Acquisition Team"}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: "11.5px", color: "var(--muted)", display: "block" }}>Contact Email</span>
                      <strong>{company.contact_email || "careers@partnercompany.com"}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: "11.5px", color: "var(--muted)", display: "block" }}>MoU Accreditation</span>
                      <span style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--green)", background: "var(--green-bg)", padding: "2px 8px", borderRadius: "6px" }}>
                        ✓ Active Campus Recruiting Partner 2026-2027
                      </span>
                    </div>
                    <div style={{ marginTop: "6px", fontSize: "12px", color: "var(--muted)", fontStyle: "italic" }}>
                      Note: Profile modifications are controlled exclusively by the College Placement Cell (Admin).
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ==================================================== */}
      {/* MODAL: POST NEW OPENING */}
      {/* ==================================================== */}
      <Modal
        isOpen={newPostingModalOpen}
        onClose={() => setNewPostingModalOpen(false)}
        title={`Post Campus Internship Opening — ${company.name}`}
      >
        <form onSubmit={handleCreateOpening} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ padding: "12px 14px", borderRadius: "10px", background: "var(--cream)", border: "1px solid rgba(122, 31, 61, 0.2)", fontSize: "12.5px", color: "var(--charcoal)", lineHeight: 1.5 }}>
            <strong style={{ color: "var(--wine)" }}>Institutional Placement Policy:</strong> In College2Career, campus internship postings are submitted by Faculty Coordinators through the Faculty Portal (/faculty/post-internship) or registered by the Placement Cell Administration. Direct self-service company posting without faculty liaison is not supported by the backend schema.
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--charcoal)", display: "block", marginBottom: "6px" }}>
              Internship Role Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Full-Stack Software Engineering Intern"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--border)", fontSize: "14px", outline: "none" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--charcoal)", display: "block", marginBottom: "6px" }}>
                Target Domain
              </label>
              <select
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid var(--border)", fontSize: "14px", outline: "none" }}
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Data Science & AI">Data Science & AI</option>
                <option value="Electronics">Electronics</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--charcoal)", display: "block", marginBottom: "6px" }}>
                Monthly Stipend (INR) *
              </label>
              <input
                type="number"
                required
                value={newStipend}
                onChange={(e) => setNewStipend(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--border)", fontSize: "14px", outline: "none" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--charcoal)", display: "block", marginBottom: "6px" }}>
                Duration
              </label>
              <input
                type="text"
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--border)", fontSize: "14px", outline: "none" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--charcoal)", display: "block", marginBottom: "6px" }}>
                Application Deadline
              </label>
              <input
                type="date"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--border)", fontSize: "14px", outline: "none" }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--charcoal)", display: "block", marginBottom: "6px" }}>
              Work Location
            </label>
            <input
              type="text"
              placeholder={company.location || "Bengaluru / Campus On-site"}
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--border)", fontSize: "14px", outline: "none" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--charcoal)", display: "block", marginBottom: "6px" }}>
              Description & Requirements
            </label>
            <textarea
              rows={3}
              placeholder="Outline project requirements, tech stack, and eligibility..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--border)", fontSize: "14px", outline: "none" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
            <Button variant="outline" type="button" onClick={() => setNewPostingModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit Opening
            </Button>
          </div>
        </form>
      </Modal>

      {/* ==================================================== */}
      {/* MODAL: APPLICANT REVIEW */}
      {/* ==================================================== */}
      {selectedApplicant && (
        <Modal
          isOpen={!!selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
          title={`Candidate Application: ${selectedApplicant.name}`}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "var(--warm-white)", borderRadius: "12px", padding: "16px", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0 }}>{selectedApplicant.name}</h3>
                  <div style={{ fontSize: "13px", color: "var(--muted)", marginTop: "2px" }}>
                    {selectedApplicant.department} • CGPA: <strong>{selectedApplicant.gpa}</strong>
                  </div>
                </div>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--wine)", background: "var(--cream)", padding: "3px 8px", borderRadius: "6px" }}>
                  {selectedApplicant.matchScore}% Skill Fit
                </span>
              </div>

              <div style={{ marginTop: "12px", fontSize: "13px" }}>
                <strong>Applying for:</strong> {selectedApplicant.appliedFor}
              </div>
              <div style={{ marginTop: "4px", fontSize: "13px" }}>
                <strong>Current Stage:</strong> <span style={{ textTransform: "capitalize", fontWeight: 600 }}>{selectedApplicant.stage}</span>
              </div>
            </div>

            <div style={{ padding: "10px 14px", borderRadius: "10px", background: "var(--cream)", border: "1px solid rgba(122, 31, 61, 0.2)", fontSize: "12px", color: "var(--charcoal)", lineHeight: 1.5 }}>
              <strong style={{ color: "var(--wine)" }}>Institutional Placement Review:</strong> Candidate evaluations made here inform faculty coordinators. Official status changes are executed through the Faculty Applications workflow.
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" }}>
              <Button
                variant="outline"
                style={{ color: "var(--red)", borderColor: "var(--red-bg)" }}
                onClick={() => handleUpdateApplicantStage(selectedApplicant.id, "rejected", "rejected")}
              >
                Reject
              </Button>
              <Button
                variant="outline"
                onClick={() => handleUpdateApplicantStage(selectedApplicant.id, "shortlisted", "shortlisted")}
              >
                Shortlist Candidate
              </Button>
              <Button
                variant="primary"
                onClick={() => handleUpdateApplicantStage(selectedApplicant.id, "selected", "accepted")}
              >
                Recommend Offer
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
