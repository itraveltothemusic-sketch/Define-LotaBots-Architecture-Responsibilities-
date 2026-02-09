"use client";

import { Bell, Search, User, ChevronDown } from "lucide-react";
import { useState } from "react";

/**
 * Dashboard Header — Top bar for the authenticated experience.
 *
 * Contains:
 * - Global search (searches across all modules)
 * - Notification bell with badge
 * - User avatar and menu
 *
 * Design: Minimal, functional, never distracting from the content.
 */
export function DashboardHeader() {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      {/* Search */}
      <div className="flex-1 max-w-lg">
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
            searchFocused
              ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-white"
              : "border-slate-200 bg-slate-50"
          }`}
        >
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search properties, claims, contractors..."
            className="flex-1 text-sm bg-transparent border-none outline-none placeholder:text-slate-400"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-100 rounded border border-slate-200">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 ml-4">
        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User menu */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-700">
              Marcus Reid
            </div>
            <div className="text-[10px] text-slate-400">Internal Team</div>
          </div>
          <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
        </button>
      </div>
    </header>
  );
}
