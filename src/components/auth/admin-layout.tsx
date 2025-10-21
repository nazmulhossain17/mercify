import { useState } from "react";
import { Sidebar } from "../admin/Sidebar";
import { Header } from "../admin/Header";
import Footer from "../Footer/Footer";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-green-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex flex-col flex-1 lg:ml-64 transition-all duration-300 relative z-10">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 lg:p-6">{children}</main>

        {/* ✅ Footer inside layout */}
        <Footer />
      </div>
    </div>
  );
}