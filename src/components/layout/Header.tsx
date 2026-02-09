/**
 * Dashboard Header Component
 * 
 * Top header with user info and quick actions.
 */

'use client';

import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  title: string;
  subtitle?: string;
  user?: {
    name: string;
    role: string;
  };
}

export function Header({ title, subtitle, user }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary">{title}</h1>
          {subtitle && <p className="text-sm text-brand-muted mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search properties, claims..."
              className="pl-10 pr-4 py-2 w-80 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-slate-600 hover:text-brand-primary hover:bg-slate-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-brand-danger rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-brand-primary">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-brand-muted">{user?.role || 'Owner'}</p>
            </div>
            <button className="w-9 h-9 bg-brand-secondary text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
