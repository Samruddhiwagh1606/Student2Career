import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Modal } from "../../components/common/Modal";
import {
  Mail,
  Lock,
  User,
  Phone,
  GraduationCap,
  Award,
  AlertCircle,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Shield,
  Building2,
} from "lucide-react";

export function LoginPage() {
  const [activeTab, setActiveTab] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  // Registration state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regDept, setRegDept] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regGpa, setRegGpa] = useState("");
  const [regSubmitting, setRegSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    try {
      const user = await login(email.trim(), password);

      if (user.role === "student") {
        navigate("/student/dashboard");
      } else if (user.role === "faculty") {
        navigate("/faculty/dashboard");
      } else if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        setErrorMessage("Unknown user role.");
      }
    } catch (err) {
      setErrorMessage(err.message || "Invalid email or password.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!regName.trim() || !regEmail.trim() || !regPassword || !regDept.trim()) {
      setErrorMessage("Please fill all required registration fields.");
      return;
    }

    if (regPassword.length < 8) {
      setErrorMessage("Password must contain at least 8 characters.");
      return;
    }

    try {
      setRegSubmitting(true);
      const payload = {
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        department: regDept.trim(),
        phone: regPhone.trim() || null,
        gpa: regGpa ? Number(regGpa) : null,
      };

      const res = await api.registerStudent(payload);
      if (res.success || res.message) {
        setSuccessMessage("Student account registered successfully! You can now sign in.");
        setEmail(regEmail.trim());
        setPassword(regPassword);
        setActiveTab("login");
        setRegName("");
        setRegEmail("");
        setRegPassword("");
        setRegDept("");
        setRegPhone("");
        setRegGpa("");
      } else {
        throw new Error(res.message || "Registration failed.");
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to register student account.");
    } finally {
      setRegSubmitting(false);
    }
  };

  const handleDemoFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMessage("");
    setSuccessMessage("");
    setActiveTab("login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        background: "var(--warm-white)",
      }}
    >
      {/* LEFT COLUMN - VISUAL HERO & BRANDING (Visible on desktop/tablet) */}
      <div
        style={{
          flex: "1 1 55%",
          background: "linear-gradient(145deg, #7A1F3D 0%, #5B1730 65%, #3E1020 100%)",
          padding: "50px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
          color: "#FFFFFF",
        }}
        className="login-hero-panel"
      >
        {/* Subtle Decorative Geometric Background Elements */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(231, 111, 81, 0.18) 0%, rgba(122, 31, 61, 0) 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-100px",
            width: "420px",
            height: "420px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(244, 162, 97, 0.12) 0%, rgba(122, 31, 61, 0) 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Top Header / Branding Pill */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 16px",
              borderRadius: "30px",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                background: "var(--wine)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "12px",
                color: "#FFFFFF",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              C2C
            </div>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "1px",
                color: "var(--cream)",
                textTransform: "uppercase",
              }}
            >
              College2Career (C2C) Platform
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 3.5vw, 48px)",
              fontWeight: 700,
              lineHeight: 1.15,
              color: "#FFFFFF",
              marginBottom: "16px",
              maxWidth: "540px",
            }}
          >
            Launch Your Professional Journey with Confidence.
          </h1>

          <p
            style={{
              fontSize: "16px",
              color: "rgba(255, 247, 237, 0.85)",
              lineHeight: 1.6,
              maxWidth: "480px",
              marginBottom: "36px",
            }}
          >
            Bridge the gap between academic excellence and real-world career opportunities.
            Discover verified internships, track live application updates, and connect with faculty mentors.
          </p>
        </div>

        {/* Middle Visual Feature Cards */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            margin: "20px 0",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(12px)",
              borderRadius: "16px",
              padding: "20px",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              transition: "transform 0.2s ease",
            }}
            className="animate-fade-in"
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(231, 111, 81, 0.25)",
                color: "var(--terracotta-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "12px",
              }}
            >
              <Briefcase size={20} />
            </div>
            <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#FFFFFF", marginBottom: "4px" }}>
              Discover Internships
            </h4>
            <p style={{ fontSize: "12px", color: "rgba(255, 247, 237, 0.7)", lineHeight: 1.4 }}>
              Curated openings from verified industry recruitment partners.
            </p>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(12px)",
              borderRadius: "16px",
              padding: "20px",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              transition: "transform 0.2s ease",
            }}
            className="animate-fade-in"
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(244, 162, 97, 0.25)",
                color: "#F4A261",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "12px",
              }}
            >
              <TrendingUp size={20} />
            </div>
            <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#FFFFFF", marginBottom: "4px" }}>
              Track Applications
            </h4>
            <p style={{ fontSize: "12px", color: "rgba(255, 247, 237, 0.7)", lineHeight: 1.4 }}>
              Real-time 4-stage tracking from submission to final offer.
            </p>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(12px)",
              borderRadius: "16px",
              padding: "20px",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              transition: "transform 0.2s ease",
            }}
            className="animate-fade-in"
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(255, 247, 237, 0.2)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "12px",
              }}
            >
              <GraduationCap size={20} />
            </div>
            <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#FFFFFF", marginBottom: "4px" }}>
              Build Your Career
            </h4>
            <p style={{ fontSize: "12px", color: "rgba(255, 247, 237, 0.7)", lineHeight: 1.4 }}>
              Faculty evaluations, advisor reviews, and academic credit integration.
            </p>
          </div>
        </div>

        {/* Bottom Stats Footer */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            paddingTop: "24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            display: "flex",
            alignItems: "center",
            gap: "24px",
            fontSize: "13px",
            color: "rgba(255, 247, 237, 0.75)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <CheckCircle2 size={16} style={{ color: "var(--terracotta-light)" }} />
            <span>Verified Recruiting Partners</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <CheckCircle2 size={16} style={{ color: "var(--terracotta-light)" }} />
            <span>Direct Faculty Mentorship</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN - CLEAN LOGIN FORM CARD */}
      <div
        style={{
          flex: "1 1 45%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
          background: "var(--warm-white)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            background: "#FFFFFF",
            borderRadius: "24px",
            padding: "40px 36px",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--border)",
          }}
          className="animate-fade-in"
        >
          {/* Header */}
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "var(--wine)",
                color: "#FFFFFF",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "18px",
                marginBottom: "16px",
                boxShadow: "0 8px 20px rgba(122, 31, 61, 0.22)",
              }}
            >
              C2C
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "26px",
                fontWeight: 700,
                color: "var(--charcoal)",
                marginBottom: "6px",
              }}
            >
              {activeTab === "login" ? "Welcome Back" : "Student Registration"}
            </h2>
            <p style={{ fontSize: "13.5px", color: "var(--muted)", lineHeight: 1.5 }}>
              {activeTab === "login"
                ? "Sign in to manage your applications, interviews, and career profile."
                : "Create your student account to discover verified internships."}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              background: "var(--cream)",
              padding: "4px",
              borderRadius: "12px",
              marginBottom: "20px",
              border: "1px solid var(--border-light)",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: activeTab === "login" ? 700 : 500,
                color: activeTab === "login" ? "#FFFFFF" : "var(--charcoal)",
                background: activeTab === "login" ? "var(--wine)" : "transparent",
                transition: "all var(--transition-fast)",
                border: "none",
                cursor: "pointer",
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("register");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: activeTab === "register" ? 700 : 500,
                color: activeTab === "register" ? "#FFFFFF" : "var(--charcoal)",
                background: activeTab === "register" ? "var(--wine)" : "transparent",
                transition: "all var(--transition-fast)",
                border: "none",
                cursor: "pointer",
              }}
            >
              New Student? Register
            </button>
          </div>

          {/* Success Alert */}
          {successMessage && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                background: "var(--green-bg)",
                color: "var(--green)",
                fontSize: "13px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "20px",
                border: "1px solid rgba(64, 112, 80, 0.2)",
              }}
            >
              <CheckCircle2 size={16} />
              {successMessage}
            </div>
          )}

          {/* Error Alert */}
          {errorMessage && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                background: "var(--red-bg)",
                color: "var(--red)",
                fontSize: "13px",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "20px",
                border: "1px solid rgba(220, 38, 38, 0.2)",
              }}
            >
              <AlertCircle size={16} />
              {errorMessage}
            </div>
          )}

          {/* SIGN IN FORM */}
          {activeTab === "login" && (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <Input
                label="Email Address"
                type="email"
                placeholder="student@college.edu"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-6px" }}>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "2px 0",
                    fontSize: "12.5px",
                    color: "var(--wine)",
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Forgot Password?
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                icon={ArrowRight}
                style={{ width: "100%", marginTop: "4px" }}
              >
                Sign In to Portal
              </Button>
            </form>
          )}

          {/* STUDENT REGISTRATION FORM */}
          {activeTab === "register" && (
            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Input
                label="Full Name *"
                type="text"
                placeholder="e.g. Aarav Sharma"
                icon={User}
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
              />

              <Input
                label="College Email Address *"
                type="email"
                placeholder="aarav@college.edu"
                icon={Mail}
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />

              <Input
                label="Password (min 8 chars) *"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />

              <Input
                label="Academic Department *"
                type="text"
                placeholder="e.g. Computer Science"
                icon={GraduationCap}
                value={regDept}
                onChange={(e) => setRegDept(e.target.value)}
                required
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="10-digit number"
                  icon={Phone}
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                />

                <Input
                  label="Current CGPA (0.00 - 10.00)"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  placeholder="e.g. 8.50"
                  icon={Award}
                  value={regGpa}
                  onChange={(e) => setRegGpa(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={regSubmitting}
                icon={ArrowRight}
                style={{ width: "100%", marginTop: "4px" }}
              >
                Create Student Account
              </Button>
            </form>
          )}

          {/* Faculty Demo Helper Strip */}
          <div
            style={{
              marginTop: "24px",
              padding: "14px",
              background: "var(--cream)",
              borderRadius: "14px",
              border: "1px solid rgba(122, 31, 61, 0.12)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--wine)",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Sparkles size={12} /> Faculty Demo 1-Click Access:
              </span>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => handleDemoFill("student1@gmail.com", "Student@123")}
                style={{
                  flex: "1 1 auto",
                  padding: "6px 10px",
                  fontSize: "11.5px",
                  fontWeight: 600,
                  background: "#FFFFFF",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--charcoal)",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  transition: "all var(--transition-fast)",
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = "var(--wine)")}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                title="Fill student demo credentials"
              >
                <User size={12} style={{ color: "var(--wine)" }} /> Student
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill("faculty1@gmail.com", "Faculty@123")}
                style={{
                  flex: "1 1 auto",
                  padding: "6px 10px",
                  fontSize: "11.5px",
                  fontWeight: 600,
                  background: "#FFFFFF",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--charcoal)",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  transition: "all var(--transition-fast)",
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = "var(--wine)")}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                title="Fill faculty demo credentials"
              >
                <GraduationCap size={12} style={{ color: "var(--terracotta)" }} /> Faculty
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill("admin@college2career.edu", "Admin@123")}
                style={{
                  flex: "1 1 auto",
                  padding: "6px 10px",
                  fontSize: "11.5px",
                  fontWeight: 600,
                  background: "#FFFFFF",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--charcoal)",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  transition: "all var(--transition-fast)",
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = "var(--wine)")}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                title="Fill admin demo credentials"
              >
                <Shield size={12} style={{ color: "var(--wine)" }} /> Admin
              </button>
            </div>
          </div>

          {/* Institutional Footer */}
          <div
            style={{
              marginTop: "20px",
              paddingTop: "16px",
              borderTop: "1px solid var(--border)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              alignItems: "center",
            }}
          >
            <p style={{ fontSize: "11.5px", color: "var(--muted)", margin: 0 }}>
              College2Career (C2C) — College Internship & Placement Management System
            </p>
            <span style={{ fontSize: "11px", color: "var(--muted)", opacity: 0.8 }}>
              Corporate recruiting partners are managed strictly through the Institutional Placement Cell
            </span>
          </div>
        </div>
      </div>

      {/* FORGOT PASSWORD INFORMATIONAL MODAL */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Institutional Password Recovery Notice"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              padding: "16px",
              borderRadius: "12px",
              background: "var(--cream)",
              border: "1px solid rgba(122, 31, 61, 0.2)",
            }}
          >
            <Shield size={24} style={{ color: "var(--wine)", flexShrink: 0, marginTop: "2px" }} />
            <div>
              <h4 style={{ fontSize: "15px", fontWeight: 700, color: "var(--wine)", margin: "0 0 6px 0" }}>
                Self-Service Password Reset Unavailable
              </h4>
              <p style={{ fontSize: "13px", color: "var(--charcoal)", lineHeight: 1.5, margin: 0 }}>
                Automated self-service password recovery is currently not supported by the institutional backend. College2Career credentials are secure institutional accounts governed by academic placement administration.
              </p>
            </div>
          </div>

          <div style={{ fontSize: "13px", color: "var(--charcoal)", lineHeight: 1.6 }}>
            <strong>How to recover or reset your account:</strong>
            <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px" }}>
              <li style={{ marginBottom: "6px" }}>
                <strong>Students:</strong> Contact your designated Faculty Advisor or Department Placement Coordinator with your registered Student Roll Number.
              </li>
              <li style={{ marginBottom: "6px" }}>
                <strong>Faculty Members:</strong> Contact the College Placement Cell Administration to verify credentials.
              </li>
              <li>
                <strong>Administrators:</strong> Administrative credentials and account recoveries are managed directly via server database maintenance.
              </li>
            </ul>
          </div>

          <div
            style={{
              padding: "12px 14px",
              borderRadius: "10px",
              background: "var(--warm-white)",
              border: "1px solid var(--border-light)",
              fontSize: "12px",
              color: "var(--muted)",
              lineHeight: 1.5,
            }}
          >
            <strong>Technical Note:</strong> A cryptographically secure self-service password recovery workflow (including time-limited reset tokens, transactional SMTP verification emails, and salted hash rotation) requires dedicated backend service implementation and is scheduled for a future release.
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
            <Button variant="primary" onClick={() => setForgotModalOpen(false)}>
              Understood
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

