import { ROLE_LABELS } from "@/lib/auth/roles";
import type { SessionUser } from "@/types/domain";

interface TopbarProps {
  user: SessionUser;
  logoutAction: () => Promise<void>;
}

export function Topbar({ user, logoutAction }: TopbarProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Operational command surface
          </p>
          <p className="mt-1 text-sm text-slate-700">
            {user.email} · {ROLE_LABELS[user.role]}
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
