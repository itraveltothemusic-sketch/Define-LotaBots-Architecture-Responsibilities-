/**
 * PlatformShell — Main layout wrapper for authenticated routes.
 * 
 * Provides the sidebar, header, ATOS panel, and main content area.
 * This is the structural backbone of the entire platform UI.
 * 
 * Layout: Fixed sidebar (left) + Header (top) + Content (center) + ATOS panel (right)
 * The ATOS panel slides in from the right without displacing content,
 * creating a persistent intelligence layer alongside the user's work.
 */

'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { AtosPanel } from '@/components/atos/atos-panel';
import { useAtosStore } from '@/stores/atos-store';
import { useAuthStore } from '@/stores/auth-store';

interface PlatformShellProps {
  children: React.ReactNode;
}

export function PlatformShell({ children }: PlatformShellProps) {
  const { isOpen: atosOpen } = useAtosStore();
  const { initialize, initialized } = useAuthStore();

  // Initialize auth state on mount
  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      {/* Main content area — offset by sidebar width */}
      <div className={cn(
        'ml-64 transition-all duration-300',
        atosOpen && 'mr-96'
      )}>
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* ATOS Intelligence Panel — fixed right side */}
      <AtosPanel />
    </div>
  );
}
