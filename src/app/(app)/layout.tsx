import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { UserMenu } from "@/components/layout/UserMenu";
import { AtosPanel } from "@/components/atos/AtosPanel";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session?.user) redirect("/sign-in");

  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1400px]">
        <AppSidebar orgName={session.user.orgName} />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-zinc-200 bg-zinc-50/80 backdrop-blur dark:border-zinc-800 dark:bg-black/60">
            <div className="flex items-center justify-between gap-4 px-6 py-4">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold tracking-tight">
                  {session.user.orgName ?? "Workspace"}
                </div>
                <div className="truncate text-xs text-zinc-600 dark:text-zinc-400">
                  Evidence-first operations • role: {session.user.role ?? "—"}
                </div>
              </div>

              <UserMenu
                name={session.user.name}
                email={session.user.email}
                role={session.user.role}
              />
            </div>
          </header>

          <div className="grid flex-1 grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <main className="min-w-0">{children}</main>
            <div className="hidden lg:block">
              <AtosPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

