import type { ReactNode } from "react";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import type { ModuleDefinition } from "@/lib/auth/permissions";
import type { UserRole } from "@/types/domain";

interface DashboardShellProps {
  children: ReactNode;
  displayName: string;
  role: UserRole;
  modules: ModuleDefinition[];
  headerTitle: string;
  headerSubtitle: string;
  databaseMode: "connected" | "fixture";
}

export function DashboardShell({
  children,
  displayName,
  role,
  modules,
  headerTitle,
  headerSubtitle,
  databaseMode,
}: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar displayName={displayName} role={role} modules={modules} />
      <main className="flex-1 p-4 md:p-6">
        <Topbar
          title={headerTitle}
          subtitle={headerSubtitle}
          databaseMode={databaseMode}
        />
        <div className="space-y-6">{children}</div>
      </main>
    </div>
  );
}
