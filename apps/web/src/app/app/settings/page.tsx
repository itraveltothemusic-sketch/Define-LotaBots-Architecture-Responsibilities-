import { requireUser } from "@/lib/auth/require-user";
import { logoutAction } from "@/app/app/actions";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-300">
          Settings
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
          Account
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-300">
          Signed in as <span className="font-semibold text-zinc-100">{user.email}</span>.
        </p>

        <form action={logoutAction} className="mt-6">
          <button className="rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-100 ring-1 ring-white/10 hover:bg-white/10">
            Sign out
          </button>
        </form>
      </div>

      <div className="rounded-3xl bg-black/30 p-6 ring-1 ring-white/10">
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-300">
          Security posture
        </div>
        <p className="mt-3 text-sm leading-6 text-zinc-300">
          Production deployments must configure <code className="text-zinc-100">SESSION_SECRET</code> and disable demo mode.
          Database-backed authentication and audited event logging will be enforced as modules are completed.
        </p>
      </div>
    </div>
  );
}

