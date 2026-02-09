import type { ReactNode } from "react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getAllowedModules } from "@/lib/auth/permissions";
import { requireSession } from "@/lib/auth/session";
import { getDatabaseHealth } from "@/lib/db/client";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [session, dbHealth] = await Promise.all([
    requireSession(),
    getDatabaseHealth(),
  ]);
  const modules = getAllowedModules(session.role);

  return (
    <DashboardShell
      displayName={session.displayName}
      role={session.role}
      modules={modules}
      databaseMode={dbHealth.mode}
      headerTitle="Equity Builders Command Center"
      headerSubtitle="Forensic truth, insurance intelligence, and equity execution in one system."
    >
      {children}
    </DashboardShell>
  );
}
