import React from "react";
import { Search, Filter } from "lucide-react";

export function SearchBar({
  value,
  onChange,
  placeholder = "Search internships, companies, domain...",
  domainFilter,
  onDomainChange,
  domains = [],
  className = "",
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        alignItems: "center",
        width: "100%",
      }}
      className={className}
    >
      <div style={{ flex: 1, minWidth: "260px", position: "relative" }}>
        <Search
          size={18}
          style={{
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--muted)",
          }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: "12px 16px 12px 42px",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            background: "#FFFFFF",
            fontSize: "14px",
            outline: "none",
          }}
        />
      </div>

      {onDomainChange && (
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <Filter
            size={16}
            style={{
              position: "absolute",
              left: "12px",
              color: "var(--muted)",
              pointerEvents: "none",
            }}
          />
          <select
            value={domainFilter}
            onChange={(e) => onDomainChange(e.target.value)}
            style={{
              padding: "12px 16px 12px 36px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "#FFFFFF",
              fontSize: "14px",
              color: "var(--charcoal)",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="all">All Domains</option>
            {domains.map((domain) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
