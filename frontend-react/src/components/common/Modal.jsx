import React, { useEffect } from "react";
import { X } from "lucide-react";

export function Modal({ isOpen, onClose, title, children, maxWidth = "520px" }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "rgba(36, 33, 36, 0.55)",
        backdropFilter: "blur(4px)",
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#FFFFFF",
          width: "100%",
          maxWidth,
          borderRadius: "20px",
          padding: "28px",
          boxShadow: "var(--shadow-lg)",
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          {title && (
            <h3 style={{ fontSize: "20px", fontWeight: 700, color: "var(--charcoal)" }}>
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            style={{
              padding: "6px",
              borderRadius: "50%",
              color: "var(--muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background var(--transition-fast)",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
