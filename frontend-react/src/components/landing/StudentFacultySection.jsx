import React from "react";
import { GraduationCap, Briefcase, CheckCircle2 } from "lucide-react";
import { Button } from "../common/Button";
import { useNavigate } from "react-router-dom";


export function StudentFacultySection() {
  const navigate = useNavigate();

  return (
    <section
      style={{
        background: "var(--cream)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        padding: "80px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1px",
              color: "var(--wine)",
              textTransform: "uppercase",
            }}
          >
            BUILT FOR THE WHOLE CAMPUS ECOSYSTEM
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "34px",
              fontWeight: 700,
              color: "var(--charcoal)",
              marginTop: "8px",
            }}
          >
            Tailored Experiences for Students & Faculty
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "32px",
          }}
        >
          {/* For Students Card */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "24px",
              padding: "40px 32px",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
            className="card-hover"
          >
            <div>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: "var(--wine)",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <GraduationCap size={24} />
              </div>

              <h3 style={{ fontSize: "22px", fontWeight: 700, color: "var(--charcoal)", marginBottom: "12px" }}>
                For Students
              </h3>

              <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.6, marginBottom: "24px" }}>
                Discover verified career openings, track your applications in real-time, build your resume profile, and earn faculty recommendations.
              </p>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
                <li style={{ fontSize: "13px", color: "var(--charcoal)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle2 size={16} style={{ color: "var(--wine)" }} />
                  Access approved internships matching your department
                </li>
                <li style={{ fontSize: "13px", color: "var(--charcoal)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle2 size={16} style={{ color: "var(--wine)" }} />
                  Track 4-stage application progress live
                </li>
                <li style={{ fontSize: "13px", color: "var(--charcoal)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle2 size={16} style={{ color: "var(--wine)" }} />
                  Manage interview invitations & schedule reminders
                </li>
              </ul>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => navigate("/login")}
              style={{ width: "100%" }}
            >
              Sign In as Student
            </Button>
          </div>

          {/* For Faculty & Placement Cell Card */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "24px",
              padding: "40px 32px",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
            className="card-hover"
          >
            <div>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: "var(--terracotta)",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <Briefcase size={24} />
              </div>

              <h3 style={{ fontSize: "22px", fontWeight: 700, color: "var(--charcoal)", marginBottom: "12px" }}>
                For Faculty & Mentors
              </h3>

              <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.6, marginBottom: "24px" }}>
                Post department internship opportunities, review student candidates, log official performance evaluations, and schedule recruiter interviews.
              </p>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
                <li style={{ fontSize: "13px", color: "var(--charcoal)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle2 size={16} style={{ color: "var(--terracotta)" }} />
                  Review and verify student application profiles
                </li>
                <li style={{ fontSize: "13px", color: "var(--charcoal)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle2 size={16} style={{ color: "var(--terracotta)" }} />
                  Schedule interviews & update application statuses
                </li>
                <li style={{ fontSize: "13px", color: "var(--charcoal)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle2 size={16} style={{ color: "var(--terracotta)" }} />
                  Submit formal academic evaluations & feedback
                </li>
              </ul>
            </div>

            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate("/login")}
              style={{ width: "100%" }}
            >
              Sign In as Faculty
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
