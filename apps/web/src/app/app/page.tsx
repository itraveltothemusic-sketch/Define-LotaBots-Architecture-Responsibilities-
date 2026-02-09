import Link from "next/link";
import { requireUser } from "@/lib/auth/require-user";

export default async function AppHomePage() {
  const user = await requireUser();

  return (
    <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
      <div className="flex flex-col gap-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-300">
          Dashboard
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
          Welcome, {user.name}
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-zinc-300">
          This is your operational command center. The Intelligence Center is
          designed to surface risks, gaps, and next-best actions with forensic
          traceability.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-black/30 p-5 ring-1 ring-white/10">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-300">
            Active properties
          </div>
          <div className="mt-2 text-2xl font-semibold text-zinc-100">3</div>
          <div className="mt-2 text-sm text-zinc-300">
            Evidence collection in progress.
          </div>
        </div>
        <div className="rounded-2xl bg-black/30 p-5 ring-1 ring-white/10">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-300">
            Claims in motion
          </div>
          <div className="mt-2 text-2xl font-semibold text-zinc-100">2</div>
          <div className="mt-2 text-sm text-zinc-300">
            Carrier interactions logged.
          </div>
        </div>
        <div className="rounded-2xl bg-black/30 p-5 ring-1 ring-white/10">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-300">
            Execution verification
          </div>
          <div className="mt-2 text-2xl font-semibold text-zinc-100">1</div>
          <div className="mt-2 text-sm text-zinc-300">
            Pending compliance check.
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/app/intelligence"
          className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-emerald-300"
        >
          Open Intelligence Center
        </Link>
        <Link
          href="/app/settings"
          className="inline-flex items-center justify-center rounded-xl bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-100 ring-1 ring-white/10 hover:bg-white/10"
        >
          Settings
        </Link>
      </div>
    </div>
  );
}

