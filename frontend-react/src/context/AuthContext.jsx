import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [student, setStudent] = useState(() => {
    const storedStudent = localStorage.getItem("student");
    return storedStudent ? JSON.parse(storedStudent) : null;
  });

  const [faculty, setFaculty] = useState(() => {
    const storedFaculty = localStorage.getItem("faculty");
    return storedFaculty ? JSON.parse(storedFaculty) : null;
  });

  const [admin, setAdmin] = useState(() => {
    const storedAdmin = localStorage.getItem("admin");
    return storedAdmin ? JSON.parse(storedAdmin) : null;
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.login(email, password);
      
      if (!data.success || !data.user) {
        throw new Error(data.message || "Login failed.");
      }

      const userData = {
        ...data.user,
        token: data.token || data.user.token,
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      if (userData.role === "student") {
        const studentObj = {
          ...userData.profile,
          email: userData.email,
          role: userData.role,
          user_id: userData.user_id,
        };
        setStudent(studentObj);
        localStorage.setItem("student", JSON.stringify(studentObj));
      } else if (userData.role === "faculty") {
        const facultyObj = {
          ...userData.profile,
          email: userData.email,
          role: userData.role,
          user_id: userData.user_id,
        };
        setFaculty(facultyObj);
        localStorage.setItem("faculty", JSON.stringify(facultyObj));
      } else if (userData.role === "admin") {
        const adminObj = {
          user_id: userData.user_id,
          email: userData.email,
          role: userData.role,
        };
        setAdmin(adminObj);
        localStorage.setItem("admin", JSON.stringify(adminObj));
      }

      return userData;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setStudent(null);
    setFaculty(null);
    setAdmin(null);
    localStorage.removeItem("user");
    localStorage.removeItem("student");
    localStorage.removeItem("faculty");
    localStorage.removeItem("admin");
  };

  const updateStudentSession = (updatedProfile) => {
    if (student) {
      const newStudent = { ...student, ...updatedProfile };
      setStudent(newStudent);
      localStorage.setItem("student", JSON.stringify(newStudent));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        student,
        faculty,
        admin,
        loading,
        login,
        logout,
        updateStudentSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
