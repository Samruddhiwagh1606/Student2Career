import React from "react";

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeType = "positive",
  variant = "default", // "default" | "cream" | "dark" | "accent"
}) {
  const isDark = variant === "dark";
  const isCream = variant === "cream";
  const isAccent = variant === "accent";

  let bg = "var(--warm-white)";
  let borderColor = "var(--border)";
  let borderLeft = "none";
  let titleColor = "var(--muted)";
  let valueColor = "var(--charcoal)";
  let iconBg = "var(--cream)";
  let iconColor = "var(--wine)";

  if (isCream) {
    bg = "var(--cream)";
    borderColor = "rgba(122, 31, 61, 0.15)";
    borderLeft = "4px solid var(--wine)";
    iconBg = "rgba(122, 31, 61, 0.1)";
  } else if (isDark) {
    bg = "var(--charcoal)";
    borderColor = "transparent";
    borderLeft = "4px solid var(--terracotta)";
    titleColor = "var(--terracotta-light)";
    valueColor = "#FFFFFF";
    iconBg = "rgba(231, 111, 81, 0.18)";
    iconColor = "var(--terracotta-light)";
  } else if (isAccent) {
    bg = "linear-gradient(135deg, var(--warm-white) 0%, var(--cream) 100%)";
    borderLeft = "4px solid var(--terracotta)";
  }

  return (
    <div
      style={{
        background: bg,
        borderRadius: "16px",
        padding: "24px",
        border: `1px solid ${borderColor}`,
        borderLeft: borderLeft !== "none" ? borderLeft : `1px solid ${borderColor}`,
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        position: "relative",
        overflow: "hidden",
        transition: "transform var(--transition-normal), box-shadow var(--transition-normal)",
      }}
      className="stat-card"
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: titleColor,
          }}
        >
          {title}
        </span>

        {Icon && (
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: iconBg,
              color: iconColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon size={20} />
          </div>
        )}
      </div>

      <div style={{ fontSize: "36px", fontWeight: 700, color: valueColor, lineHeight: 1 }}>
        {value !== undefined && value !== null ? value : 0}
      </div>

      {subtitle && (
        <div style={{ fontSize: "13px", color: isDark ? "var(--cream)" : "var(--muted)", opacity: isDark ? 0.9 : 1, display: "flex", alignItems: "center", gap: "6px" }}>
          {badgeText && (
            <span
              style={{
                color: isDark ? "var(--terracotta-light)" : badgeType === "positive" ? "var(--green)" : "var(--terracotta)",
                fontWeight: 600,
              }}
            >
              {badgeText}
            </span>
          )}
          {subtitle}
        </div>
      )}
    </div>
  );
}

