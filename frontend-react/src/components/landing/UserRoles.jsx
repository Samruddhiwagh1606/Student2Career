import React from "react";
import { GraduationCap, Briefcase, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "../common/Button";
import { useNavigate } from "react-router-dom";

export function UserRoles() {
  const navigate = useNavigate();

  return (
    <section
      id="roles"
      style={{
        padding: "90px 24px",
        maxWidth: "1280px",
        margin: "0 auto",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "1px",
            color: "var(--wine)",
            textTransform: "uppercase",
          }}
        >
          TAILORED PORTALS
        </span>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "36px",
            fontWeight: 800,
            color: "var(--charcoal)",
            marginTop: "8px",
          }}
        >
          One Platform. Everyone Connected.
        </h2>
        <p style={{ fontSize: "16px", color: "var(--muted)", maxWidth: "600px", margin: "12px auto 0" }}>
          Purpose-built interfaces customized specifically for Students, Faculty Mentors, and Institutional Administrators.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "32px",
        }}
      >
        {/* Card 1: STUDENTS (Warm Cream Surface) */}
        <div
          style={{
            background: "var(--cream)",
            borderRadius: "24px",
            padding: "40px 32px",
            border: "1px solid rgba(122, 31, 61, 0.15)",
            boxShadow: "var(--shadow-md)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
          className="card-hover"
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "16px",
                  background: "var(--wine)",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(122, 31, 61, 0.2)",
                }}
              >
                <GraduationCap size={26} />
              </div>

              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.8px",
                  color: "var(--wine)",
                  background: "#FFFFFF",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  border: "1px solid rgba(122, 31, 61, 0.15)",
                }}
              >
                STUDENTS
              </span>
            </div>

            <h3 style={{ fontSize: "24px", fontWeight: 800, color: "var(--charcoal)", marginBottom: "12px" }}>
              Student Portal
            </h3>

            <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.6, marginBottom: "28px" }}>
              Discover opportunities, submit applications, track review status live, manage interviews, and earn faculty feedback.
            </p>

            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "36px" }}>
              <li style={{ fontSize: "13.5px", color: "var(--charcoal)", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <CheckCircle2 size={16} style={{ color: "var(--wine)", flexShrink: 0, marginTop: "2px" }} />
                <span>Discover verified opportunities matched to your major</span>
              </li>
              <li style={{ fontSize: "13.5px", color: "var(--charcoal)", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <CheckCircle2 size={16} style={{ color: "var(--wine)", flexShrink: 0, marginTop: "2px" }} />
                <span>One-click application with verified student profile</span>
              </li>
              <li style={{ fontSize: "13.5px", color: "var(--charcoal)", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <CheckCircle2 size={16} style={{ color: "var(--wine)", flexShrink: 0, marginTop: "2px" }} />
                <span>Track 4-stage application progress in real-time</span>
              </li>
              <li style={{ fontSize: "13.5px", color: "var(--charcoal)", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <CheckCircle2 size={16} style={{ color: "var(--wine)", flexShrink: 0, marginTop: "2px" }} />
                <span>Manage interview invitations & faculty recommendations</span>
              </li>
            </ul>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => navigate("/login")}
            icon={ArrowRight}
            style={{ width: "100%", padding: "12px", fontWeight: 700 }}
          >
            Student Sign In
          </Button>
        </div>

        {/* Card 2: FACULTY (Warm White Surface) */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "24px",
            padding: "40px 32px",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-md)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
          className="card-hover"
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "16px",
                  background: "var(--terracotta)",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(231, 111, 81, 0.22)",
                }}
              >
                <Briefcase size={26} />
              </div>

              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.8px",
                  color: "var(--terracotta)",
                  background: "var(--terracotta-subtle)",
                  padding: "4px 12px",
                  borderRadius: "20px",
                }}
              >
                FACULTY
              </span>
            </div>

            <h3 style={{ fontSize: "24px", fontWeight: 800, color: "var(--charcoal)", marginBottom: "12px" }}>
              Faculty & Mentors
            </h3>

            <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.6, marginBottom: "28px" }}>
              Post internships, review candidates, schedule interviews, evaluate student performance, and grant academic credits.
            </p>

            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "36px" }}>
              <li style={{ fontSize: "13.5px", color: "var(--charcoal)", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <CheckCircle2 size={16} style={{ color: "var(--terracotta)", flexShrink: 0, marginTop: "2px" }} />
                <span>Post & manage department internship listings</span>
              </li>
              <li style={{ fontSize: "13.5px", color: "var(--charcoal)", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <CheckCircle2 size={16} style={{ color: "var(--terracotta)", flexShrink: 0, marginTop: "2px" }} />
                <span>Review student applicant resumes & academic details</span>
              </li>
              <li style={{ fontSize: "13.5px", color: "var(--charcoal)", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <CheckCircle2 size={16} style={{ color: "var(--terracotta)", flexShrink: 0, marginTop: "2px" }} />
                <span>Schedule interviews and notify candidates instantly</span>
              </li>
              <li style={{ fontSize: "13.5px", color: "var(--charcoal)", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <CheckCircle2 size={16} style={{ color: "var(--terracotta)", flexShrink: 0, marginTop: "2px" }} />
                <span>Submit formal evaluations & mentor credit scores</span>
              </li>
            </ul>
          </div>

          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate("/login")}
            icon={ArrowRight}
            style={{ width: "100%", padding: "12px", fontWeight: 700 }}
          >
            Faculty Sign In
          </Button>
        </div>

        {/* Card 3: ADMINISTRATION (Dark Charcoal Surface) */}
        <div
          style={{
            background: "var(--charcoal)",
            color: "#FFFFFF",
            borderRadius: "24px",
            padding: "40px 32px",
            border: "1px solid #383438",
            boxShadow: "var(--shadow-lg)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
          className="card-hover"
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "16px",
                  background: "var(--wine)",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
                }}
              >
                <ShieldCheck size={26} />
              </div>

              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.8px",
                  color: "var(--terracotta-light)",
                  background: "rgba(255, 255, 255, 0.1)",
                  padding: "4px 12px",
                  borderRadius: "20px",
                }}
              >
                ADMINISTRATION
              </span>
            </div>

            <h3 style={{ fontSize: "24px", fontWeight: 800, color: "#FFFFFF", marginBottom: "12px" }}>
              Administration
            </h3>

            <p style={{ fontSize: "14px", color: "var(--cream)", opacity: 0.88, lineHeight: 1.6, marginBottom: "28px" }}>
              Manage users, approve company postings, monitor placement statistics, view analytics, and generate institutional reports.
            </p>

            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "36px" }}>
              <li style={{ fontSize: "13.5px", color: "#FFFFFF", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <CheckCircle2 size={16} style={{ color: "var(--terracotta-light)", flexShrink: 0, marginTop: "2px" }} />
                <span>Manage student & faculty accounts centrally</span>
              </li>
              <li style={{ fontSize: "13.5px", color: "#FFFFFF", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <CheckCircle2 size={16} style={{ color: "var(--terracotta-light)", flexShrink: 0, marginTop: "2px" }} />
                <span>Approve company profiles and recruiter postings</span>
              </li>
              <li style={{ fontSize: "13.5px", color: "#FFFFFF", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <CheckCircle2 size={16} style={{ color: "var(--terracotta-light)", flexShrink: 0, marginTop: "2px" }} />
                <span>Monitor college-wide placement metrics & trends</span>
              </li>
              <li style={{ fontSize: "13.5px", color: "#FFFFFF", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <CheckCircle2 size={16} style={{ color: "var(--terracotta-light)", flexShrink: 0, marginTop: "2px" }} />
                <span>Export department placement analytics & reports</span>
              </li>
            </ul>
          </div>

          <Button
            variant="dark"
            size="md"
            onClick={() => navigate("/login")}
            icon={ArrowRight}
            style={{ width: "100%", padding: "12px", fontWeight: 700, background: "rgba(255, 255, 255, 0.15)", color: "#FFFFFF", border: "1px solid rgba(255, 255, 255, 0.25)" }}
          >
            Admin Sign In
          </Button>
        </div>
      </div>
    </section>
  );
}
