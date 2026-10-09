import React from "react";
import { Search, Send, CalendarCheck, Award, Rocket, ChevronRight } from "lucide-react";

export function CareerJourney() {
  const steps = [
    {
      label: "DISCOVER",
      desc: "Explore verified recruiter postings tailored to your major.",
      icon: Search,
    },
    {
      label: "APPLY",
      desc: "Submit your verified college profile and resume.",
      icon: Send,
    },
    {
      label: "INTERVIEW",
      desc: "Attend structured technical & HR interview rounds.",
      icon: CalendarCheck,
    },
    {
      label: "EVALUATE",
      desc: "Receive faculty review and academic credit approval.",
      icon: Award,
    },
    {
      label: "GROW",
      desc: "Convert internship experience into full-time placement.",
      icon: Rocket,
    },
  ];

  return (
    <section
      style={{
        background: "var(--wine)",
        color: "#FFFFFF",
        padding: "80px 24px",
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
              fontSize: "36px",
              fontWeight: 800,
              color: "#FFFFFF",
              marginTop: "8px",
            }}
          >
            Your Path From Campus to Industry
          </h2>
          <p style={{ fontSize: "16px", color: "var(--cream)", maxWidth: "580px", margin: "12px auto 0", opacity: 0.9 }}>
            From initial internship discovery to official faculty endorsement and final career growth.
          </p>
        </div>

        {/* Milestone Steps Timeline Grid */}
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
                  border: "1px solid rgba(255, 255, 255, 0.15)",
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
                      width: "42px",
                      height: "42px",
                      borderRadius: "12px",
                      background: isLast ? "var(--terracotta)" : "rgba(255, 255, 255, 0.18)",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <Icon size={20} />
                  </div>

                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 800,
                      letterSpacing: "1px",
                      color: isLast ? "var(--terracotta-light)" : "var(--cream)",
                      marginBottom: "6px",
                    }}
                  >
                    0{idx + 1}. {step.label}
                  </div>

                  <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.82)", lineHeight: 1.5 }}>
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
                    <ChevronRight size={18} />
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
