import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { User, Mail, Phone, GraduationCap, Award, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export function StudentProfile() {
  const { student, updateStudentSession } = useAuth();

  const [name, setName] = useState(student?.name || "");
  const [phone, setPhone] = useState(student?.phone || "");
  const [department, setDepartment] = useState(student?.department || "");
  const [gpa, setGpa] = useState(student?.gpa || "");

  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!student?.student_id) return;

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const updateData = {
        name: name.trim(),
        phone: phone.trim(),
        department: department.trim(),
        gpa: gpa ? Number(gpa) : null,
      };

      const res = await api.updateStudentProfile(student.student_id, updateData);

      if (res.success || res.message) {
        updateStudentSession(updateData);
        setSuccessMsg("Profile updated successfully!");
      } else {
        throw new Error(res.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setErrorMsg(err.message || "Unable to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadResume = async (e) => {
    e.preventDefault();
    if (!resumeFile || !student?.student_id) return;

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);

      const res = await api.uploadResume(student.student_id, formData);

      if (res.success || res.message) {
        updateStudentSession({ resume: res.resume || resumeFile.name });
        setSuccessMsg("Resume uploaded successfully!");
        setResumeFile(null);
      } else {
        throw new Error(res.message || "Failed to upload resume.");
      }
    } catch (err) {
      console.error("Resume upload error:", err);
      setErrorMsg(err.message || "Unable to upload resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", maxWidth: "760px" }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
          My Student Profile
        </h1>
        <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px" }}>
          Manage your personal information, department details, and uploaded resume.
        </p>
      </div>

      {successMsg && (
        <div style={{ padding: "14px 16px", borderRadius: "10px", background: "var(--green-bg)", color: "var(--green)", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
          <CheckCircle2 size={18} />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div style={{ padding: "14px 16px", borderRadius: "10px", background: "var(--red-bg)", color: "var(--red)", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
          <AlertCircle size={18} />
          {errorMsg}
        </div>
      )}

      {/* Main Profile Form */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "20px",
          padding: "32px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", marginBottom: "20px" }}>
          Personal Details
        </h3>

        <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Input
            label="Full Name"
            icon={User}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Email Address (read-only)"
            icon={Mail}
            value={student?.email || ""}
            disabled
          />

          <Input
            label="Phone Number"
            icon={Phone}
            placeholder="10-digit mobile number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Input
            label="Department"
            icon={GraduationCap}
            placeholder="e.g. Computer Science"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />

          <Input
            label="GPA (0.0 to 4.0)"
            icon={Award}
            type="number"
            step="0.01"
            min="0"
            max="4"
            value={gpa}
            onChange={(e) => setGpa(e.target.value)}
          />

          <Button type="submit" variant="primary" loading={loading} style={{ alignSelf: "flex-start", marginTop: "8px" }}>
            Save Profile Changes
          </Button>
        </form>
      </div>

      {/* Resume Section */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "20px",
          padding: "32px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--charcoal)", marginBottom: "12px" }}>
          Resume Document
        </h3>

        {student?.resume ? (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "var(--cream)", padding: "14px 18px", borderRadius: "12px", marginBottom: "20px" }}>
            <FileText size={20} style={{ color: "var(--wine)" }} />
            <div>
              <strong style={{ fontSize: "14px", color: "var(--charcoal)", display: "block" }}>
                Current Resume File Attached
              </strong>
              <span style={{ fontSize: "12px", color: "var(--muted)" }}>{student.resume}</span>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "20px" }}>
            No resume uploaded yet. Upload a PDF resume to attach automatically to your applications.
          </p>
        )}

        <form onSubmit={handleUploadResume} style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            required
            onChange={(e) => setResumeFile(e.target.files[0])}
            style={{ fontSize: "13px", color: "var(--muted)" }}
          />

          <Button type="submit" variant="secondary" size="sm" loading={loading} disabled={!resumeFile}>
            Upload New Resume
          </Button>
        </form>
      </div>
    </div>
  );
}
