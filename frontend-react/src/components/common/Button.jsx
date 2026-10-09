import React from "react";

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  className = "",
  disabled = false,
  loading = false,
  type = "button",
  onClick,
  ...props
}) {
  const getVariantClass = () => {
    switch (variant) {
      case "primary":
        return "btn-primary";
      case "secondary":
        return "btn-secondary";
      case "outline":
        return "btn-outline";
      case "dark":
        return "btn-dark";
      case "danger":
        return "btn-danger";
      default:
        return "btn-primary";
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case "sm":
        return { padding: "8px 14px", fontSize: "13px", borderRadius: "8px" };
      case "lg":
        return { padding: "14px 28px", fontSize: "15px", borderRadius: "12px" };
      case "md":
      default:
        return { padding: "11px 22px", fontSize: "14px", borderRadius: "10px" };
    }
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        fontWeight: 600,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled || loading ? 0.65 : 1,
        transition: "all var(--transition-fast)",
        outline: "none",
        ...getSizeStyle(),
      }}
      className={`${getVariantClass()} ${className}`}
      {...props}
    >
      {loading ? (
        <span
          style={{
            width: "16px",
            height: "16px",
            border: "2px solid currentColor",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 0.6s linear infinite",
            display: "inline-block",
          }}
        />
      ) : Icon ? (
        <Icon size={size === "sm" ? 16 : size === "lg" ? 20 : 18} />
      ) : null}
      {children}
    </button>
  );
}
