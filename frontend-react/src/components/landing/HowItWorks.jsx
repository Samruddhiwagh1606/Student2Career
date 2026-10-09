import React from "react";
import { Search, Send, Calendar, Award } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Discover",
      desc: "Find verified internship opportunities matching your major, skills, and stipend preferences.",
      icon: Search,
    },
    {
      num: "02",
      title: "Apply",
      desc: "Submit your application and verified college student resume directly to recruiter listings.",
      icon: Send,
    },
    {
      num: "03",
      title: "Connect",
      desc: "Attend interviews, manage scheduling invites, and collaborate with faculty advisors.",
      icon: Calendar,
    },
    {
      num: "04",
      title: "Grow",
      desc: "Receive formal evaluations, feedback, academic credits, and build your career profile.",
      icon: Award,
    },
  ];

  return (
    <section
      id="how-it-works"
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
            SIMPLE 4-STEP PROCESS
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
            How College2Career Works
          </h2>
          <p style={{ fontSize: "16px", color: "var(--muted)", maxWidth: "580px", margin: "12px auto 0" }}>
            A streamlined workflow connecting college talent with top recruiters and faculty mentors.
          </p>
        </div>

        {/* Horizontal Timeline Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "24px",
            position: "relative",
          }}
        >
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "20px",
                  padding: "32px 24px",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
                className="card-hover"
              >
                {/* Step Number Tag & Icon */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "36px",
                      fontWeight: 800,
                      color: "var(--wine)",
                      opacity: 0.9,
                    }}
                  >
                    {step.num}
                  </span>

                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "12px",
                      background: "var(--wine-subtle)",
                      color: "var(--wine)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={20} />
                  </div>
                </div>

                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--charcoal)", marginBottom: "8px" }}>
                  {step.title}
                </h3>

                <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.55 }}>
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
