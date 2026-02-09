/**
 * Dashboard Layout
 * 
 * Layout wrapper for all authenticated dashboard pages.
 * Includes sidebar navigation and header.
 */

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In production, this would fetch the authenticated user from session
  const user = {
    name: 'Demo User',
    role: 'Property Owner',
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header
          title="Intelligence Center"
          subtitle="Real-time oversight of all property operations"
          user={user}
        />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
