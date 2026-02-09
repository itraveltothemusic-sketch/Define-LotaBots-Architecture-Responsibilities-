/**
 * Platform layout — wraps all authenticated routes.
 * 
 * This layout provides the PlatformShell (sidebar + header + ATOS panel)
 * around all module pages. In production, this would also include
 * auth guards that redirect unauthenticated users to login.
 */

import { PlatformShell } from '@/components/layout/platform-shell';

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PlatformShell>{children}</PlatformShell>;
}
