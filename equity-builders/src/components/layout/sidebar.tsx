"use client";

/**
 * Platform sidebar navigation.
 * 
 * Design decision: Fixed sidebar with icon + label navigation.
 * The ATOS indicator at the bottom provides persistent access
 * to the AI intelligence assistant from any page.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Shield,
  HardHat,
  TrendingUp,
  Settings,
  Brain,
  ChevronRight,
  Zap,
} from "lucide-react";

const navigation = [
  {
    name: "Intelligence Center",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Central command — overview, insights, and AI guidance",
  },
  {
    name: "Properties",
    href: "/properties",
    icon: Building2,
    description: "Forensic property profiles and inspections",
  },
  {
    name: "Insurance",
    href: "/insurance",
    icon: Shield,
    description: "Claims lifecycle and carrier intelligence",
  },
  {
    name: "Contractors",
    href: "/contractors",
    icon: HardHat,
    description: "Execution tracking and compliance",
  },
  {
    name: "Equity",
    href: "/equity",
    icon: TrendingUp,
    description: "Outcome verification and value analysis",
  },
];

const bottomNav = [
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-navy-950 border-r border-navy-800/60 flex flex-col">
      {/* Logo / Brand */}
      <div className="px-5 py-5 border-b border-navy-800/60">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-600/30">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">Equity Builders</h1>
            <p className="text-[10px] text-navy-400 uppercase tracking-widest">Forensic Intelligence</p>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-brand-600/15 text-brand-300 border border-brand-500/20"
                  : "text-navy-300 hover:text-white hover:bg-navy-800/60 border border-transparent",
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 flex-shrink-0 transition-colors",
                  isActive ? "text-brand-400" : "text-navy-500 group-hover:text-navy-300",
                )}
              />
              <div className="flex-1 min-w-0">
                <span className="block truncate">{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-brand-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-3 py-2 border-t border-navy-800/60">
        {bottomNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-navy-800 text-white"
                  : "text-navy-400 hover:text-navy-200 hover:bg-navy-800/60",
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* ATOS Intelligence Indicator */}
      <div className="px-3 pb-4 pt-2">
        <div className="bg-brand-600/10 border border-brand-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-4 h-4 text-brand-400 animate-pulse-subtle" />
            <span className="text-xs font-semibold text-brand-300 uppercase tracking-wider">ATOS Active</span>
          </div>
          <p className="text-[11px] text-navy-400 leading-relaxed">
            3 insights require attention
          </p>
        </div>
      </div>
    </aside>
  );
}
