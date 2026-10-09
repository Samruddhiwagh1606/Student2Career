import React from "react";
import { FolderOpen, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./Button";

export function EmptyState({
  title = "No items found",
  message = "There is no data to display right now.",
  actionLabel,
  onAction,
  icon: Icon = FolderOpen,
}) {
  return (
    <div
      style={{
        padding: "48px 24px",
        textAlign: "center",
        background: "#FFFFFF",
        borderRadius: "16px",
        border: "1px dashed var(--border)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "var(--cream)",
          color: "var(--wine)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={28} />
      </div>
      <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)" }}>{title}</h3>
      <p style={{ fontSize: "14px", color: "var(--muted)", maxWidth: "380px" }}>{message}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} style={{ marginTop: "8px" }}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function LoadingState({ message = "Loading data..." }) {
  return (
    <div
      style={{
        padding: "60px 24px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          border: "3px solid var(--cream)",
          borderTopColor: "var(--wine)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <span style={{ fontSize: "14px", color: "var(--muted)", fontWeight: 500 }}>
        {message}
      </span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export function ErrorState({
  title = "Unable to load data",
  message = "Please check your connection and try again.",
  onRetry,
}) {
  return (
    <div
      style={{
        padding: "40px 24px",
        textAlign: "center",
        background: "var(--red-bg)",
        borderRadius: "16px",
        border: "1px solid rgba(220, 38, 38, 0.2)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
      }}
    >
      <AlertCircle size={32} color="var(--red)" />
      <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--red)" }}>{title}</h3>
      <p style={{ fontSize: "13px", color: "var(--charcoal)", maxWidth: "400px" }}>{message}</p>
      {onRetry && (
        <Button variant="danger" size="sm" icon={RefreshCw} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
