import Link from "next/link";
import { Home, Building2, Files, ShieldAlert, HardHat, TrendingUp } from "lucide-react";
import type * as React from "react";

import { Card } from "@/components/ui/card";
import { SignOutButton } from "@/components/shell/sign-out-button";
import { cn } from "@/lib/cn";
import type { Role } from "@prisma/client";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  module: "intelligence" | "forensic" | "insurance" | "execution" | "outcome";
};

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Home, module: "intelligence" },
  {
    href: "/dashboard/intelligence",
    label: "Intelligence Center",
    icon: ShieldAlert,
    module: "intelligence",
  },
  { href: "/dashboard/properties", label: "Forensic Property", icon: Building2, module: "forensic" },
  { href: "/dashboard/claims", label: "Insurance Intelligence", icon: Files, module: "insurance" },
  { href: "/dashboard/execution", label: "Contractor Execution", icon: HardHat, module: "execution" },
  { href: "/dashboard/outcomes", label: "Equity Outcomes", icon: TrendingUp, module: "outcome" },
];

function roleLabel(role: Role) {
  switch (role) {
    case "OWNER":
      return "Owner";
    case "CONTRACTOR":
      return "Contractor";
    case "ADJUSTER":
      return "Adjuster";
    case "INTERNAL":
      return "Internal";
    default:
      return role;
  }
}

export function DashboardShell({
  user,
  children,
  atosPanel,
}: {
  user: { name?: string | null; email?: string | null; role: Role };
  children: React.ReactNode;
  atosPanel?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 px-4 py-4 md:grid-cols-[260px_1fr] xl:grid-cols-[260px_1fr_360px]">
        <aside className="md:sticky md:top-4 md:self-start">
          <Card className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold tracking-tight">Equity Builders</div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400">
                  {roleLabel(user.role)} • {user.email ?? "Unknown"}
                </div>
              </div>
              <SignOutButton />
            </div>
            <div className="mt-4 space-y-1">
              {NAV.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-50",
                    )}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </Card>
        </aside>

        <main className="min-w-0">{children}</main>

        <aside className="hidden xl:block xl:sticky xl:top-4 xl:self-start">
          {atosPanel ? (
            atosPanel
          ) : (
            <Card className="p-4">
              <div className="text-sm font-semibold tracking-tight">ATOS</div>
              <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Open the Intelligence Center to see guided next actions, risks, and evidence gaps.
              </div>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}

