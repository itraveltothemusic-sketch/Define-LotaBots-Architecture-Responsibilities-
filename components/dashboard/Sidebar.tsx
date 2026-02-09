/**
 * Dashboard Sidebar Navigation
 * 
 * Role-aware navigation with ATOS integration
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Building2, 
  FileSearch, 
  FileText, 
  Users, 
  TrendingUp,
  Brain,
  Settings,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
}

const navigation: NavItem[] = [
  { 
    name: 'Intelligence Center', 
    href: '/intelligence', 
    icon: LayoutDashboard,
  },
  { 
    name: 'Properties', 
    href: '/properties', 
    icon: Building2,
  },
  { 
    name: 'Inspections', 
    href: '/inspections', 
    icon: FileSearch,
    roles: ['internal', 'contractor'],
  },
  { 
    name: 'Insurance Claims', 
    href: '/insurance', 
    icon: FileText,
    roles: ['internal', 'adjuster', 'owner'],
  },
  { 
    name: 'Contractors', 
    href: '/contractors', 
    icon: Users,
    roles: ['internal', 'owner'],
  },
  { 
    name: 'Equity Outcomes', 
    href: '/equity', 
    icon: TrendingUp,
    roles: ['internal', 'owner'],
  },
];

interface SidebarProps {
  userRole: string;
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();
  
  const filteredNavigation = navigation.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/intelligence" className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-forensic-600" />
          <div>
            <div className="text-lg font-bold text-gray-900">Equity Builders</div>
            <div className="text-xs text-gray-500">Forensic Intelligence</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-forensic-50 text-forensic-700'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive ? 'text-forensic-600' : 'text-gray-500')} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* ATOS Quick Access */}
      <div className="p-4 border-t border-gray-200">
        <Link 
          href="/atos"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gradient-to-r from-forensic-50 to-primary-50 hover:from-forensic-100 hover:to-primary-100 transition-colors"
        >
          <Brain className="h-5 w-5 text-forensic-600" />
          <div>
            <div className="text-sm font-medium text-forensic-900">ATOS Assistant</div>
            <div className="text-xs text-forensic-600">AI Guidance</div>
          </div>
        </Link>
      </div>

      {/* Settings */}
      <div className="p-4 border-t border-gray-200">
        <Link
          href="/settings"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
        >
          <Settings className="h-5 w-5 text-gray-500" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
