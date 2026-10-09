import React from "react";
import {
  Search,
  FileCheck,
  Calendar,
  Award,
  MessageSquare,
  Building2,
  BarChart3,
  ShieldCheck
} from "lucide-react";

export function FeatureGrid() {
  const features = [
    {
      title: "Internship Discovery",
      desc: "Browse approved campus opportunities filtered by major, skills, location, and stipend.",
      icon: Search,
    },
    {
      title: "Application Management",
      desc: "Track 4-stage application progress: Applied → Shortlisted → Interviewing → Selected.",
      icon: FileCheck,
    },
    {
      title: "Interview Scheduling",
      desc: "Automated calendar notifications, Google Meet integration, and recruiter slot management.",
      icon: Calendar,
    },
    {
      title: "Student Evaluations",
      desc: "Formal evaluation forms for faculty advisors to review student progress and grant credits.",
      icon: Award,
    },
    {
      title: "Faculty Feedback",
      desc: "Direct mentor ratings, performance notes, and academic credit endorsements.",
      icon: MessageSquare,
    },
    {
      title: "Company Insights",
      desc: "Verified recruiter profiles, department requirements, and stipend breakdown details.",
      icon: Building2,
    },
    {
      title: "Reports & Analytics",
      desc: "Institutional placement statistics, department summaries, and exportable analytics.",
      icon: BarChart3,
    },
    {
      title: "Role-Based Access",
      desc: "Secure, tailored portals custom built for Students, Faculty Mentors, and Administrators.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section
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
            color: "var(--terracotta)",
            textTransform: "uppercase",
          }}
        >
          PLATFORM CAPABILITIES
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
          Everything Your Internship Journey Needs.
        </h2>
        <p style={{ fontSize: "16px", color: "var(--muted)", maxWidth: "600px", margin: "12px auto 0" }}>
          Refined capabilities designed to streamline campus recruitment and academic credit workflows.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "24px",
        }}
      >
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              style={{
                background: "#FFFFFF",
                borderRadius: "20px",
                padding: "28px 24px",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
              className="card-hover"
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "var(--cream)",
                  color: "var(--wine)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(122, 31, 61, 0.12)",
                }}
              >
                <Icon size={22} />
              </div>

              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--charcoal)" }}>
                {item.title}
              </h3>

              <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.55 }}>
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
