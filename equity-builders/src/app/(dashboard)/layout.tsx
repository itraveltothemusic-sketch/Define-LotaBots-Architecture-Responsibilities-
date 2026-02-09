/**
 * Dashboard Layout
 * 
 * The authenticated layout wrapping all dashboard pages.
 * Provides the sidebar navigation, header, and main content area.
 * 
 * Architecture decision: This is a client-side layout because
 * the sidebar has interactive state (collapse/expand). In production,
 * auth verification would happen in middleware before this renders.
 */
"use client";

import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar />
      <div className="pl-[260px] transition-all duration-300">
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
