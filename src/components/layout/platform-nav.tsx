"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAccessiblePlatformRoutes } from "@/lib/auth/authorization";
import { cn } from "@/lib/utils";
import type { PlatformUser } from "@/types/domain";

interface PlatformNavProps {
  user: PlatformUser;
}

export function PlatformNav({ user }: PlatformNavProps) {
  const pathname = usePathname();
  const routes = getAccessiblePlatformRoutes(user.role);
  const homeActive = pathname === "/platform";

  return (
    <nav className="space-y-2">
      <Link
        href="/platform"
        className={cn(
          "block rounded-xl border px-3 py-2 text-sm transition-colors",
          homeActive
            ? "border-sky-500/50 bg-sky-900/40 text-sky-100"
            : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:text-white",
        )}
      >
        <p className="font-medium">Platform Dashboard</p>
        <p className="mt-1 text-xs text-slate-400">
          Role-aware command shell and module launch pad.
        </p>
      </Link>
      {routes.map((route) => {
        const isActive = pathname.startsWith(route.href);
        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "block rounded-xl border px-3 py-2 text-sm transition-colors",
              isActive
                ? "border-sky-500/50 bg-sky-900/40 text-sky-100"
                : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:text-white",
            )}
          >
            <p className="font-medium">{route.title}</p>
            <p className="mt-1 text-xs text-slate-400">{route.description}</p>
          </Link>
        );
      })}
    </nav>
  );
}
