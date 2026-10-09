import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import {
  Mail,
  Lock,
  AlertCircle,
  Briefcase,
  TrendingUp,
  GraduationCap,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

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
                width: "24px",
                height: "24px",
                borderRadius: "6px",
                background: "var(--terracotta)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "11px",
                color: "#FFFFFF",
              }}
            >
              S2C
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
              Student2Career Platform
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
          <div style={{ marginBottom: "32px" }}>
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
                marginBottom: "20px",
                boxShadow: "0 8px 20px rgba(122, 31, 61, 0.22)",
              }}
            >
              S2C
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: 700,
                color: "var(--charcoal)",
                marginBottom: "8px",
              }}
            >
              Welcome Back
            </h2>
            <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.5 }}>
              Sign in to manage your applications, interviews, and career profile.
            </p>
          </div>

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

          {/* Login Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              icon={ArrowRight}
              style={{ width: "100%", marginTop: "8px" }}
            >
              Sign In to Portal
            </Button>
          </form>

          {/* Demo Login Helpers / Quick Hint */}
          <div
            style={{
              marginTop: "28px",
              paddingTop: "20px",
              borderTop: "1px solid var(--border)",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.5 }}>
              Student2Career — Official College Internship Management Portal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

