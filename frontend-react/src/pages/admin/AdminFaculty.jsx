import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { SearchBar } from "../../components/common/SearchBar";
import { Modal } from "../../components/common/Modal";
import { LoadingState, ErrorState, EmptyState } from "../../components/common/FeedbackStates";
import {
  GraduationCap,
  PlusCircle,
  Edit,
  Trash2,
  Mail,
  Building2,
  Briefcase,
  FileText,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export function AdminFaculty() {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Create Faculty Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createDept, setCreateDept] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit Faculty Modal
  const [editFacultyObj, setEditFacultyObj] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editDept, setEditDept] = useState("");
  const [updating, setUpdating] = useState(false);

  const [actionSuccess, setActionSuccess] = useState("");
  const [modalError, setModalError] = useState("");

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getAllFacultyAdmin();
      const list = res?.faculty || [];
      setFacultyList(list);
    } catch (err) {
      console.error("Admin fetch faculty error:", err);
      setError("Unable to load faculty records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleCreateFaculty = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError("");
    setActionSuccess("");

    try {
      const payload = {
        name: createName.trim(),
        email: createEmail.trim(),
        password: createPassword,
        department: createDept.trim(),
      };

      const res = await api.createFacultyAdmin(payload);

      if (res.success || res.message) {
        setActionSuccess(`Faculty account for "${createName}" created successfully!`);
        setCreateModalOpen(false);
        setCreateName("");
        setCreateEmail("");
        setCreatePassword("");
        setCreateDept("");
        fetchFaculty();
      } else {
        throw new Error(res.message || "Failed to create faculty member.");
      }
    } catch (err) {
      console.error("Create faculty error:", err);
      setModalError(err.message || "Unable to create faculty member.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEdit = (item) => {
    setEditFacultyObj(item);
    setEditName(item.name || "");
    setEditEmail(item.email || "");
    setEditDept(item.department || "");
    setModalError("");
  };

  const handleUpdateFaculty = async (e) => {
    e.preventDefault();
    if (!editFacultyObj) return;

    setUpdating(true);
    setModalError("");
    setActionSuccess("");

    try {
      const payload = {
        name: editName.trim(),
        email: editEmail.trim(),
        department: editDept.trim(),
      };

      const res = await api.updateFacultyAdmin(editFacultyObj.faculty_id, payload);

      if (res.success || res.message) {
        setActionSuccess(`Faculty profile for "${editName}" updated successfully!`);
        setEditFacultyObj(null);
        fetchFaculty();
      } else {
        throw new Error(res.message || "Failed to update faculty profile.");
      }
    } catch (err) {
      console.error("Update faculty error:", err);
      setModalError(err.message || "Unable to update faculty profile.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteFaculty = async (facultyId, name) => {
    if (!window.confirm(`Are you sure you want to delete faculty record for Prof. "${name}"? Existing posted internships will be preserved.`)) return;

    try {
      setActionSuccess("");
      await api.deleteFacultyAdmin(facultyId);
      setActionSuccess(`Faculty account "${name}" deleted successfully.`);
      fetchFaculty();
    } catch (err) {
      alert(err.message || "Failed to delete faculty account.");
    }
  };

  const filteredFaculty = facultyList.filter(
    (f) =>
      (f.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.department || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingState message="Loading faculty advisor directory..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchFaculty} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="animate-fade-in">
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
            Faculty Directory & Accounts
          </h1>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px" }}>
            Register new academic mentors, manage department assignments, and track placement verification metrics.
          </p>
        </div>

        <Button variant="primary" icon={PlusCircle} onClick={() => { setCreateModalOpen(true); setModalError(""); }}>
          Register New Faculty
        </Button>
      </div>

      {actionSuccess && (
        <div style={{ padding: "12px 16px", borderRadius: "10px", background: "var(--green-bg)", color: "var(--green)", fontSize: "13px", fontWeight: 600 }}>
          {actionSuccess}
        </div>
      )}

      {/* Search Bar */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          padding: "16px 20px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-xs)",
        }}
      >
        <SearchBar
          placeholder="Filter by faculty name, email, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Faculty Data Table */}
      {filteredFaculty.length === 0 ? (
        <EmptyState
          title="No Faculty Members Found"
          message={searchTerm ? "No faculty accounts match your filter criteria." : "No faculty accounts currently registered."}
          actionText="Register Faculty Member"
          onAction={() => setCreateModalOpen(true)}
        />
      ) : (
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            border: "1px solid var(--border)",
            borderLeft: "5px solid var(--wine)",
            boxShadow: "var(--shadow-sm)",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13.5px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)", background: "var(--cream)" }}>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)", fontFamily: "var(--font-display)" }}>Faculty Name</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)", fontFamily: "var(--font-display)" }}>Email</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)", fontFamily: "var(--font-display)" }}>Department</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)", fontFamily: "var(--font-display)" }}>Posted Internships</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)", fontFamily: "var(--font-display)" }}>Applications Handled</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)", fontFamily: "var(--font-display)", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFaculty.map((item) => (
                  <tr key={item.faculty_id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "14px 18px", fontWeight: 600, color: "var(--charcoal)" }}>
                      Prof. {item.name}
                    </td>
                    <td style={{ padding: "14px 18px", color: "var(--muted)" }}>{item.email}</td>
                    <td style={{ padding: "14px 18px" }}>{item.department || "N/A"}</td>
                    <td style={{ padding: "14px 18px", fontWeight: 600, color: "var(--wine)" }}>{item.internship_count || 0}</td>
                    <td style={{ padding: "14px 18px", fontWeight: 600 }}>{item.application_count || 0}</td>
                    <td style={{ padding: "14px 18px", textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                        <Button size="sm" variant="outline" icon={Edit} onClick={() => handleOpenEdit(item)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          icon={Trash2}
                          style={{ color: "var(--red)", borderColor: "var(--red-bg)" }}
                          onClick={() => handleDeleteFaculty(item.faculty_id, item.name)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Faculty Modal */}
      {createModalOpen && (
        <Modal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          title="Register New Faculty Advisor"
        >
          <form onSubmit={handleCreateFaculty} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {modalError && (
              <div style={{ padding: "12px", borderRadius: "8px", background: "var(--red-bg)", color: "var(--red)", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
                <AlertCircle size={16} />
                {modalError}
              </div>
            )}

            <Input
              label="Full Name *"
              placeholder="e.g. Dr. Ramesh Kumar"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              required
            />

            <Input
              label="Email Address *"
              type="email"
              placeholder="faculty@college.edu"
              value={createEmail}
              onChange={(e) => setCreateEmail(e.target.value)}
              required
            />

            <Input
              label="Initial Password (min 8 chars with Uppercase, Lowercase, Number & Special Char) *"
              type="password"
              placeholder="••••••••"
              value={createPassword}
              onChange={(e) => setCreatePassword(e.target.value)}
              required
            />

            <Input
              label="Academic Department *"
              placeholder="e.g. Computer Science"
              value={createDept}
              onChange={(e) => setCreateDept(e.target.value)}
              required
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
              <Button variant="outline" type="button" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={submitting}>
                Register Faculty Account
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Faculty Modal */}
      {editFacultyObj && (
        <Modal
          isOpen={!!editFacultyObj}
          onClose={() => setEditFacultyObj(null)}
          title={`Edit Faculty Profile: Prof. ${editFacultyObj.name}`}
        >
          <form onSubmit={handleUpdateFaculty} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {modalError && (
              <div style={{ padding: "12px", borderRadius: "8px", background: "var(--red-bg)", color: "var(--red)", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
                <AlertCircle size={16} />
                {modalError}
              </div>
            )}

            <Input
              label="Full Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              required
            />

            <Input
              label="Department"
              value={editDept}
              onChange={(e) => setEditDept(e.target.value)}
              required
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
              <Button variant="outline" type="button" onClick={() => setEditFacultyObj(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={updating}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
