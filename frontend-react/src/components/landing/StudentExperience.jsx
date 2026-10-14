import React from "react";
import { FileText, Calendar, Award, User, CheckCircle2, Star, Clock } from "lucide-react";

export function StudentExperience() {
  return (
    <section
      id="for-students"
      style={{
        padding: "90px 24px",
        maxWidth: "1280px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "56px",
          alignItems: "center",
        }}
      >
        {/* Left Explanation */}
        <div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1px",
              color: "var(--wine)",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            THE STUDENT EXPERIENCE
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "36px",
              fontWeight: 700,
              color: "var(--charcoal)",
              lineHeight: 1.2,
              marginBottom: "20px",
            }}
          >
            Everything you need to manage your internship journey.
          </h2>

          <p
            style={{
              fontSize: "16px",
              color: "var(--muted)",
              lineHeight: 1.6,
              marginBottom: "32px",
            }}
          >
            No more scattered emails or manual spreadsheets. College2Career organizes your entire career search—from discovery to faculty approval—in one unified, modern workspace.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", gap: "14px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "var(--wine-subtle)",
                  color: "var(--wine)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <FileText size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: "16px", fontWeight: 700, color: "var(--charcoal)" }}>Real-Time Status Tracking</h4>
                <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "2px" }}>
                  Monitor application stages from review, shortlisting, to formal acceptance.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "14px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "var(--terracotta-subtle)",
                  color: "var(--terracotta)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Calendar size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: "16px", fontWeight: 700, color: "var(--charcoal)" }}>Integrated Interview Calendar</h4>
                <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "2px" }}>
                  Get instant schedule updates and meeting links directly in your feed.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "14px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "var(--cream)",
                  color: "var(--wine)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Award size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: "16px", fontWeight: 700, color: "var(--charcoal)" }}>Faculty Feedback & Credit Ratings</h4>
                <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "2px" }}>
                  Seamlessly log internship evaluations and get academic mentor endorsements.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right UI Interactive Component Mockup */}
        <div
          style={{
            background: "var(--warm-white)",
            borderRadius: "24px",
            padding: "28px",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-lg)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Card 1: Applications Overview */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "16px 20px",
              border: "1px solid var(--border-light)",
              boxShadow: "var(--shadow-xs)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "var(--wine)",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "13px",
                }}
              >
                TC
              </div>
              <div>
                <strong style={{ fontSize: "14px", color: "var(--charcoal)", display: "block" }}>
                  TechCorp Frontend Intern
                </strong>
                <span style={{ fontSize: "12px", color: "var(--muted)" }}>Applied Oct 04 • Bangalore</span>
              </div>
            </div>
            <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "10px", background: "var(--yellow-bg)", color: "var(--yellow)" }}>
              Shortlisted
            </span>
          </div>

          {/* Card 2: Interview Slot */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "16px 20px",
              border: "1px solid var(--border-light)",
              boxShadow: "var(--shadow-xs)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "var(--terracotta-subtle)",
                  color: "var(--terracotta)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Calendar size={18} />
              </div>
              <div>
                <strong style={{ fontSize: "14px", color: "var(--charcoal)", display: "block" }}>
                  Recruiter Interview
                </strong>
                <span style={{ fontSize: "12px", color: "var(--muted)" }}>Oct 10, 2026 • Google Meet</span>
              </div>
            </div>
            <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "10px", background: "var(--green-bg)", color: "var(--green)" }}>
              Confirmed
            </span>
          </div>

          {/* Card 3: Evaluation & Rating */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "16px 20px",
              border: "1px solid var(--border-light)",
              boxShadow: "var(--shadow-xs)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "var(--cream)",
                  color: "var(--wine)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Award size={18} />
              </div>
              <div>
                <strong style={{ fontSize: "14px", color: "var(--charcoal)", display: "block" }}>
                  Faculty Performance Review
                </strong>
                <span style={{ fontSize: "12px", color: "var(--muted)" }}>Prof. Mehta • CS Department</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "2px", color: "var(--yellow)" }}>
              <Star size={14} fill="currentColor" />
              <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--charcoal)" }}>4.9</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
