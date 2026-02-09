import Link from "next/link";
import type { ReactNode } from "react";
import type { SessionUser } from "@/lib/auth/types";

const NAV = [
  { href: "/app/intelligence", label: "Intelligence Center" },
  { href: "/app/properties", label: "Properties" },
  { href: "/app/insurance", label: "Insurance Intelligence" },
  { href: "/app/execution", label: "Contractor Execution" },
  { href: "/app/equity", label: "Equity Outcomes" },
  { href: "/app/settings", label: "Settings" },
] as const;

export function AppShell(props: { user: SessionUser; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-6 px-6 py-6">
        <aside className="col-span-12 md:col-span-3">
          <div className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400" />
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-zinc-100">
                  Equity Builders
                </div>
                <div className="truncate text-xs text-zinc-400">
                  {props.user.name} · {props.user.role}
                </div>
              </div>
            </div>

            <nav className="mt-6 space-y-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl px-3 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6 rounded-2xl bg-black/30 p-4 ring-1 ring-white/10">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-300">
                Forensic standard
              </div>
              <div className="mt-2 text-xs leading-5 text-zinc-300">
                Every action should strengthen the evidence trail:{" "}
                <span className="text-zinc-100">
                  timestamps, provenance, measurements, and attribution.
                </span>
              </div>
            </div>
          </div>
        </aside>

        <div className="col-span-12 md:col-span-9">{props.children}</div>
      </div>
    </div>
  );
}

