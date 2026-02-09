import type { ReactNode } from "react";
import Link from "next/link";
import { LogoutButton } from "@/components/layout/logout-button";
import { PlatformNav } from "@/components/layout/platform-nav";
import type { PlatformUser } from "@/types/domain";

interface PlatformShellProps {
  user: PlatformUser;
  children: ReactNode;
}

export function PlatformShell({ user, children }: PlatformShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto grid max-w-[1500px] gap-6 px-5 py-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-5 rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
          <div>
            <Link href="/" className="text-lg font-semibold tracking-tight text-white">
              Equity Builders
            </Link>
            <p className="mt-1 text-sm text-slate-400">
              Forensic Property Intelligence Platform
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Signed in</p>
            <p className="mt-2 text-sm font-semibold text-white">{user.name}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
            <p className="mt-2 inline-flex rounded-full border border-slate-700 px-2 py-1 text-xs text-slate-200">
              {user.role}
            </p>
          </div>

          <PlatformNav user={user} />
          <LogoutButton />
        </aside>

        <main className="space-y-6">
          <header className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Central Intelligence Assistant
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-white">
              ATOS-guided storm recovery and equity optimization
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-300">
              Every module surfaces explainable guidance, forensic evidence posture, and strategic
              next actions to minimize value leakage and maximize verified equity gains.
            </p>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
