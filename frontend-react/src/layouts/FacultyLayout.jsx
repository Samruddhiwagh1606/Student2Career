import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { FacultySidebar } from "../components/navigation/FacultySidebar";
import { FacultyTopbar } from "../components/navigation/FacultyTopbar";

export function FacultyLayout({ title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      <FacultySidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="main-content">
        <FacultyTopbar onMenuToggle={() => setSidebarOpen(true)} title={title} />
        <main className="page-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
