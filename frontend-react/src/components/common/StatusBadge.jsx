import React from "react";

export function StatusBadge({ status = "pending" }) {
  const normalized = (status || "pending").toLowerCase();

  const getBadgeStyle = () => {
    switch (normalized) {
      case "accepted":
      case "approved":
        return {
          background: "var(--green-bg)",
          color: "var(--green)",
          border: "1px solid rgba(95, 128, 104, 0.25)",
        };
      case "shortlisted":
      case "faculty_verified":
        return {
          background: "var(--yellow-bg)",
          color: "var(--yellow)",
          border: "1px solid rgba(217, 119, 6, 0.25)",
        };
      case "rejected":
      case "withdrawn":
        return {
          background: "var(--red-bg)",
          color: "var(--red)",
          border: "1px solid rgba(220, 38, 38, 0.25)",
        };
      case "pending":
      default:
        return {
          background: "var(--cream)",
          color: "var(--wine)",
          border: "1px solid rgba(122, 31, 61, 0.2)",
        };
    }
  };

  const formatText = (text) => {
    return text.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: 600,
        letterSpacing: "0.2px",
        whiteSpace: "nowrap",
        ...getBadgeStyle(),
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: getBadgeStyle().color,
        }}
      />
      {formatText(normalized)}
    </span>
  );
}
