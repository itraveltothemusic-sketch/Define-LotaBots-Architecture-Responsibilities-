/**
 * Dashboard Layout
 * 
 * Main authenticated layout with sidebar and header
 */

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/config';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={session.user.role} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={session.user} />
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
