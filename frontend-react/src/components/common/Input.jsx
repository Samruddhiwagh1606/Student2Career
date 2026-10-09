import React from "react";

export function Input({
  label,
  error,
  icon: Icon,
  type = "text",
  className = "",
  id,
  required = false,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--charcoal)",
          }}
        >
          {label} {required && <span style={{ color: "var(--terracotta)" }}>*</span>}
        </label>
      )}

      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {Icon && (
          <span
            style={{
              position: "absolute",
              left: "14px",
              color: "var(--muted)",
              display: "flex",
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
            <Icon size={18} />
          </span>
        )}

        <input
          id={inputId}
          type={type}
          required={required}
          style={{
            width: "100%",
            padding: Icon ? "11px 14px 11px 42px" : "11px 14px",
            fontSize: "14px",
            borderRadius: "10px",
            border: error ? "1.5px solid var(--red)" : "1px solid var(--border)",
            background: "var(--white)",
            color: "var(--charcoal)",
            outline: "none",
            transition: "border-color var(--transition-fast), box-shadow var(--transition-fast)",
          }}
          className={`input-field ${className}`}
          {...props}
        />
      </div>

      {error && (
        <span style={{ fontSize: "12px", color: "var(--red)", fontWeight: 500 }}>
          {error}
        </span>
      )}
    </div>
  );
}
