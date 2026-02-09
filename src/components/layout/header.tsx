/**
 * Header — Top bar for the authenticated platform.
 * 
 * Provides:
 * - Page title (context-aware)
 * - Search (global)
 * - ATOS toggle
 * - User profile access
 * 
 * The header is intentionally minimal — the sidebar carries
 * navigation weight, while the header focuses on context and actions.
 */

'use client';

import { usePathname } from 'next/navigation';
import { cn, getInitials } from '@/lib/utils';
import { Search, Brain, Bell } from 'lucide-react';
import { useAtosStore } from '@/stores/atos-store';
import { useAuthStore } from '@/stores/auth-store';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': {
    title: 'Intelligence Center',
    subtitle: 'Central command for all property intelligence operations',
  },
  '/intelligence': {
    title: 'Intelligence Deep Dive',
    subtitle: 'Cross-module analytics and forensic intelligence',
  },
  '/properties': {
    title: 'Forensic Property Module',
    subtitle: 'Property cases, inspections, and damage documentation',
  },
  '/insurance': {
    title: 'Insurance Intelligence',
    subtitle: 'Claim tracking, carrier interactions, and scope analysis',
  },
  '/contractors': {
    title: 'Contractor Execution',
    subtitle: 'Assignments, progress verification, and compliance',
  },
  '/equity': {
    title: 'Equity Outcomes',
    subtitle: 'Valuation analysis, gain verification, and reporting',
  },
  '/settings': {
    title: 'Settings',
    subtitle: 'Platform configuration and preferences',
  },
};

export function Header() {
  const pathname = usePathname();
  const { toggle: toggleAtos, isOpen: atosOpen } = useAtosStore();
  const { user } = useAuthStore();

  // Find matching page title
  const pageKey = Object.keys(pageTitles).find(key => pathname.startsWith(key));
  const page = pageKey ? pageTitles[pageKey] : { title: 'Equity Builders', subtitle: '' };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Page Context */}
      <div>
        <h2 className="text-lg font-bold text-slate-900">{page.title}</h2>
        {page.subtitle && (
          <p className="text-xs text-slate-500 -mt-0.5">{page.subtitle}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search properties, claims, contractors..."
            className="w-72 pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5 text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>

        {/* ATOS Toggle */}
        <button
          onClick={toggleAtos}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            atosOpen
              ? 'bg-violet-100 text-violet-700 ring-1 ring-violet-200'
              : 'hover:bg-slate-100 text-slate-600'
          )}
          title="Toggle ATOS Intelligence Assistant"
        >
          <Brain className={cn('w-4.5 h-4.5', atosOpen && 'text-violet-600')} />
          <span className="hidden lg:inline">ATOS</span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 ml-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-xs font-bold">
            {user ? getInitials(user.name) : '?'}
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-slate-900 leading-tight">{user?.name || 'Guest'}</p>
            <p className="text-[10px] text-slate-500 capitalize">{user?.role || 'unknown'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
