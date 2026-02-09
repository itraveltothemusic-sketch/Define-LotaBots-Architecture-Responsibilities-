/**
 * Sidebar — Primary navigation for the platform.
 * 
 * The sidebar provides access to all core modules.
 * Active state indicates the current module.
 * Badge counts surface pending items that need attention.
 * 
 * Design decision: Fixed sidebar rather than collapsible
 * because this is a workspace tool — users need persistent
 * access to navigation while working in any module.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  Shield,
  HardHat,
  TrendingUp,
  Settings,
  Brain,
  Sparkles,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';

const navItems = [
  {
    label: 'Intelligence Center',
    href: ROUTES.dashboard,
    icon: LayoutDashboard,
    description: 'Central command',
  },
  {
    label: 'Intelligence',
    href: ROUTES.intelligence,
    icon: Brain,
    description: 'Deep analytics',
  },
  {
    label: 'Properties',
    href: ROUTES.properties,
    icon: Building2,
    description: 'Forensic cases',
    badge: 6,
  },
  {
    label: 'Insurance',
    href: ROUTES.insurance,
    icon: Shield,
    description: 'Claims intelligence',
    badge: 3,
  },
  {
    label: 'Contractors',
    href: ROUTES.contractors,
    icon: HardHat,
    description: 'Execution tracking',
    badge: 1,
  },
  {
    label: 'Equity',
    href: ROUTES.equity,
    icon: TrendingUp,
    description: 'Outcome analysis',
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-950 text-white flex flex-col z-40">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-slate-800">
        <Link href={ROUTES.dashboard} className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">Equity Builders</h1>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Forensic Intelligence</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              )}
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-blue-400')} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className={cn(
                  'text-xs font-semibold px-2 py-0.5 rounded-full',
                  isActive ? 'bg-blue-600/30 text-blue-300' : 'bg-slate-800 text-slate-400'
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ATOS indicator */}
      <div className="px-3 py-3 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-900/50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-300">ATOS Active</p>
            <p className="text-[10px] text-slate-500 truncate">2 critical insights</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>

      {/* Settings */}
      <div className="px-3 pb-4">
        <Link
          href={ROUTES.settings}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
            pathname === ROUTES.settings
              ? 'bg-blue-600/20 text-blue-400'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          )}
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
