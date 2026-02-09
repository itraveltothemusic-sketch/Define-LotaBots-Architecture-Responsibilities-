"use client";

/**
 * Dashboard Header
 * 
 * Top bar with search, notifications, and user menu.
 * The search bar is connected to ATOS for intelligent search.
 */
import React from "react";
import {
  Bell,
  Search,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";

export function Header() {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search Bar — ATOS-powered */}
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search properties, claims, contractors... or ask ATOS"
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
            /
          </kbd>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-6">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors">
          <Bell className="w-5 h-5" />
          {/* Notification indicator */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500" />
        </button>

        {/* User Menu */}
        <button className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-slate-800/50 transition-colors group">
          <div className="w-8 h-8 rounded-full bg-brand-600/30 border border-brand-500/30 flex items-center justify-center">
            <User className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium text-white">Demo User</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Internal</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
        </button>
      </div>
    </header>
  );
}
