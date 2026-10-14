import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { SearchBar } from "../../components/common/SearchBar";
import { Modal } from "../../components/common/Modal";
import { LoadingState, ErrorState, EmptyState } from "../../components/common/FeedbackStates";
import {
  Building2,
  PlusCircle,
  Edit,
  Trash2,
  MapPin,
  Mail,
  User,
  AlertCircle,
  Briefcase,
  ExternalLink,
} from "lucide-react";

export function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Create Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [regNum, setRegNum] = useState("");
  const [location, setLocation] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit Modal State
  const [editCompanyObj, setEditCompanyObj] = useState(null);
  const [editName, setEditName] = useState("");
  const [editRegNum, setEditRegNum] = useState("");
  const [editLoc, setEditLoc] = useState("");
  const [editContactPerson, setEditContactPerson] = useState("");
  const [editContactEmail, setEditContactEmail] = useState("");
  const [updating, setUpdating] = useState(false);

  const [actionSuccess, setActionSuccess] = useState("");
  const [modalError, setModalError] = useState("");

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getCompanies();
      const list = res?.companies || [];
      setCompanies(list);
    } catch (err) {
      console.error("Admin fetch companies error:", err);
      setError("Unable to load partner recruiting companies directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError("");
    setActionSuccess("");

    try {
      const payload = {
        name: name.trim(),
        registration_number: regNum.trim(),
        location: location.trim(),
        contact_person: contactPerson.trim(),
        contact_email: contactEmail.trim(),
      };

      const res = await api.createCompany(payload);

      if (res.success || res.message) {
        setActionSuccess(`Company "${name}" registered successfully!`);
        setCreateModalOpen(false);
        setName("");
        setRegNum("");
        setLocation("");
        setContactPerson("");
        setContactEmail("");
        fetchCompanies();
      } else {
        throw new Error(res.message || "Failed to create company.");
      }
    } catch (err) {
      console.error("Create company error:", err);
      setModalError(err.message || "Unable to register company.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEdit = (c) => {
    setEditCompanyObj(c);
    setEditName(c.name || "");
    setEditRegNum(c.registration_number || "");
    setEditLoc(c.location || "");
    setEditContactPerson(c.contact_person || "");
    setEditContactEmail(c.contact_email || "");
    setModalError("");
  };

  const handleUpdateCompany = async (e) => {
    e.preventDefault();
    if (!editCompanyObj) return;

    setUpdating(true);
    setModalError("");
    setActionSuccess("");

    try {
      const payload = {
        name: editName.trim(),
        registration_number: editRegNum.trim(),
        location: editLoc.trim(),
        contact_person: editContactPerson.trim(),
        contact_email: editContactEmail.trim(),
      };

      const res = await api.updateCompany(editCompanyObj.company_id, payload);

      if (res.success || res.message) {
        setActionSuccess(`Company details for "${editName}" updated successfully!`);
        setEditCompanyObj(null);
        fetchCompanies();
      } else {
        throw new Error(res.message || "Failed to update company.");
      }
    } catch (err) {
      console.error("Update company error:", err);
      setModalError(err.message || "Unable to update company details.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteCompany = async (companyId, companyName) => {
    if (!window.confirm(`Are you sure you want to remove company "${companyName}" from the placement portal?`)) return;

    try {
      setActionSuccess("");
      await api.deleteCompany(companyId);
      setActionSuccess(`Company "${companyName}" deleted successfully.`);
      fetchCompanies();
    } catch (err) {
      alert(err.message || "Failed to delete company.");
    }
  };

  const filteredCompanies = companies.filter(
    (c) =>
      (c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.registration_number || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.location || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingState message="Loading partner companies directory..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchCompanies} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="animate-fade-in">
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--charcoal)", margin: 0, fontFamily: "var(--font-display)" }}>
            Partner Companies Directory
          </h1>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px" }}>
            Manage registered corporate recruiting partners and company contact persons.
          </p>
        </div>

        <Button variant="primary" icon={PlusCircle} onClick={() => { setCreateModalOpen(true); setModalError(""); }}>
          Register New Company
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
          placeholder="Filter by company name, registration number, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Companies Table */}
      {filteredCompanies.length === 0 ? (
        <EmptyState
          title="No Companies Registered"
          message={searchTerm ? "No companies match your search criteria." : "No partner companies registered yet."}
          actionText="Register Partner Company"
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
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)", fontFamily: "var(--font-display)" }}>Company Name</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)", fontFamily: "var(--font-display)" }}>Reg. Number</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)", fontFamily: "var(--font-display)" }}>Location</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)", fontFamily: "var(--font-display)" }}>Contact Person</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)", fontFamily: "var(--font-display)" }}>Internships</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--charcoal)", fontFamily: "var(--font-display)", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((c) => (
                  <tr key={c.company_id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "14px 18px", fontWeight: 600, color: "var(--charcoal)" }}>
                      {c.name}
                    </td>
                    <td style={{ padding: "14px 18px", color: "var(--muted)" }}>{c.registration_number}</td>
                    <td style={{ padding: "14px 18px" }}>{c.location || "Remote / Various"}</td>
                    <td style={{ padding: "14px 18px" }}>
                      <div>{c.contact_person || "N/A"}</div>
                      <span style={{ fontSize: "11px", color: "var(--muted)" }}>{c.contact_email || ""}</span>
                    </td>
                    <td style={{ padding: "14px 18px", fontWeight: 700, color: "var(--wine)" }}>{c.internship_count || 0}</td>
                    <td style={{ padding: "14px 18px", textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", alignItems: "center" }}>
                        <Link to={`/company/${c.company_id}`} style={{ textDecoration: "none" }}>
                          <Button size="sm" variant="secondary" icon={ExternalLink}>
                            Open Recruiter Workspace
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline" icon={Edit} onClick={() => handleOpenEdit(c)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          icon={Trash2}
                          style={{ color: "var(--red)", borderColor: "var(--red-bg)" }}
                          onClick={() => handleDeleteCompany(c.company_id, c.name)}
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

      {/* Create Company Modal */}
      {createModalOpen && (
        <Modal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          title="Register Partner Recruiting Company"
        >
          <form onSubmit={handleCreateCompany} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {modalError && (
              <div style={{ padding: "12px", borderRadius: "8px", background: "var(--red-bg)", color: "var(--red)", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
                <AlertCircle size={16} />
                {modalError}
              </div>
            )}

            <Input
              label="Company Name *"
              placeholder="e.g. TechNova Solutions Pvt Ltd"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Registration / CIN Number *"
              placeholder="e.g. REG-2026-8899"
              value={regNum}
              onChange={(e) => setRegNum(e.target.value)}
              required
            />

            <Input
              label="Company Location / HQ"
              placeholder="e.g. Bangalore, KA"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <Input
              label="Primary HR / Contact Person"
              placeholder="e.g. Ms. Ananya Sen"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
            />

            <Input
              label="Contact Email"
              type="email"
              placeholder="hr@technova.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
              <Button variant="outline" type="button" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={submitting}>
                Register Company
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Company Modal */}
      {editCompanyObj && (
        <Modal
          isOpen={!!editCompanyObj}
          onClose={() => setEditCompanyObj(null)}
          title={`Edit Company: ${editCompanyObj.name}`}
        >
          <form onSubmit={handleUpdateCompany} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {modalError && (
              <div style={{ padding: "12px", borderRadius: "8px", background: "var(--red-bg)", color: "var(--red)", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
                <AlertCircle size={16} />
                {modalError}
              </div>
            )}

            <Input
              label="Company Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />

            <Input
              label="Registration Number"
              value={editRegNum}
              onChange={(e) => setEditRegNum(e.target.value)}
              required
            />

            <Input
              label="Location"
              value={editLoc}
              onChange={(e) => setEditLoc(e.target.value)}
            />

            <Input
              label="Contact Person"
              value={editContactPerson}
              onChange={(e) => setEditContactPerson(e.target.value)}
            />

            <Input
              label="Contact Email"
              type="email"
              value={editContactEmail}
              onChange={(e) => setEditContactEmail(e.target.value)}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
              <Button variant="outline" type="button" onClick={() => setEditCompanyObj(null)}>
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
