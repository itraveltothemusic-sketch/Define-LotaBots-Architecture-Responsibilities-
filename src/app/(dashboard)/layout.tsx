import { Sidebar } from "@/components/layout/sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";

/**
 * Dashboard Layout
 *
 * This wraps all authenticated routes. Provides:
 * - Persistent sidebar navigation
 * - Top header with search and user controls
 * - Content area that fills available space
 *
 * The sidebar is fixed-position, and content scrolls independently.
 * This creates the "command center" feel appropriate for a
 * forensic intelligence platform.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      {/* Main content area — offset by sidebar width */}
      <div className="ml-[260px] transition-all duration-300">
        <DashboardHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
