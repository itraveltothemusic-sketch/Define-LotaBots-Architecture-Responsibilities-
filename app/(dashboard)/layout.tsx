/**
 * Dashboard Layout
 * 
 * Protected layout for authenticated users with navigation sidebar.
 */

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import DashboardNav from "@/components/layouts/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0">
        <DashboardNav userName={user.name} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
