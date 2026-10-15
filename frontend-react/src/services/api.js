// =====================================================
// STUDENT2CAREER - CENTRALIZED API CLIENT
// Maps directly to Express backend endpoints on PORT 5000
// =====================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = { ...options.headers };

  // Do not set Content-Type if sending FormData (e.g. file upload)
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // Automatically attach Bearer token if user is authenticated
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      const token = user?.token;
      if (token && !headers["Authorization"]) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (e) {}
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // =====================================================
  // AUTHENTICATION
  // =====================================================
  login: (email, password) =>
    request("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  registerStudent: (studentData) =>
    request("/students/register", {
      method: "POST",
      body: JSON.stringify(studentData),
    }),

  // =====================================================
  // STUDENTS
  // =====================================================
  updateStudentProfile: (studentId, data) =>
    request(`/students/${studentId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  uploadResume: (studentId, formData) =>
    request(`/students/${studentId}/resume`, {
      method: "PATCH",
      body: formData,
    }),

  getAllStudentsAdmin: () => request("/students/admin/all"),
  
  getStudentAdmin: (studentId) => request(`/students/admin/${studentId}`),
  
  updateStudentAdmin: (studentId, data) =>
    request(`/students/admin/${studentId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
    
  deleteStudentAdmin: (studentId) =>
    request(`/students/admin/${studentId}`, {
      method: "DELETE",
    }),

  // =====================================================
  // FACULTY (ADMIN CRUD)
  // =====================================================
  getAllFacultyAdmin: () => request("/faculty/admin/all"),

  createFacultyAdmin: (data) =>
    request("/faculty/admin", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateFacultyAdmin: (facultyId, data) =>
    request(`/faculty/admin/${facultyId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteFacultyAdmin: (facultyId) =>
    request(`/faculty/admin/${facultyId}`, {
      method: "DELETE",
    }),

  // =====================================================
  // INTERNSHIPS & SKILL MATCHING (PHASE 6A)
  // =====================================================
  getInternships: () => request("/internships"),
  
  getRecommendedInternships: (studentId) =>
    request(`/internships/recommendations/${studentId}`),

  getSkillMatch: (internshipId, studentId) =>
    request(`/internships/${internshipId}/skill-match/${studentId}`),
  
  getInternshipsAdminReview: () => request("/internships/admin/review"),

  postInternship: (data) =>
    request("/internships", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateInternshipStatus: (id, status) =>
    request(`/internships/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  getCompanies: () => request("/companies"),

  createCompany: (data) =>
    request("/companies", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateCompany: (companyId, data) =>
    request(`/companies/${companyId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteCompany: (companyId) =>
    request(`/companies/${companyId}`, {
      method: "DELETE",
    }),

  getCompanyDetails: (companyId) => request(`/companies/${companyId}`),

  getCompanyEligibleApplications: (companyId) =>
    request(`/company-feedback/company/${companyId}/eligible`),

  getFacultyDetails: (facultyId) => request(`/faculty/admin/${facultyId}`),

  // =====================================================
  // APPLICATIONS
  // =====================================================
  applyInternship: (formData) =>
    request("/applications", {
      method: "POST",
      body: formData,
    }),

  getStudentApplications: (studentId) =>
    request(`/applications/student/${studentId}`),

  getFacultyApplications: (facultyId) =>
    request(`/applications/faculty/${facultyId}`),

  updateApplicationStatus: (applicationId, faculty_id, status) =>
    request(`/applications/faculty/${applicationId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ faculty_id, status }),
    }),

  withdrawApplication: (applicationId, student_id) =>
    request(`/applications/${applicationId}/withdraw`, {
      method: "PATCH",
      body: JSON.stringify({ student_id }),
    }),

  // =====================================================
  // INTERVIEWS
  // =====================================================
  getStudentInterviews: (studentId) =>
    request(`/interviews/student/${studentId}`),

  getFacultyInterviews: (facultyId) =>
    request(`/interviews/faculty/${facultyId}`),

  scheduleInterview: (data) =>
    request("/interviews", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateInterview: (interviewId, data) =>
    request(`/interviews/${interviewId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  cancelInterview: (interviewId, faculty_id) =>
    request(`/interviews/${interviewId}`, {
      method: "DELETE",
      body: JSON.stringify({ faculty_id }),
    }),

  // =====================================================
  // EVALUATIONS
  // =====================================================
  getStudentEvaluations: (studentId) =>
    request(`/evaluations/student/${studentId}`),

  getFacultyEvaluations: (facultyId) =>
    request(`/evaluations/faculty/${facultyId}`),

  submitEvaluation: (data) =>
    request("/evaluations", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // =====================================================
  // REPORTS & ANALYTICS
  // =====================================================
  getFacultyReports: (facultyId) =>
    request(`/faculty/${facultyId}/reports`),

  getAdminReports: () => request("/admin/reports"),

  // =====================================================
  // FEEDBACK
  // =====================================================
  submitFeedback: (data) =>
    request("/feedback", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  submitSystemFeedback: (data) =>
    request("/system-feedback", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getCompanyFeedbackSummary: (companyId) =>
    request(`/feedback/company/${companyId}/summary`),

  // =====================================================
  // MODULE 2: STUDENT OFF-CAMPUS WORKFLOW
  // =====================================================
  submitOffCampus: (formData) =>
    request("/off-campus", {
      method: "POST",
      body: formData,
    }),

  getMyOffCampus: () => request("/off-campus/my"),

  resubmitOffCampus: (id, formData) =>
    request(`/off-campus/${id}/resubmit`, {
      method: "PUT",
      body: formData,
    }),

  getOffCampusHistory: (id) => request(`/off-campus/${id}/history`),

  getEvidenceUrl: (filename) => `${API_BASE_URL}/off-campus/evidence/${filename}`,

  // =====================================================
  // MODULE 3: ADMIN / T&P APPROVALS, AUDIT & EXPORT
  // =====================================================
  getOffCampusQueue: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/off-campus/admin/queue${q ? `?${q}` : ""}`);
  },

  decideOffCampus: (id, data) =>
    request(`/off-campus/admin/${id}/decision`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getAdminAuditLogs: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/admin/audit${q ? `?${q}` : ""}`);
  },

  exportAdminReports: async () => {
    const userStr = localStorage.getItem("user");
    const token = userStr ? JSON.parse(userStr)?.token : null;
    const response = await fetch(`${API_BASE_URL}/admin/reports/export`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) {
      throw new Error("Failed to export reconciled placement report.");
    }
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `C2C_Reconciled_Placement_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },

  // =====================================================
  // MODULE 4: FACULTY READ-ONLY DEPARTMENT SCOPE
  // =====================================================
  getFacultyDepartmentSummary: () => request("/faculty/department/summary"),

  getFacultyDepartmentStudents: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/faculty/department/students${q ? `?${q}` : ""}`);
  },

  getFacultyDepartmentReadiness: () => request("/faculty/department/readiness"),
};
