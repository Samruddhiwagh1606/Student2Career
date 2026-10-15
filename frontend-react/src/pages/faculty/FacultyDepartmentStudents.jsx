import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { SearchBar } from "../../components/common/SearchBar";
import { LoadingState, ErrorState, EmptyState } from "../../components/common/FeedbackStates";
import {
  Users,
  GraduationCap,
  Award,
  Search,
  CheckCircle2,
  Clock,
  Briefcase,
  FileCheck,
  ShieldAlert,
} from "lucide-react";

export function FacultyDepartmentStudents() {
  const { faculty, user } = useAuth();
  const [students, setStudents] = useState([]);
  const [department, setDepartment] = useState("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "placed" | "seeking"

  useEffect(() => {
    loadStudents();
  }, [statusFilter]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (statusFilter !== "all") params.status_filter = statusFilter;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await api.getFacultyDepartmentStudents(params);
      setStudents(res.students || []);
      setDepartment(res.department || "Academic Department");
      setTotal(res.total || 0);
    } catch (err) {
      console.error("Department students fetch error:", err);
      setError("Unable to load department student records.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadStudents();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }} className="animate-fade-in">
      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1.2px",
              color: "var(--wine)",
              background: "var(--wine-subtle)",
              padding: "4px 10px",
              borderRadius: "14px",
              textTransform: "uppercase",
            }}
          >
            DEPARTMENT SCOPE: {department}
          </span>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--muted)",
              background: "var(--cream)",
              padding: "4px 10px",
              borderRadius: "14px",
            }}
          >
            READ-ONLY ADVISORY VIEW
          </span>
        </div>
        <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
          Department Student Directory
        </h1>
        <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px" }}>
          Enrolled students, official CGPA metrics, verified skills, and academic placement status in {department}.
        </p>
      </div>

      {/* Faculty Restrictions Notice */}
      <div
        style={{
          background: "var(--cream)",
          border: "1px solid var(--border)",
          borderLeft: "5px solid var(--wine)",
          borderRadius: "14px",
          padding: "16px 20px",
          fontSize: "13px",
          color: "var(--charcoal)",
          display: "flex",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <ShieldAlert size={20} color="var(--wine)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Faculty Department Scope Policy:</strong> This directory displays students belonging strictly to your assigned academic department ({department}). In accordance with institutional policy, faculty access is read-only. Modifying official student records, editing CGPA, or altering verification decisions is restricted to the T&P Cell.
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          {[
            { id: "all", label: "All Department Students" },
            { id: "placed", label: "Placed Students" },
            { id: "seeking", label: "Seeking Placement" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: statusFilter === tab.id ? 700 : 500,
                color: statusFilter === tab.id ? "#FFFFFF" : "var(--charcoal)",
                background: statusFilter === tab.id ? "var(--wine)" : "var(--warm-white)",
                border: "1px solid var(--border)",
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "10px" }}>
          <SearchBar
            placeholder="Search student name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingState message="Loading department students..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadStudents} />
      ) : students.length === 0 ? (
        <EmptyState title="No Students Found" description="No students matched your search criteria in this department." icon={Users} />
      ) : (
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "var(--warm-white)", borderBottom: "2px solid var(--border)" }}>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)" }}>Student Candidate</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)" }}>Email & Contact</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)" }}>CGPA (0.00-10.00)</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)" }}>Verified Skills</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)" }}>Placement Status</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)" }}>Profile Readiness</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st) => (
                  <tr key={st.student_id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "14px 18px" }}>
                      <strong style={{ color: "var(--charcoal)", fontSize: "14px", display: "block" }}>
                        {st.name}
                      </strong>
                      <span style={{ fontSize: "11.5px", color: "var(--muted)" }}>ID: #{st.student_id}</span>
                    </td>
                    <td style={{ padding: "14px 18px", color: "var(--muted)" }}>
                      <div>{st.email}</div>
                      <div style={{ fontSize: "12px" }}>Phone: {st.phone || "N/A"}</div>
                    </td>
                    <td style={{ padding: "14px 18px", fontWeight: 700, color: "var(--wine)" }}>
                      {st.cgpa} / 10.00
                    </td>
                    <td style={{ padding: "14px 18px" }}>
                      {st.skills && st.skills.length > 0 ? (
                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                          {st.skills.map((sk, idx) => (
                            <span
                              key={idx}
                              style={{
                                background: "var(--cream)",
                                color: "var(--terracotta)",
                                fontSize: "11px",
                                fontWeight: 700,
                                padding: "2px 8px",
                                borderRadius: "6px",
                              }}
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: "var(--muted-light)", fontSize: "12px" }}>No skills logged</span>
                      )}
                    </td>
                    <td style={{ padding: "14px 18px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 10px",
                          borderRadius: "14px",
                          fontSize: "12px",
                          fontWeight: 700,
                          background: st.placement_status.startsWith("Placed")
                            ? "var(--green-bg)"
                            : st.placement_status === "In Review"
                            ? "var(--yellow-bg)"
                            : "var(--cream)",
                          color: st.placement_status.startsWith("Placed")
                            ? "var(--green)"
                            : st.placement_status === "In Review"
                            ? "var(--yellow)"
                            : "var(--muted)",
                        }}
                      >
                        {st.placement_status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "60px", height: "6px", background: "var(--warm-white)", borderRadius: "3px", overflow: "hidden" }}>
                          <div
                            style={{
                              width: `${st.profile_completeness}%`,
                              height: "100%",
                              background: st.profile_completeness >= 80 ? "var(--green)" : "var(--wine)",
                            }}
                          />
                        </div>
                        <span style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--charcoal)" }}>
                          {st.profile_completeness}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
export default FacultyDepartmentStudents;
