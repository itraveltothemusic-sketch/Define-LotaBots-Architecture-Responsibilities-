/**
 * Sidebar Navigation Component
 * 
 * Main navigation for the authenticated dashboard.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { 
  LayoutDashboard, 
  Building2, 
  FileText, 
  HardHat, 
  TrendingUp,
  LogOut,
  Settings
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    label: 'Intelligence Center',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Properties & Forensics',
    href: '/dashboard/properties',
    icon: Building2,
  },
  {
    label: 'Insurance Intelligence',
    href: '/dashboard/insurance',
    icon: FileText,
  },
  {
    label: 'Contractor Execution',
    href: '/dashboard/contractors',
    icon: HardHat,
  },
  {
    label: 'Equity Outcomes',
    href: '/dashboard/equity',
    icon: TrendingUp,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-brand-primary h-screen flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-white font-bold text-xl">Equity Builders</h1>
        <p className="text-slate-400 text-xs mt-1">Forensic Property Intelligence</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group',
                isActive
                  ? 'bg-brand-secondary text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon className={clsx('w-5 h-5', isActive ? 'text-white' : 'text-slate-400 group-hover:text-white')} />
              <span className="text-sm font-medium">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-brand-accent text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-700 space-y-1">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm font-medium">Settings</span>
        </Link>
        <button
          onClick={() => {
            // In production, this would call the logout API
            window.location.href = '/auth/login';
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-red-400 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
