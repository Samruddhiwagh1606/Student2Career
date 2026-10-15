import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building2,
  Briefcase,
  FileText,
  Calendar,
  Award,
  BarChart3,
  MessageSquare,
  LogOut,
  X,
  CheckSquare,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function AdminSidebar({ isOpen, onClose }) {
  const { admin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navSections = [
    {
      title: "MAIN",
      items: [
        { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "MANAGEMENT",
      items: [
        { label: "Students", path: "/admin/students", icon: Users },
        { label: "Faculty", path: "/admin/faculty", icon: GraduationCap },
        { label: "Companies", path: "/admin/companies", icon: Building2 },
        { label: "Internships", path: "/admin/internships", icon: Briefcase },
      ],
    },
    {
      title: "PLACEMENT & APPROVALS",
      items: [
        { label: "Applications", path: "/admin/applications", icon: FileText },
        { label: "Off-Campus Queue", path: "/admin/off-campus", icon: CheckSquare },
        { label: "Interviews", path: "/admin/interviews", icon: Calendar },
        { label: "Evaluations", path: "/admin/evaluations", icon: Award },
      ],
    },
    {
      title: "ANALYTICS & AUDIT",
      items: [
        { label: "Reports", path: "/admin/reports", icon: BarChart3 },
        { label: "Audit Trail", path: "/admin/audit", icon: ShieldCheck },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        { label: "Feedback", path: "/admin/feedback", icon: MessageSquare },
      ],
    },
  ];

  const adminEmail = admin?.email || user?.email || "admin@college2career.com";

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
        {/* Brand Header */}
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
                Admin Portal
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: "6px",
              color: "var(--muted)",
              display: "none",
              border: "none",
              background: "transparent",
            }}
            className="mobile-close-btn"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Sections */}
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
                      <Icon size={18} style={{ color: "inherit" }} />
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
              A
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
                Administrator
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
                {adminEmail}
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
              transition: "background var(--transition-fast)",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>
    </>
  );
}

