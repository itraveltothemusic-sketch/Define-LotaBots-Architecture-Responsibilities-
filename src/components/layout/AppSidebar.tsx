import Link from "next/link";
import { Building2, FileSearch, Gauge, Handshake, HardHat, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/intelligence", label: "Intelligence Center", icon: FileSearch },
  { href: "/properties", label: "Properties", icon: Building2 },
  { href: "/claims", label: "Insurance", icon: Handshake },
  { href: "/contractors", label: "Contractors", icon: HardHat },
  { href: "/equity", label: "Equity Outcomes", icon: LineChart },
];

export function AppSidebar({
  orgName,
}: {
  orgName: string | null;
}) {
  return (
    <aside className="hidden w-[280px] shrink-0 border-r border-zinc-200 bg-white px-4 py-5 dark:border-zinc-800 dark:bg-zinc-950 md:block">
      <div className="flex items-center gap-2 px-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900 text-sm font-semibold text-white">
          EB
        </span>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold tracking-tight">
            Equity Builders
          </div>
          <div className="truncate text-xs text-zinc-600 dark:text-zinc-400">
            {orgName ?? "—"}
          </div>
        </div>
      </div>

      <nav className="mt-6 space-y-1">
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900",
                "dark:text-zinc-300 dark:hover:bg-zinc-900/40 dark:hover:text-zinc-100",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

