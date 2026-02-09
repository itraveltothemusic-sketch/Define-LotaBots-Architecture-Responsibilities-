"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ROLE_LABELS } from "@/lib/auth/roles";
import type { ModuleNavItem, SessionUser } from "@/types/domain";

interface SidebarProps {
  user: SessionUser;
  navItems: ModuleNavItem[];
}

export function Sidebar({ user, navItems }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full min-h-screen w-full max-w-72 flex-col border-r border-slate-200 bg-slate-950 text-slate-100">
      <div className="border-b border-slate-800 px-5 py-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
          Equity Builders
        </p>
        <h1 className="mt-2 text-lg font-semibold text-white">
          Forensic Intelligence Platform
        </h1>
      </div>

      <div className="px-4 py-6">
        <p className="text-xs text-slate-400">Signed in as</p>
        <p className="mt-1 text-sm font-semibold text-white">{user.name}</p>
        <p className="text-xs text-cyan-300">{ROLE_LABELS[user.role]}</p>
      </div>

      <nav className="flex-1 space-y-2 px-3 pb-6">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2.5 transition ${
                active
                  ? "bg-cyan-500/20 text-cyan-100"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <p className="text-sm font-medium">{item.title}</p>
              <p className="mt-1 text-xs text-slate-400">{item.description}</p>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
