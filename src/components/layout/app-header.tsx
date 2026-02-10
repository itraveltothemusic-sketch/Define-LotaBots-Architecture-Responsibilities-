import type { AuthSession } from "@/lib/auth/types";

interface AppHeaderProps {
  session: AuthSession;
  propertyLabel: string;
  signOutAction: () => Promise<void>;
}

export function AppHeader({ session, propertyLabel, signOutAction }: AppHeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Active Property Context
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{propertyLabel}</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-slate-200 px-3 py-2 text-xs dark:border-slate-700">
            <p className="font-semibold text-slate-900 dark:text-slate-100">{session.fullName}</p>
            <p className="text-slate-500 dark:text-slate-400">
              {session.role} · {session.email}
            </p>
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
