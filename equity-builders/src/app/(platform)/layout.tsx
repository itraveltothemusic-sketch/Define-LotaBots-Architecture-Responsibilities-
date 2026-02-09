/**
 * Platform layout — wraps all authenticated pages with
 * the sidebar navigation and consistent structure.
 * 
 * All routes under (platform)/ share this layout, which provides:
 * - Fixed sidebar navigation
 * - Content area with proper offset
 * - Consistent spacing and scroll behavior
 */

import { Sidebar } from "@/components/layout/sidebar";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-navy-950">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
