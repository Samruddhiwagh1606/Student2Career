import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { LoadingState } from "../../components/common/FeedbackStates";
import {
  Briefcase,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  PlusCircle,
} from "lucide-react";

export function PostInternship() {
  const { faculty, user } = useAuth();
  const navigate = useNavigate();

  const facultyId = faculty?.faculty_id || user?.profile?.faculty_id;

  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  // Form State
  const [companyId, setCompanyId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("");
  const [durationWeeks, setDurationWeeks] = useState(8);
  const [stipend, setStipend] = useState(10000);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [applicationDeadline, setApplicationDeadline] = useState("");
  const [facultyVerified, setFacultyVerified] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadCompanies() {
      try {
        setLoadingCompanies(true);
        const res = await api.getCompanies();
        const list = res?.companies || [];
        setCompanies(list);
        if (list.length > 0) {
          setCompanyId(list[0].company_id);
        }
      } catch (err) {
        console.error("Failed to load companies:", err);
      } finally {
        setLoadingCompanies(false);
      }
    }
    loadCompanies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!facultyId) {
      setErrorMsg("Faculty session missing. Please re-login.");
      return;
    }

    if (!companyId) {
      setErrorMsg("Please select a partner company.");
      return;
    }

    if (!facultyVerified) {
      setErrorMsg("Faculty academic verification is required to submit.");
      return;
    }

    setSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const payload = {
        company_id: Number(companyId),
        posted_by: Number(facultyId),
        title: title.trim(),
        description: description.trim(),
        domain: domain.trim(),
        duration_weeks: Number(durationWeeks),
        stipend: Number(stipend),
        start_date: startDate,
        end_date: endDate,
        application_deadline: applicationDeadline,
        faculty_verified: facultyVerified,
      };

      const res = await api.postInternship(payload);

      if (res.success || res.message) {
        setSuccessMsg(
          res.message || "Internship successfully verified and posted for Admin approval!"
        );
        setTimeout(() => {
          navigate("/faculty/internships");
        }, 1800);
      } else {
        throw new Error(res.message || "Failed to post internship.");
      }
    } catch (err) {
      console.error("Post internship error:", err);
      setErrorMsg(err.message || "Unable to post internship.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCompanies) {
    return <LoadingState message="Loading partner companies directory..." />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", maxWidth: "800px" }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: "26px", fontWeight: 800, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
          Post & Verify New Internship
        </h1>
        <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px" }}>
          Verify academic suitability and register an internship opportunity for student applications.
        </p>
      </div>

      {successMsg && (
        <div style={{ padding: "14px 18px", borderRadius: "12px", background: "var(--green-bg)", color: "var(--green)", fontSize: "14px", fontWeight: 600, display: "flex", alignItems: "center", gap: "10px" }}>
          <CheckCircle2 size={20} />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div style={{ padding: "14px 18px", borderRadius: "12px", background: "var(--red-bg)", color: "var(--red)", fontSize: "14px", fontWeight: 600, display: "flex", alignItems: "center", gap: "10px" }}>
          <AlertCircle size={20} />
          {errorMsg}
        </div>
      )}

      <div
        style={{
          background: "var(--warm-white)",
          borderRadius: "20px",
          padding: "36px",
          border: "1px solid var(--border)",
          borderLeft: "5px solid var(--wine)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Company Selection */}
          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--charcoal)", display: "block", marginBottom: "8px" }}>
              Partner Recruiting Company *
            </label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                fontSize: "14px",
                background: "var(--warm-white)",
                outline: "none",
              }}
            >
              <option value="">Select a company...</option>
              {companies.map((c) => (
                <option key={c.company_id} value={c.company_id}>
                  {c.name} ({c.location || "Location N/A"})
                </option>
              ))}
            </select>
          </div>

          {/* Internship Title */}
          <Input
            label="Internship Title *"
            placeholder="e.g. Software Engineering Intern"
            icon={Briefcase}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* Domain / Field */}
          <Input
            label="Domain / Department *"
            placeholder="e.g. Computer Science / Web Development"
            icon={Building2}
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
          />

          {/* Description */}
          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--charcoal)", display: "block", marginBottom: "8px" }}>
              Internship Description & Key Responsibilities *
            </label>
            <textarea
              rows={5}
              required
              placeholder="Provide clear details regarding roles, tasks, technology stack, and candidate expectations..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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

          {/* Grid: Duration & Stipend */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <Input
              label="Duration (Weeks, 4 to 26) *"
              type="number"
              min={4}
              max={26}
              icon={Clock}
              value={durationWeeks}
              onChange={(e) => setDurationWeeks(e.target.value)}
              required
            />

            <Input
              label="Monthly Stipend (₹ INR) *"
              type="number"
              min={0}
              icon={DollarSign}
              value={stipend}
              onChange={(e) => setStipend(e.target.value)}
              required
            />
          </div>

          {/* Grid: Dates */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
            <Input
              label="Application Deadline *"
              type="date"
              icon={Calendar}
              value={applicationDeadline}
              onChange={(e) => setApplicationDeadline(e.target.value)}
              required
            />

            <Input
              label="Internship Start Date *"
              type="date"
              icon={Calendar}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />

            <Input
              label="Internship End Date *"
              type="date"
              icon={Calendar}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          {/* Verification Checkbox */}
          <div
            style={{
              padding: "16px 20px",
              borderRadius: "14px",
              background: "var(--cream)",
              border: "1px solid var(--border-light)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <input
              type="checkbox"
              id="faculty_verified"
              checked={facultyVerified}
              onChange={(e) => setFacultyVerified(e.target.checked)}
              style={{ width: "18px", height: "18px", accentColor: "var(--wine)" }}
            />
            <label htmlFor="faculty_verified" style={{ fontSize: "13px", fontWeight: 600, color: "var(--charcoal)", cursor: "pointer" }}>
              I hereby certify and academically verify that this internship complies with college curriculum standards and credit requirements.
            </label>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
            <Button variant="outline" type="button" onClick={() => navigate("/faculty/internships")}>
              Cancel
            </Button>

            <Button type="submit" variant="primary" loading={submitting} icon={ShieldCheck}>
              Submit for Admin Approval
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
