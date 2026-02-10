import type { ReactNode } from "react";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { getNavigationForRole } from "@/lib/auth/permissions";
import { requireSession } from "@/lib/auth/session";

import { logoutAction } from "./actions";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await requireSession();
  const navigation = getNavigationForRole(session.role);

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <Sidebar user={session} navItems={navigation} />
      <div className="flex-1">
        <Topbar user={session} logoutAction={logoutAction} />
        <main className="px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
