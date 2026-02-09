"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { ModuleDefinition } from "@/lib/auth/permissions";
import type { UserRole } from "@/types/domain";

interface SidebarProps {
  displayName: string;
  role: UserRole;
  modules: ModuleDefinition[];
}

export function Sidebar({ displayName, role, modules }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white/90 p-5 lg:block">
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
        <p className="text-xs uppercase tracking-wide text-indigo-600">Equity Builders</p>
        <h1 className="mt-1 text-base font-semibold text-indigo-950">
          Forensic Intelligence Suite
        </h1>
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs text-slate-500">Signed in as</p>
        <p className="text-sm font-semibold text-slate-900">{displayName}</p>
        <p className="text-xs text-slate-600">{role}</p>
      </div>

      <nav className="mt-5 space-y-2">
        {modules.map((module) => {
          const active = pathname.startsWith(module.href);
          return (
            <Link
              key={module.key}
              href={module.href}
              className={`block rounded-lg border px-3 py-2 text-sm transition ${
                active
                  ? "border-indigo-300 bg-indigo-50 text-indigo-900"
                  : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/40"
              }`}
            >
              <p className="font-semibold">{module.label}</p>
              <p className="mt-1 text-xs">{module.description}</p>
            </Link>
          );
        })}
      </nav>

      <form action="/logout" method="post" className="mt-6">
        <button
          type="submit"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Sign out
        </button>
      </form>
    </aside>
  );
}
