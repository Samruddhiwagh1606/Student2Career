import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Button } from "../common/Button";
import { Building2, MapPin, Clock, ArrowRight, ShieldCheck } from "lucide-react";

export function InternshipPreview() {
  const [internships, setInternships] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadOpportunities() {
      try {
        const res = await api.getInternships();
        const list = res?.internships || res || [];
        if (Array.isArray(list) && list.length > 0) {
          setInternships(list.slice(0, 4));
        } else {
          setInternships(fallbackList);
        }
      } catch (e) {
        setInternships(fallbackList);
      }
    }
    loadOpportunities();
  }, []);

  return (
    <section
      id="internships"
      style={{
        padding: "90px 24px",
        maxWidth: "1280px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "48px",
          flexWrap: "wrap",
          gap: "24px",
        }}
      >
        <div>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1px",
              color: "var(--terracotta)",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "8px",
            }}
          >
            FEATURED OPPORTUNITIES
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "36px",
              fontWeight: 800,
              color: "var(--charcoal)",
              margin: 0,
            }}
          >
            Opportunities Built Around Your Future.
          </h2>
          <p style={{ fontSize: "16px", color: "var(--muted)", marginTop: "8px", maxWidth: "560px" }}>
            Find internships that align with your skills, interests and career goals.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => navigate("/login")}
          icon={ArrowRight}
          style={{ borderColor: "var(--wine)", color: "var(--wine)", fontWeight: 600 }}
        >
          Explore All Opportunities
        </Button>
      </div>

      {/* Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
        }}
      >
        {internships.map((item, idx) => {
          const company = item.company_name || item.company || "TechCorp Innovations";
          const title = item.title || "Software Developer Intern";
          const stipend = item.stipend ? `₹${item.stipend}/mo` : "Stipend Disclosed";
          const location = item.location || "Bangalore / Hybrid";
          const duration = item.duration || "3 - 6 Months";
          const domain = item.department || item.domain || "Computer Science";

          return (
            <div
              key={idx}
              style={{
                background: "#FFFFFF",
                borderRadius: "20px",
                padding: "24px",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "20px",
              }}
              className="card-hover"
            >
              <div>
                {/* Header Avatar & Verified Tag */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: "var(--wine)",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "16px",
                    }}
                  >
                    {company.charAt(0).toUpperCase()}
                  </div>

                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "var(--wine)",
                      background: "var(--cream)",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      border: "1px solid rgba(122, 31, 61, 0.12)",
                    }}
                  >
                    <ShieldCheck size={13} /> Verified
                  </span>
                </div>

                {/* Role & Company */}
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--charcoal)", marginBottom: "6px" }}>
                  {title}
                </h3>

                <div style={{ fontSize: "14px", color: "var(--muted)", display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
                  <Building2 size={15} />
                  {company}
                </div>

                {/* Meta Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "var(--charcoal)",
                      background: "var(--warm-white)",
                      padding: "4px 10px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-light)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <MapPin size={13} style={{ color: "var(--terracotta)" }} />
                    {location}
                  </span>

                  <span
                    style={{
                      fontSize: "12px",
                      color: "var(--charcoal)",
                      background: "var(--warm-white)",
                      padding: "4px 10px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-light)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Clock size={13} style={{ color: "var(--muted)" }} />
                    {duration}
                  </span>
                </div>
              </div>

              {/* Bottom Stipend & Action */}
              <div
                style={{
                  paddingTop: "16px",
                  borderTop: "1px solid var(--border-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <span style={{ fontSize: "15px", fontWeight: 800, color: "var(--wine)", display: "block" }}>
                    {stipend}
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--muted)", fontWeight: 500 }}>
                    {domain}
                  </span>
                </div>

                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => navigate("/login")}
                  icon={ArrowRight}
                >
                  View Role
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

const fallbackList = [
  {
    title: "Software Developer Intern",
    company_name: "TechNova Solutions",
    department: "Computer Science",
    location: "Pune (Hybrid)",
    stipend: "20,000",
    duration: "3 Months",
  },
  {
    title: "Java Backend Developer Intern",
    company_name: "FinEdge Technologies",
    department: "Information Technology",
    location: "Bangalore / Remote",
    stipend: "25,000",
    duration: "6 Months",
  },
  {
    title: "Data Analytics Intern",
    company_name: "CloudNest Labs",
    department: "Data Science",
    location: "Mumbai / Hybrid",
    stipend: "22,000",
    duration: "3 Months",
  },
  {
    title: "Product Design & UX Intern",
    company_name: "CreativeStudio",
    department: "Design & Media",
    location: "Delhi NCR",
    stipend: "18,000",
    duration: "6 Months",
  },
];
