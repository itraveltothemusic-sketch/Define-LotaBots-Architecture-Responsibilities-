/**
 * Dashboard Header
 * 
 * Top navigation bar with user menu and notifications
 */

'use client';

import { Bell, Search, User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export function Header({ user }: HeaderProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    router.push('/login');
  };

  const getRoleDisplay = (role: string) => {
    const roles: Record<string, string> = {
      owner: 'Property Owner',
      contractor: 'Contractor',
      adjuster: 'Insurance Adjuster',
      internal: 'Internal Team',
    };
    return roles[role] || role;
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Search */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties, claims, documents..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forensic-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4 ml-6">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-critical-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                <div className="text-xs text-gray-500">{getRoleDisplay(user.role)}</div>
              </div>
              <div className="relative group">
                <button className="w-10 h-10 bg-forensic-100 rounded-full flex items-center justify-center text-forensic-700 font-semibold hover:bg-forensic-200 transition-colors">
                  {user.name.charAt(0).toUpperCase()}
                </button>
                
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="p-2">
                    <button
                      onClick={() => router.push('/settings')}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile Settings</span>
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-critical-600 hover:bg-critical-50 rounded-md"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
