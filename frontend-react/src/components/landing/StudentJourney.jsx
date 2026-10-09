import React from "react";
import { Search, Send, TrendingUp, Calendar, Award, CheckCircle2, Star, UserCheck } from "lucide-react";

export function StudentJourney() {
  const steps = [
    {
      step: "01",
      title: "Discover Internship",
      desc: "Search vetted listings matched to your major, skills, and preferred stipend.",
      icon: Search,
      badge: "Skill Match",
      badgeColor: "var(--wine)",
      bgTint: "var(--cream)",
    },
    {
      step: "02",
      title: "One-Click Apply",
      desc: "Submit your verified student profile and resume directly to recruiters.",
      icon: Send,
      badge: "Instant Submission",
      badgeColor: "var(--terracotta)",
      bgTint: "var(--warm-white)",
    },
    {
      step: "03",
      title: "Track Application",
      desc: "Monitor live 4-stage stepper: Applied → Shortlisted → Interview → Offer.",
      icon: TrendingUp,
      badge: "Live Status",
      badgeColor: "var(--green)",
      bgTint: "#FFFFFF",
    },
    {
      step: "04",
      title: "Attend Interview",
      desc: "Receive calendar reminders, meeting links, and recruiter instructions.",
      icon: Calendar,
      badge: "Scheduled",
      badgeColor: "var(--yellow)",
      bgTint: "var(--cream)",
    },
    {
      step: "05",
      title: "Faculty Evaluation",
      desc: "Earn formal academic mentor reviews, credit ratings, and endorsements.",
      icon: Award,
      badge: "Academic Review",
      badgeColor: "var(--wine)",
      bgTint: "var(--warm-white)",
    },
    {
      step: "06",
      title: "Verified Career Profile",
      desc: "Convert internship experience into verified career momentum for graduation.",
      icon: UserCheck,
      badge: "Career Ready",
      badgeColor: "var(--green)",
      bgTint: "#FFFFFF",
    },
  ];

  return (
    <section
      id="students"
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
            THE STUDENT EXPERIENCE
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
            From Classroom to Career.
          </h2>
          <p style={{ fontSize: "16px", color: "var(--muted)", maxWidth: "600px", margin: "12px auto 0" }}>
            A structured visual journey guiding students through every stage of campus recruitment and academic endorsement.
          </p>
        </div>

        {/* Visual Composition Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
            position: "relative",
          }}
        >
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                style={{
                  background: item.bgTint,
                  borderRadius: "20px",
                  padding: "28px 24px",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                }}
                className="card-hover"
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        background: "var(--wine-subtle)",
                        color: "var(--wine)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={22} />
                    </div>

                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: "12px",
                        background: "#FFFFFF",
                        color: item.badgeColor,
                        border: "1px solid var(--border-light)",
                        boxShadow: "var(--shadow-xs)",
                      }}
                    >
                      Step {item.step} • {item.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--charcoal)", marginBottom: "8px" }}>
                    {item.title}
                  </h3>

                  <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.55 }}>
                    {item.desc}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: "20px",
                    paddingTop: "14px",
                    borderTop: "1px solid var(--border-light)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "var(--wine)",
                  }}
                >
                  <CheckCircle2 size={15} /> Integrated College Portal Stage
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
