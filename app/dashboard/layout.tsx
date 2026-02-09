"use client";

import { useState } from "react";
import { Toaster } from 'sonner';
import { Sidebar } from "@/components/navigation/sidebar";
import { Navbar } from "@/components/navigation/navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <Sidebar isOpen={open} />
    
      {/* Main */}
      <div className="flex-1">
        <Navbar onToggleSidebar={() => setOpen(!open)} />

        <main className="p-6">{children}</main>
        <Toaster position="top-right" richColors />
      </div>

    </div>
  );
}
