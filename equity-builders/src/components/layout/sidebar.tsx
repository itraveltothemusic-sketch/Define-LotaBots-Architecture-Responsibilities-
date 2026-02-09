"use client";

/**
 * Sidebar Navigation
 * 
 * The primary navigation element of the dashboard.
 * Organized by the five core modules with clear visual hierarchy.
 * 
 * Design decisions:
 * - Fixed sidebar for always-visible navigation
 * - Active state clearly indicated with brand color
 * - Module grouping matches the mental model of the workflow
 * - ATOS access point always visible at the bottom
 */
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  Building2,
  Search,
  Shield,
  HardHat,
  TrendingUp,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FileText,
  Users,
  BarChart3,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navigation: NavGroup[] = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="w-5 h-5" />,
      },
      {
        label: "Intelligence Center",
        href: "/intelligence",
        icon: <Search className="w-5 h-5" />,
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        label: "Properties",
        href: "/properties",
        icon: <Building2 className="w-5 h-5" />,
      },
      {
        label: "Insurance Claims",
        href: "/insurance",
        icon: <Shield className="w-5 h-5" />,
      },
      {
        label: "Contractors",
        href: "/contractors",
        icon: <HardHat className="w-5 h-5" />,
      },
    ],
  },
  {
    title: "Outcomes",
    items: [
      {
        label: "Equity Analysis",
        href: "/equity",
        icon: <TrendingUp className="w-5 h-5" />,
      },
      {
        label: "Reports",
        href: "/equity",
        icon: <FileText className="w-5 h-5" />,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        label: "Team",
        href: "/settings",
        icon: <Users className="w-5 h-5" />,
      },
      {
        label: "Settings",
        href: "/settings",
        icon: <Settings className="w-5 h-5" />,
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-full bg-slate-900 border-r border-slate-800 z-40",
        "flex flex-col transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-800">
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white tracking-tight">
              Equity Builders
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">
              Intelligence Platform
            </span>
          </div>
        )}
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navigation.map((group) => (
          <div key={group.title}>
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                {group.title}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-brand-600/20 text-brand-300 border border-brand-500/20"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className={cn("flex-shrink-0", isActive && "text-brand-400")}>
                      {item.icon}
                    </span>
                    {!collapsed && <span>{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span className="ml-auto text-xs bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ATOS Quick Access — Always visible */}
      <div className="p-3 border-t border-slate-800">
        <Link
          href="/intelligence"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg",
            "bg-gradient-to-r from-brand-600/20 to-purple-600/20",
            "border border-brand-500/20",
            "text-brand-300 hover:text-white transition-colors",
            "group"
          )}
        >
          <Sparkles className="w-5 h-5 text-brand-400 group-hover:text-brand-300 animate-pulse-subtle" />
          {!collapsed && (
            <div>
              <p className="text-sm font-semibold">ATOS Assistant</p>
              <p className="text-[10px] text-slate-500">Ask anything</p>
            </div>
          )}
        </Link>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-20 -right-3 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-50"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </aside>
  );
}
