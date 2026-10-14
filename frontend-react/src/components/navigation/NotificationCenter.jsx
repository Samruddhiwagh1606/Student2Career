import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  X,
  Trash2,
  RotateCcw,
  Info,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const DEFAULT_DEMO_NOTIFICATIONS = {
  student: [
    {
      id: "notif-stud-1",
      title: "Welcome to College2Career",
      message: "Explore approved campus internships and review your skill match percentage across verified listings.",
      tag: "Demo Notice",
      timestamp: "Just now",
      is_read: false,
    },
    {
      id: "notif-stud-2",
      title: "Resume & Skill Match Profile",
      message: "Ensure your resume and departmental skill tags are updated before applying to campus opportunities.",
      tag: "Demo Notice",
      timestamp: "2 hours ago",
      is_read: false,
    },
    {
      id: "notif-stud-3",
      title: "External Listings Transparency",
      message: "External internships direct to institutional partner portals with clear supervisory verification.",
      tag: "Demo Notice",
      timestamp: "Yesterday",
      is_read: true,
    },
  ],
  faculty: [
    {
      id: "notif-fac-1",
      title: "Welcome to Faculty Portal",
      message: "Review student applications, approve submitted opportunities, and manage interview schedules.",
      tag: "Demo Notice",
      timestamp: "Just now",
      is_read: false,
    },
    {
      id: "notif-fac-2",
      title: "Interview Scheduling Reminder",
      message: "Provide meeting locations or video links at least 24 hours prior to scheduled interviews.",
      tag: "Demo Notice",
      timestamp: "Yesterday",
      is_read: false,
    },
    {
      id: "notif-fac-3",
      title: "Departmental Evaluation Rubric",
      message: "Departmental evaluations require midterm and final scoring rubric completion for student cohorts.",
      tag: "Demo Notice",
      timestamp: "2 days ago",
      is_read: true,
    },
  ],
  admin: [
    {
      id: "notif-adm-1",
      title: "Welcome to Administrator Console",
      message: "Supervise campus-wide internship reviews, student cohorts, faculty accounts, and partner companies.",
      tag: "Demo Notice",
      timestamp: "Just now",
      is_read: false,
    },
    {
      id: "notif-adm-2",
      title: "Corporate Partner Verification Policy",
      message: "Company accounts remain institutionally supervised and require admin verification before postings appear.",
      tag: "Demo Notice",
      timestamp: "Yesterday",
      is_read: false,
    },
    {
      id: "notif-adm-3",
      title: "System Role Integrity Audit",
      message: "Role-based boundary checks confirm separate views for students, academic faculty, and system administrators.",
      tag: "Demo Notice",
      timestamp: "3 days ago",
      is_read: true,
    },
  ],
};

export function NotificationCenter({ role }) {
  const { user } = useAuth();
  const currentRole = role || user?.role || "student";
  const userId = user?.user_id || "demo";
  const storageKey = `c2c_notifications_${currentRole}_${userId}`;

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("all"); // "all" | "unread"
  const [notifications, setNotifications] = useState([]);
  const containerRef = useRef(null);

  // Initialize or load notifications from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setNotifications(JSON.parse(stored));
      } else {
        const defaults = DEFAULT_DEMO_NOTIFICATIONS[currentRole] || DEFAULT_DEMO_NOTIFICATIONS.student;
        setNotifications(defaults);
        localStorage.setItem(storageKey, JSON.stringify(defaults));
      }
    } catch (e) {
      console.warn("Unable to load notifications from localStorage:", e);
      const defaults = DEFAULT_DEMO_NOTIFICATIONS[currentRole] || DEFAULT_DEMO_NOTIFICATIONS.student;
      setNotifications(defaults);
    }
  }, [storageKey, currentRole]);

  // Persist helper
  const saveNotifications = (updatedList) => {
    setNotifications(updatedList);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedList));
    } catch (e) {
      console.warn("Unable to save notifications to localStorage:", e);
    }
  };

  // Close dropdown on click outside or Escape
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAsRead = (id) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, is_read: true } : n
    );
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, is_read: true }));
    saveNotifications(updated);
  };

  const dismissNotification = (id) => {
    const updated = notifications.filter((n) => n.id !== id);
    saveNotifications(updated);
  };

  const resetDemoData = () => {
    const defaults = DEFAULT_DEMO_NOTIFICATIONS[currentRole] || DEFAULT_DEMO_NOTIFICATIONS.student;
    saveNotifications(defaults);
  };

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.is_read)
      : notifications;

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          position: "relative",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: isOpen ? "var(--cream)" : "var(--warm-white)",
          color: isOpen ? "var(--wine)" : "var(--charcoal)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: isOpen ? "1px solid var(--wine-subtle)" : "1px solid transparent",
          cursor: "pointer",
          transition: "all var(--transition-fast)",
        }}
        title={`Notifications (${unreadCount} unread)`}
        aria-label={`Notifications (${unreadCount} unread)`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-2px",
              right: "-2px",
              minWidth: "18px",
              height: "18px",
              padding: "0 5px",
              borderRadius: "999px",
              background: "var(--terracotta)",
              color: "#FFFFFF",
              fontSize: "11px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 6px rgba(231, 111, 81, 0.4)",
              border: "2px solid var(--white)",
              lineHeight: 1,
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Floating Notification Panel */}
      {isOpen && (
        <div
          role="region"
          aria-label="Notification Center"
          style={{
            position: "absolute",
            top: "calc(100% + 12px)",
            right: 0,
            width: "380px",
            maxWidth: "calc(100vw - 32px)",
            background: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid var(--border)",
            boxShadow:
              "0 18px 45px rgba(122, 31, 61, 0.12), 0 4px 16px rgba(36, 33, 36, 0.08)",
            zIndex: 999,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            animation: "fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 20px 12px",
              borderBottom: "1px solid var(--border)",
              background: "var(--warm-white)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "var(--charcoal)",
                    margin: 0,
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      background: "var(--terracotta-subtle)",
                      color: "var(--terracotta)",
                      padding: "2px 7px",
                      borderRadius: "10px",
                    }}
                  >
                    {unreadCount} unread
                  </span>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "var(--wine)",
                      background: "transparent",
                      border: "none",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "background var(--transition-fast)",
                    }}
                    title="Mark all as read"
                  >
                    <CheckCheck size={14} />
                    <span>Mark all read</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "28px",
                    height: "28px",
                    borderRadius: "6px",
                    color: "var(--muted)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                  title="Close notifications"
                  aria-label="Close notifications"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setFilter("all")}
                style={{
                  padding: "4px 10px",
                  fontSize: "12px",
                  fontWeight: 600,
                  borderRadius: "6px",
                  cursor: "pointer",
                  background: filter === "all" ? "var(--wine)" : "transparent",
                  color: filter === "all" ? "#FFFFFF" : "var(--muted)",
                  border: "none",
                  transition: "all var(--transition-fast)",
                }}
              >
                All ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("unread")}
                style={{
                  padding: "4px 10px",
                  fontSize: "12px",
                  fontWeight: 600,
                  borderRadius: "6px",
                  cursor: "pointer",
                  background: filter === "unread" ? "var(--wine)" : "transparent",
                  color: filter === "unread" ? "#FFFFFF" : "var(--muted)",
                  border: "none",
                  transition: "all var(--transition-fast)",
                }}
              >
                Unread ({unreadCount})
              </button>
            </div>
          </div>

          {/* List Area */}
          <div
            style={{
              maxHeight: "340px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {filteredNotifications.length === 0 ? (
              <div
                style={{
                  padding: "40px 20px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "var(--cream)",
                    color: "var(--wine)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BellOff size={22} />
                </div>
                <h4
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "var(--charcoal)",
                    margin: 0,
                  }}
                >
                  All Caught Up
                </h4>
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--muted)",
                    margin: 0,
                    maxWidth: "260px",
                    lineHeight: 1.4,
                  }}
                >
                  {filter === "unread"
                    ? "You have marked all notifications as read."
                    : "No notifications currently present."}
                </p>
                <button
                  type="button"
                  onClick={resetDemoData}
                  style={{
                    marginTop: "8px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--wine)",
                    background: "var(--wine-subtle)",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  <RotateCcw size={12} />
                  <span>Restore Sample Notifications</span>
                </button>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const isUnread = !notif.is_read;
                return (
                  <div
                    key={notif.id}
                    onClick={() => {
                      if (isUnread) markAsRead(notif.id);
                    }}
                    style={{
                      padding: "14px 18px",
                      borderBottom: "1px solid var(--border)",
                      background: isUnread ? "rgba(255, 247, 237, 0.75)" : "#FFFFFF",
                      borderLeft: isUnread
                        ? "4px solid var(--terracotta)"
                        : "4px solid transparent",
                      cursor: isUnread ? "pointer" : "default",
                      transition: "background var(--transition-fast)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    {/* Top Row: Tag, Timestamp, Unread Dot */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 700,
                            letterSpacing: "0.03em",
                            textTransform: "uppercase",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            background: "var(--wine-subtle)",
                            color: "var(--wine)",
                          }}
                        >
                          {notif.tag || "Demo Notice"}
                        </span>
                        <span style={{ fontSize: "11px", color: "var(--muted)" }}>
                          {notif.timestamp}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {isUnread && (
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: "var(--terracotta)",
                            }}
                            title="Unread notification"
                          />
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissNotification(notif.id);
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--muted-light)",
                            cursor: "pointer",
                            padding: "2px",
                            display: "flex",
                            alignItems: "center",
                            borderRadius: "4px",
                          }}
                          title="Dismiss notification"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <h5
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        fontWeight: isUnread ? 700 : 600,
                        color: isUnread ? "var(--charcoal)" : "var(--muted)",
                        lineHeight: 1.35,
                      }}
                    >
                      {notif.title}
                    </h5>

                    {/* Message */}
                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        color: isUnread ? "var(--charcoal)" : "var(--muted)",
                        lineHeight: 1.45,
                      }}
                    >
                      {notif.message}
                    </p>

                    {/* Bottom Action for Unread */}
                    {isUnread && (
                      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2px" }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notif.id);
                          }}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "11px",
                            fontWeight: 600,
                            color: "var(--wine)",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding: "2px 6px",
                            borderRadius: "4px",
                          }}
                        >
                          <Check size={12} />
                          <span>Mark read</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Notice */}
          <div
            style={{
              padding: "10px 16px",
              background: "var(--warm-white)",
              borderTop: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "11px",
              color: "var(--muted)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Info size={13} color="var(--wine)" />
              <span>Demo notifications (Browser localStorage)</span>
            </div>
            <button
              type="button"
              onClick={resetDemoData}
              style={{
                background: "none",
                border: "none",
                color: "var(--wine)",
                fontWeight: 600,
                fontSize: "11px",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              title="Reset sample notices"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
