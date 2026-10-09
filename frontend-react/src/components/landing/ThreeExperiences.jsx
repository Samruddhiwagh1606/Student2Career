import React from "react";
import { GraduationCap, Briefcase, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "../common/Button";
import { useNavigate } from "react-router-dom";

export function ThreeExperiences() {
  const navigate = useNavigate();

  const experiences = [
    {
      role: "For Students",
      tagline: "Accelerate your career journey with verified opportunities and guidance.",
      icon: GraduationCap,
      accentColor: "var(--wine)",
      subtleBg: "var(--wine-subtle)",
      badge: "STUDENT WORKSPACE",
      features: [
        "Browse verified internships by department & stipend",
        "Track 4-stage application progress in real-time",
        "Receive direct interview schedules and links",
        "Earn academic credit and faculty ratings",
      ],
      ctaText: "Student Portal",
      ctaVariant: "primary",
    },
    {
      role: "For Faculty & Mentors",
      tagline: "Guide students, post listings, and streamline academic credit reviews.",
      icon: Briefcase,
      accentColor: "var(--terracotta)",
      subtleBg: "var(--terracotta-subtle)",
      badge: "FACULTY WORKSPACE",
      features: [
        "Post & approve department internship listings",
        "Review student applications and resumes",
        "Schedule recruiter interviews with students",
        "Submit formal academic performance reviews",
      ],
      ctaText: "Faculty Portal",
      ctaVariant: "secondary",
    },
    {
      role: "For Administration",
      tagline: "Oversee campus placements, manage recruiters, and track analytics.",
      icon: ShieldCheck,
      accentColor: "var(--charcoal)",
      subtleBg: "rgba(36, 33, 36, 0.06)",
      badge: "ADMINISTRATIVE CONTROL",
      features: [
        "Monitor college-wide placement statistics",
        "Manage student & faculty user accounts",
        "Approve company recruiter profiles & openings",
        "Export comprehensive department placement reports",
      ],
      ctaText: "Admin Portal",
      ctaVariant: "dark",
    },
  ];

  return (
    <section
      id="experiences"
      style={{
        background: "var(--cream)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        padding: "90px 24px",
      }}
    >
      <div
        style={{
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
            ONE PLATFORM. THREE EXPERIENCES.
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
            Tailored Portals for College Talent, Faculty, & Campus Admin
          </h2>
          <p style={{ fontSize: "16px", color: "var(--muted)", maxWidth: "600px", margin: "12px auto 0" }}>
            College2Career provides dedicated, secure environments optimized for every stakeholder in the campus career lifecycle.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "32px",
          }}
        >
          {experiences.map((exp, idx) => {
            const Icon = exp.icon;
            return (
              <div
                key={idx}
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
                        background: exp.accentColor,
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={24} />
                    </div>

                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.5px",
                        color: exp.accentColor,
                        background: exp.subtleBg,
                        padding: "4px 10px",
                        borderRadius: "20px",
                      }}
                    >
                      {exp.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "22px", fontWeight: 700, color: "var(--charcoal)", marginBottom: "10px" }}>
                    {exp.role}
                  </h3>

                  <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.6, marginBottom: "28px" }}>
                    {exp.tagline}
                  </p>

                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "36px" }}>
                    {exp.features.map((feat, fIdx) => (
                      <li key={fIdx} style={{ fontSize: "13px", color: "var(--charcoal)", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <CheckCircle2 size={16} style={{ color: exp.accentColor, flexShrink: 0, marginTop: "2px" }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant={exp.ctaVariant}
                  size="md"
                  onClick={() => navigate("/login")}
                  icon={ArrowRight}
                  style={{ width: "100%" }}
                >
                  {exp.ctaText}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
