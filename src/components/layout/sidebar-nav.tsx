"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Building2, Hammer, Radar, ShieldCheck } from "lucide-react";
import type { ComponentType } from "react";

import { canAccessModule } from "@/lib/auth/permissions";
import type { UserRole } from "@/lib/auth/types";
import { APP_NAV_ITEMS, type NavIconKey } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const navIconMap: Record<NavIconKey, ComponentType<{ className?: string }>> = {
  radar: Radar,
  building: Building2,
  shield: ShieldCheck,
  hammer: Hammer,
  chart: BarChart3,
};

interface SidebarNavProps {
  role: UserRole;
}

export function SidebarNav({ role }: SidebarNavProps) {
  const pathname = usePathname();
  const items = APP_NAV_ITEMS.filter((item) => canAccessModule(role, item.module));

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-slate-200 bg-slate-950 text-slate-100 lg:flex">
      <div className="border-b border-slate-800 px-6 py-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-300">Equity Builders</p>
        <h1 className="mt-2 text-lg font-semibold leading-tight">Forensic Intelligence Platform</h1>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-4">
        {items.map((item) => {
          const Icon = navIconMap[item.icon];
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-xl px-3 py-3 transition",
                active ? "bg-sky-500/20 text-sky-100" : "text-slate-300 hover:bg-slate-800 hover:text-white",
              )}
            >
              <span className="flex items-center gap-3 text-sm font-semibold">
                <Icon className="size-4" />
                {item.label}
              </span>
              <span className="mt-1 block pl-7 text-xs text-slate-400">{item.shortDescription}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
