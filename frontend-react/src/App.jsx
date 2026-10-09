import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LandingPage } from "./pages/public/LandingPage";
import { LoginPage } from "./pages/auth/LoginPage";

// Student Portal Imports
import { StudentLayout } from "./layouts/StudentLayout";
import { StudentDashboard } from "./pages/student/StudentDashboard";
import { FindInternships } from "./pages/student/FindInternships";
import { StudentApplications } from "./pages/student/StudentApplications";
import { StudentInterviews } from "./pages/student/StudentInterviews";
import { StudentEvaluations } from "./pages/student/StudentEvaluations";
import { StudentFeedback } from "./pages/student/StudentFeedback";
import { StudentProfile } from "./pages/student/StudentProfile";

// Faculty Portal Imports
import { FacultyLayout } from "./layouts/FacultyLayout";
import { FacultyDashboard } from "./pages/faculty/FacultyDashboard";
import { FacultyInternships } from "./pages/faculty/FacultyInternships";
import { PostInternship } from "./pages/faculty/PostInternship";
import { FacultyApplications } from "./pages/faculty/FacultyApplications";
import { FacultyInterviews } from "./pages/faculty/FacultyInterviews";
import { ScheduleInterview } from "./pages/faculty/ScheduleInterview";
import { FacultyEvaluations } from "./pages/faculty/FacultyEvaluations";
import { FacultyReports } from "./pages/faculty/FacultyReports";

// Admin Portal Imports
import { AdminLayout } from "./layouts/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminStudents } from "./pages/admin/AdminStudents";
import { AdminFaculty } from "./pages/admin/AdminFaculty";
import { AdminCompanies } from "./pages/admin/AdminCompanies";
import { AdminInternships } from "./pages/admin/AdminInternships";
import { AdminApplications } from "./pages/admin/AdminApplications";
import { AdminInterviews } from "./pages/admin/AdminInterviews";
import { AdminEvaluations } from "./pages/admin/AdminEvaluations";
import { AdminReports } from "./pages/admin/AdminReports";
import { AdminFeedback } from "./pages/admin/AdminFeedback";

// Protected Route Wrapper for Student Role
function ProtectedStudentRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "student") {
    if (user.role === "faculty") return <Navigate to="/faculty/dashboard" replace />;
    if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}

// Protected Route Wrapper for Faculty Role
function ProtectedFacultyRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "faculty") {
    if (user.role === "student") return <Navigate to="/student/dashboard" replace />;
    if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}

// Protected Route Wrapper for Admin Role
function ProtectedAdminRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    if (user.role === "student") return <Navigate to="/student/dashboard" replace />;
    if (user.role === "faculty") return <Navigate to="/faculty/dashboard" replace />;
  }

  return children;
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Dedicated Auth Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Student Protected Routes */}
          <Route
            path="/student"
            element={
              <ProtectedStudentRoute>
                <StudentLayout title="Student Dashboard" />
              </ProtectedStudentRoute>
            }
          >
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="internships" element={<FindInternships />} />
            <Route path="applications" element={<StudentApplications />} />
            <Route path="interviews" element={<StudentInterviews />} />
            <Route path="evaluations" element={<StudentEvaluations />} />
            <Route path="feedback" element={<StudentFeedback />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>

          {/* Faculty Protected Routes */}
          <Route
            path="/faculty"
            element={
              <ProtectedFacultyRoute>
                <FacultyLayout title="Faculty Placement Portal" />
              </ProtectedFacultyRoute>
            }
          >
            <Route path="dashboard" element={<FacultyDashboard />} />
            <Route path="internships" element={<FacultyInternships />} />
            <Route path="post-internship" element={<PostInternship />} />
            <Route path="applications" element={<FacultyApplications />} />
            <Route path="interviews" element={<FacultyInterviews />} />
            <Route path="schedule-interview" element={<ScheduleInterview />} />
            <Route path="evaluations" element={<FacultyEvaluations />} />
            <Route path="reports" element={<FacultyReports />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout title="System Administration" />
              </ProtectedAdminRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="faculty" element={<AdminFaculty />} />
            <Route path="companies" element={<AdminCompanies />} />
            <Route path="internships" element={<AdminInternships />} />
            <Route path="applications" element={<AdminApplications />} />
            <Route path="interviews" element={<AdminInterviews />} />
            <Route path="evaluations" element={<AdminEvaluations />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="feedback" element={<AdminFeedback />} />
          </Route>

          {/* Default Redirection */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
