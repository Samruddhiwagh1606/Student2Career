import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/navigation/Sidebar";
import { Topbar } from "../components/navigation/Topbar";

export function StudentLayout({ title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="main-content">
        <Topbar onMenuToggle={() => setSidebarOpen(true)} title={title} />
        <main className="page-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
