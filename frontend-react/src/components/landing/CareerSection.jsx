import React from "react";
import { Search, Send, CalendarCheck, Award, Rocket, ChevronRight } from "lucide-react";

export function CareerSection() {
  const steps = [
    {
      label: "DISCOVER",
      title: "Find Opportunities",
      desc: "Vetted listings matched to your academic major.",
      icon: Search,
    },
    {
      label: "APPLY",
      title: "One-Click Submit",
      desc: "Send verified student profile & resume instantly.",
      icon: Send,
    },
    {
      label: "INTERVIEW",
      title: "Recruiter Rounds",
      desc: "Attend technical & HR interview sessions.",
      icon: CalendarCheck,
    },
    {
      label: "EVALUATE",
      title: "Faculty Endorsement",
      desc: "Receive mentor ratings & credit score approvals.",
      icon: Award,
    },
    {
      label: "GROW",
      title: "Career Placement",
      desc: "Convert internship credits into full-time roles.",
      icon: Rocket,
    },
  ];

  return (
    <section
      style={{
        background: "var(--wine)",
        color: "#FFFFFF",
        padding: "90px 24px",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
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
              color: "var(--terracotta-light)",
              textTransform: "uppercase",
            }}
          >
            ACADEMIC & CAREER LIFECYCLE
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "38px",
              fontWeight: 800,
              color: "#FFFFFF",
              marginTop: "8px",
            }}
          >
            Every Application Is a Step Forward.
          </h2>
          <p style={{ fontSize: "16px", color: "var(--cream)", maxWidth: "600px", margin: "12px auto 0", opacity: 0.92 }}>
            From initial internship discovery to official faculty endorsement and final career growth.
          </p>
        </div>

        {/* Milestone Flow Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            alignItems: "stretch",
          }}
        >
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;
            return (
              <div
                key={idx}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  borderRadius: "20px",
                  padding: "28px 20px",
                  border: "1px solid rgba(255, 255, 255, 0.16)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: isLast ? "var(--terracotta)" : "rgba(255, 255, 255, 0.18)",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <Icon size={22} />
                  </div>

                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "1px",
                      color: isLast ? "var(--terracotta-light)" : "var(--cream)",
                      marginBottom: "6px",
                    }}
                  >
                    0{idx + 1}. {step.label}
                  </div>

                  <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#FFFFFF", marginBottom: "4px" }}>
                    {step.title}
                  </h4>

                  <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.85)", lineHeight: 1.5 }}>
                    {step.desc}
                  </p>
                </div>

                {!isLast && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "16px",
                      color: "rgba(255, 255, 255, 0.35)",
                    }}
                  >
                    <ChevronRight size={20} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
