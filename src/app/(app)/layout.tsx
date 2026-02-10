import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/app-header";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { getSession } from "@/lib/auth/session";
import { logoutAction } from "@/app/login/actions";
import { getRoleScopedSnapshot } from "@/server/repositories/platform-repository";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const snapshot = await getRoleScopedSnapshot(session.role);
  const propertyLabel = `${snapshot.property.displayName}, ${snapshot.property.city} ${snapshot.property.state}`;

  return (
    <div className="min-h-screen lg:flex">
      <SidebarNav role={session.role} />
      <div className="flex min-h-screen flex-1 flex-col">
        <AppHeader session={session} propertyLabel={propertyLabel} signOutAction={logoutAction} />
        <main className="flex-1 space-y-6 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
