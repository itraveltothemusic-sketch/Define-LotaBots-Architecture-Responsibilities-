'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Building2, 
  LayoutDashboard, 
  FileSearch, 
  Shield, 
  Users, 
  TrendingUp,
  Bell,
  User as UserIcon,
  LogOut,
  Settings,
  Brain
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { User } from '@/types';

interface DashboardNavProps {
  user: User;
}

const navigation = [
  { name: 'Intelligence Center', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Properties', href: '/dashboard/properties', icon: Building2 },
  { name: 'Inspections', href: '/dashboard/inspections', icon: FileSearch },
  { name: 'Insurance Claims', href: '/dashboard/insurance', icon: Shield },
  { name: 'Contractors', href: '/dashboard/contractors', icon: Users },
  { name: 'Equity Outcomes', href: '/dashboard/equity', icon: TrendingUp },
  { name: 'ATOS Assistant', href: '/dashboard/atos', icon: Brain },
];

export function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-dark-900 border-b border-dark-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <Building2 className="w-8 h-8 text-primary-400" />
              <span className="text-xl font-bold text-white">Equity Builders</span>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-dark-300 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-dark-800 transition-colors">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-white">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-xs text-dark-400 capitalize">{user.role}</div>
                </div>
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-56 bg-dark-800 border border-dark-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="p-3 border-b border-dark-700">
                  <div className="text-sm font-medium text-white">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-xs text-dark-400">{user.email}</div>
                </div>
                <div className="p-2">
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center space-x-3 px-3 py-2 text-sm text-dark-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center space-x-3 px-3 py-2 text-sm text-dark-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-dark-700 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="border-t border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto scrollbar-thin">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                    isActive
                      ? 'border-primary-500 text-primary-400'
                      : 'border-transparent text-dark-400 hover:text-dark-200 hover:border-dark-700'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
