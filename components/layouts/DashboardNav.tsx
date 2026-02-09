/**
 * Dashboard Navigation
 * 
 * Main navigation sidebar for authenticated users.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  HomeIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ChartBarIcon,
  CpuChipIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { logoutUser } from "@/lib/auth/actions";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
  { name: "Intelligence Center", href: "/dashboard", icon: HomeIcon },
  { name: "Properties", href: "/dashboard/properties", icon: BuildingOfficeIcon },
  { name: "Claims", href: "/dashboard/claims", icon: DocumentTextIcon },
  { name: "Contractors", href: "/dashboard/contractors", icon: UserGroupIcon },
  { name: "Equity Outcomes", href: "/dashboard/equity", icon: ChartBarIcon },
  { name: "ATOS Assistant", href: "/dashboard/intelligence", icon: CpuChipIcon },
];

export default function DashboardNav({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-100">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <BuildingOfficeIcon className="h-8 w-8 text-primary-400" />
          <span className="text-xl font-bold">Equity Builders</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors",
                isActive
                  ? "bg-primary-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-white">{userName}</p>
            <p className="text-xs text-gray-400">Logged in</p>
          </div>
          <Link href="/dashboard/settings">
            <Cog6ToothIcon className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
          </Link>
        </div>
        <form action={logoutUser}>
          <button
            type="submit"
            className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </form>
      </div>
    </div>
  );
}
