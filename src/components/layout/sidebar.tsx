"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Shield,
  LayoutDashboard,
  Brain,
  Building2,
  FileSearch,
  HardHat,
  TrendingUp,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
} from "lucide-react";

/**
 * Dashboard Sidebar — The nervous system of the UI.
 *
 * Design decisions:
 * - Collapsible for maximum workspace on smaller screens
 * - Active state is visually unambiguous
 * - ATOS indicator is always visible — intelligence is always present
 * - Module grouping reflects the actual workflow
 */

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  /** Badge count for attention-requiring items */
  badge?: number;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Intelligence Center", href: "/intelligence", icon: Brain, badge: 2 },
  { label: "Properties", href: "/properties", icon: Building2 },
  { label: "Insurance Claims", href: "/insurance", icon: FileSearch, badge: 1 },
  { label: "Contractors", href: "/contractors", icon: HardHat },
  { label: "Equity Outcomes", href: "/equity", icon: TrendingUp },
];

const bottomNavItems: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-600">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-white leading-tight truncate">
                Equity Builders
              </span>
              <span className="text-[9px] font-medium text-slate-500 uppercase tracking-widest leading-none">
                Intelligence
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* ATOS Status Indicator */}
      <div
        className={cn(
          "mx-3 mt-4 mb-2 rounded-xl border transition-all",
          collapsed ? "p-2" : "p-3",
          "bg-violet-500/10 border-violet-500/20"
        )}
      >
        <div className="flex items-center gap-2.5">
          <div className="relative flex-shrink-0">
            <Brain className="w-5 h-5 text-violet-400" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-violet-400 rounded-full atos-pulse" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-xs font-semibold text-violet-300">ATOS Active</div>
              <div className="text-[10px] text-violet-400/70">2 insights pending</div>
            </div>
          )}
        </div>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-emerald-600/10 text-emerald-400"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 flex-shrink-0",
                    isActive
                      ? "text-emerald-400"
                      : "text-slate-500 group-hover:text-slate-300"
                  )}
                />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-red-500/20 text-red-400 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {collapsed && item.badge && (
                  <span className="absolute left-14 flex items-center justify-center w-4 h-4 text-[9px] font-bold bg-red-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-3 space-y-1 border-t border-slate-800 pt-3">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-emerald-600/10 text-emerald-400"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0 text-slate-500 group-hover:text-slate-300" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-white hover:bg-slate-800/50 transition-all"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 flex-shrink-0" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
