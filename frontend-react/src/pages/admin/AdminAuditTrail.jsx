import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { LoadingState, ErrorState, EmptyState } from "../../components/common/FeedbackStates";
import { ShieldCheck, History, Filter, User, Calendar, RefreshCw } from "lucide-react";
import { Button } from "../../components/common/Button";

export function AdminAuditTrail() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [entityFilter, setEntityFilter] = useState("");

  useEffect(() => {
    loadLogs();
  }, [entityFilter]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (entityFilter) params.entity_type = entityFilter;
      const res = await api.getAdminAuditLogs(params);
      setLogs(res.logs || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error("Audit load error:", err);
      setError("Unable to load institutional audit trail.");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (ts) => {
    if (!ts) return "N/A";
    const d = new Date(ts);
    return isNaN(d.getTime()) ? ts : d.toLocaleString("en-IN", { dateStyle: "short", timeStyle: "medium" });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "1.2px",
                color: "var(--wine)",
                background: "var(--wine-subtle)",
                padding: "4px 10px",
                borderRadius: "14px",
                textTransform: "uppercase",
              }}
            >
              MODULE 3: COMPLIANCE & GOVERNANCE
            </span>
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
            Institutional Audit Trail
          </h1>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px" }}>
            Append-only historical register of all official verification decisions, status transitions, and administrative updates.
          </p>
        </div>

        <Button variant="outline" size="sm" icon={RefreshCw} onClick={loadLogs}>
          Refresh Trail
        </Button>
      </div>

      {/* Security Rule Card */}
      <div
        style={{
          background: "var(--cream)",
          border: "1px solid var(--border)",
          borderLeft: "5px solid var(--wine)",
          borderRadius: "14px",
          padding: "16px 20px",
          fontSize: "13px",
          color: "var(--charcoal)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <ShieldCheck size={20} color="var(--wine)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Append-Only Integrity:</strong> Audit log records are created server-side inside atomic database transactions. Neither regular users nor standard APIs can edit, alter, or delete historical records.
        </span>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--charcoal)" }}>Entity Filter:</span>
        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          style={{
            padding: "8px 14px",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            fontSize: "13.5px",
            background: "#FFFFFF",
            fontFamily: "inherit",
          }}
        >
          <option value="">All Entities ({total} entries)</option>
          <option value="off_campus_submission">Off-Campus Submissions</option>
          <option value="application">Campus Applications</option>
          <option value="student">Student Accounts</option>
        </select>
      </div>

      {/* Logs Table */}
      {loading ? (
        <LoadingState message="Loading institutional audit logs..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadLogs} />
      ) : logs.length === 0 ? (
        <EmptyState title="No Audit Records Found" description="No audit transitions recorded yet." icon={History} />
      ) : (
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "var(--warm-white)", borderBottom: "1px solid var(--border)" }}>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)" }}>Log ID</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)" }}>Timestamp</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)" }}>Actor</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)" }}>Entity</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)" }}>Action</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)" }}>Transition</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)" }}>Reason / Notes</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.log_id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "14px 18px", color: "var(--muted)", fontWeight: 700 }}>
                      #{log.log_id}
                    </td>
                    <td style={{ padding: "14px 18px", color: "var(--charcoal)", whiteSpace: "nowrap" }}>
                      {formatDateTime(log.created_at)}
                    </td>
                    <td style={{ padding: "14px 18px" }}>
                      <strong style={{ color: "var(--charcoal)", display: "block" }}>{log.actor_email}</strong>
                      <span style={{ fontSize: "11px", color: "var(--wine)", textTransform: "uppercase", fontWeight: 700 }}>
                        {log.actor_role}
                      </span>
                    </td>
                    <td style={{ padding: "14px 18px" }}>
                      <span style={{ textTransform: "capitalize", fontWeight: 600 }}>
                        {log.entity_type.replace(/_/g, " ")}
                      </span>
                      <span style={{ fontSize: "11px", color: "var(--muted)", display: "block" }}>ID: {log.entity_id}</span>
                    </td>
                    <td style={{ padding: "14px 18px", fontWeight: 700, color: "var(--wine)", textTransform: "uppercase" }}>
                      {log.action}
                    </td>
                    <td style={{ padding: "14px 18px", whiteSpace: "nowrap" }}>
                      {log.previous_status || "—"} → <strong style={{ color: "var(--charcoal)" }}>{log.new_status || "—"}</strong>
                    </td>
                    <td style={{ padding: "14px 18px", color: "var(--charcoal)", maxWidth: "300px" }}>
                      {log.comments || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminAuditTrail;
