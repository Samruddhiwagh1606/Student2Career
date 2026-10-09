import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { InternshipCard } from "./InternshipCard";
import { Button } from "../common/Button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function InternshipDiscovery() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadInternships() {
      try {
        const res = await api.getInternships();
        const list = res?.internships || res || [];
        if (Array.isArray(list) && list.length > 0) {
          setInternships(list.slice(0, 3));
        } else {
          setInternships(fallbackInternships);
        }
      } catch (e) {
        setInternships(fallbackInternships);
      } finally {
        setLoading(false);
      }
    }

    loadInternships();
  }, []);

  return (
    <section
      id="internships"
      style={{
        padding: "80px 24px",
        maxWidth: "1280px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "40px",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1px",
              color: "var(--terracotta)",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            FEATURED OPPORTUNITIES
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "34px",
              fontWeight: 800,
              color: "var(--charcoal)",
              margin: 0,
            }}
          >
            Discover Opportunities That Move You Forward
          </h2>
        </div>

        <Button
          variant="outline"
          onClick={() => navigate("/login")}
          icon={ArrowRight}
        >
          Explore All Internships
        </Button>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
        }}
      >
        {internships.map((item, idx) => (
          <InternshipCard key={idx} internship={item} />
        ))}
      </div>
    </section>
  );
}

const fallbackInternships = [
  {
    title: "Software Engineering Intern",
    company_name: "TechCorp India",
    department: "Computer Science",
    location: "Bangalore (Hybrid)",
    stipend: "25,000",
    duration: "6 Months",
  },
  {
    title: "Data Analytics & ML Intern",
    company_name: "Analytics Hub",
    department: "Information Technology",
    location: "Pune / Remote",
    stipend: "20,000",
    duration: "3 Months",
  },
  {
    title: "Product Design & UX Intern",
    company_name: "CreativeStudio",
    department: "Design & Media",
    location: "Mumbai",
    stipend: "18,000",
    duration: "6 Months",
  },
];
