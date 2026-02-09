"use client";

/**
 * Top bar with search, notifications, and user profile.
 * 
 * The topbar provides contextual page titles and quick actions.
 * The search is designed to eventually be powered by ATOS
 * for intelligent, context-aware property/claim lookup.
 */

import { Bell, Search, User, LogOut } from "lucide-react";
import { currentUser } from "@/lib/mock-data";

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <header className="h-16 bg-navy-950/80 backdrop-blur-md border-b border-navy-800/60 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Page Title */}
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {subtitle && <p className="text-xs text-navy-400 mt-0.5">{subtitle}</p>}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" />
          <input
            type="text"
            placeholder="Search properties, claims, contractors..."
            className="w-72 pl-9 pr-4 py-2 bg-navy-800/60 border border-navy-700/50 rounded-lg text-sm text-navy-200 placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/50 transition-colors"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-navy-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
        </button>

        {/* User Menu */}
        <div className="flex items-center gap-3 pl-4 border-l border-navy-700/50">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{currentUser.name}</p>
            <p className="text-[11px] text-navy-400 capitalize">{currentUser.role}</p>
          </div>
          <div className="w-8 h-8 bg-brand-600/20 border border-brand-500/30 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-brand-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
