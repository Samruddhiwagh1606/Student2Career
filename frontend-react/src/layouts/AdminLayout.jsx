import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "../components/navigation/AdminSidebar";
import { AdminTopbar } from "../components/navigation/AdminTopbar";

export function AdminLayout({ title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="main-content">
        <AdminTopbar onMenuToggle={() => setSidebarOpen(true)} title={title} />
        <main className="page-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
