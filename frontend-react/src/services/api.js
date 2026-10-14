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
};
