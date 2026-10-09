import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  FileText,
  Calendar,
  Clock,
  Award,
  BarChart3,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function FacultySidebar({ isOpen, onClose }) {
  const { faculty, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navSections = [
    {
      title: "OVERVIEW",
      items: [
        { label: "Dashboard", path: "/faculty/dashboard", icon: LayoutDashboard },
        { label: "Placement Reports", path: "/faculty/reports", icon: BarChart3 },
      ],
    },
    {
      title: "INTERNSHIPS",
      items: [
        { label: "My Internships", path: "/faculty/internships", icon: Briefcase },
        { label: "Post Internship", path: "/faculty/post-internship", icon: PlusCircle },
      ],
    },
    {
      title: "STUDENT SELECTION",
      items: [
        { label: "Applications", path: "/faculty/applications", icon: FileText },
        { label: "Interviews", path: "/faculty/interviews", icon: Calendar },
        { label: "Schedule Interview", path: "/faculty/schedule-interview", icon: Clock },
        { label: "Student Evaluations", path: "/faculty/evaluations", icon: Award },
      ],
    },
  ];

  const facultyName = faculty?.name || user?.profile?.name || "Faculty Advisor";
  const facultyDept = faculty?.department || user?.profile?.department || "Academic Dept";

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(36, 33, 36, 0.4)",
            zIndex: 90,
          }}
          className="mobile-backdrop"
        />
      )}

      <aside
        style={{
          width: "260px",
          background: "var(--warm-white)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          position: "sticky",
          top: 0,
          zIndex: 100,
          transition: "transform var(--transition-normal)",
        }}
        className={`sidebar ${isOpen ? "open" : ""}`}
      >
        {/* Brand */}
        <div
          style={{
            padding: "24px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "var(--wine)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "15px",
                boxShadow: "0 4px 12px rgba(122, 31, 61, 0.22)",
              }}
            >
              C2C
            </div>
            <div>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "17px",
                  color: "var(--charcoal)",
                  display: "block",
                  lineHeight: 1.1,
                }}
              >
                College2Career
              </span>
              <span style={{ fontSize: "11px", color: "var(--wine)", fontWeight: 700 }}>
                Faculty Portal
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: "6px",
              color: "var(--muted)",
              display: "none",
            }}
            className="mobile-close-btn"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation links */}
        <div style={{ flex: 1, padding: "20px 16px", overflowY: "auto" }}>
          {navSections.map((section, sIdx) => (
            <div key={sIdx} style={{ marginBottom: "24px" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "1.2px",
                  color: "var(--muted)",
                  marginBottom: "10px",
                  paddingLeft: "12px",
                }}
              >
                {section.title}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {section.items.map((item, iIdx) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={iIdx}
                      to={item.path}
                      onClick={onClose}
                      style={({ isActive }) => ({
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        fontSize: "14px",
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? "var(--wine)" : "var(--charcoal)",
                        background: isActive ? "var(--cream)" : "transparent",
                        borderLeft: isActive ? "3px solid var(--wine)" : "3px solid transparent",
                        transition: "all var(--transition-fast)",
                      })}
                    >
                      <Icon size={18} />
                      {item.label}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Footer & Logout */}
        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--cream)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "var(--wine)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "14px",
                flexShrink: 0,
              }}
            >
              {facultyName.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "var(--charcoal)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Prof. {facultyName}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--muted)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {facultyDept}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Logout"
            style={{
              color: "var(--wine)",
              padding: "8px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>
    </>
  );
}
