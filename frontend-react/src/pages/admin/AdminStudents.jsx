import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { SearchBar } from "../../components/common/SearchBar";
import { Modal } from "../../components/common/Modal";
import { LoadingState, ErrorState, EmptyState } from "../../components/common/FeedbackStates";
import {
  Users,
  Search,
  Edit,
  Trash2,
  FileText,
  GraduationCap,
  Award,
  Phone,
  Mail,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Edit Modal State
  const [editStudent, setEditStudent] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editDept, setEditDept] = useState("");
  const [editGpa, setEditGpa] = useState("");
  const [saving, setSaving] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getAllStudentsAdmin();
      const list = res?.students || [];
      setStudents(list);
    } catch (err) {
      console.error("Admin fetch students error:", err);
      setError("Unable to load student database records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleOpenEdit = (student) => {
    setEditStudent(student);
    setEditName(student.name || "");
    setEditPhone(student.phone || "");
    setEditDept(student.department || "");
    setEditGpa(student.gpa || "");
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    if (!editStudent) return;

    try {
      setSaving(true);
      setActionSuccess("");
      const payload = {
        name: editName.trim(),
        phone: editPhone.trim(),
        department: editDept.trim(),
        gpa: editGpa ? Number(editGpa) : null,
      };

      const res = await api.updateStudentAdmin(editStudent.student_id, payload);

      if (res.success || res.message) {
        setActionSuccess(`Student account "${editName}" updated successfully!`);
        setEditStudent(null);
        fetchStudents();
      } else {
        alert(res.message || "Failed to update student.");
      }
    } catch (err) {
      alert(err.message || "Unable to update student record.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStudent = async (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to delete student record for "${studentName}"? This action cannot be undone.`)) return;

    try {
      setActionSuccess("");
      await api.deleteStudentAdmin(studentId);
      setActionSuccess(`Student record "${studentName}" deleted successfully.`);
      fetchStudents();
    } catch (err) {
      alert(err.message || "Failed to delete student record.");
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      (s.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.department || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  if (loading) {
    return <LoadingState message="Loading student account registry..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchStudents} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="animate-fade-in">
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
            Student Registry & Management
          </h1>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px" }}>
            View, edit, or remove student accounts and verify academic credentials.
          </p>
        </div>
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
          placeholder="Search by student name, email, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Data Table */}
      {filteredStudents.length === 0 ? (
        <EmptyState
          title="No Student Records Found"
          message={searchTerm ? "No student accounts match your filter criteria." : "No student accounts currently exist."}
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
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)", fontFamily: "var(--font-display)" }}>Student Name</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)", fontFamily: "var(--font-display)" }}>Email</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)", fontFamily: "var(--font-display)" }}>Department</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)", fontFamily: "var(--font-display)" }}>CGPA</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)", fontFamily: "var(--font-display)" }}>Resume</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)", fontFamily: "var(--font-display)" }}>Applications</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)", fontFamily: "var(--font-display)", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((item) => (
                  <tr key={item.student_id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "14px 18px", fontWeight: 600, color: "var(--charcoal)" }}>
                      {item.name}
                      <span style={{ fontSize: "11px", color: "var(--muted)", display: "block" }}>Phone: {item.phone || "N/A"}</span>
                    </td>
                    <td style={{ padding: "14px 18px", color: "var(--muted)" }}>{item.email}</td>
                    <td style={{ padding: "14px 18px" }}>{item.department || "N/A"}</td>
                    <td style={{ padding: "14px 18px", fontWeight: 700, color: "var(--wine)" }}>
                      {item.gpa ? `${Number(item.gpa).toFixed(2)} / 10.00` : "N/A"}
                    </td>
                    <td style={{ padding: "14px 18px" }}>
                      {item.resume ? (
                        <a
                          href={`http://localhost:5000${item.resume}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "var(--wine)", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}
                        >
                          <FileText size={14} /> PDF
                        </a>
                      ) : (
                        <span style={{ color: "var(--muted-light)" }}>None</span>
                      )}
                    </td>
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
                          onClick={() => handleDeleteStudent(item.student_id, item.name)}
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

      {/* Edit Student Modal */}
      {editStudent && (
        <Modal
          isOpen={!!editStudent}
          onClose={() => setEditStudent(null)}
          title={`Edit Student: ${editStudent.name}`}
        >
          <form onSubmit={handleSaveStudent} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <Input
              label="Full Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />

            <Input
              label="Phone Number"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
            />

            <Input
              label="Department"
              value={editDept}
              onChange={(e) => setEditDept(e.target.value)}
              required
            />

            <Input
              label="CGPA (0.00 to 10.00)"
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={editGpa}
              onChange={(e) => setEditGpa(e.target.value)}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
              <Button variant="outline" type="button" onClick={() => setEditStudent(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={saving}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
