import Link from "next/link";
import { getDemoDirectoryUsers } from "@/lib/auth/session";

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function resolveSingle(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};
  const error = resolveSingle(params.error);
  const next = resolveSingle(params.next) ?? "/platform/intelligence";

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
            Secure Access
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Sign in to Equity Builders</h1>
          <p className="mt-3 text-sm text-slate-300">
            Role-aware access is enforced across every module. Use the demo directory below for
            local development.
          </p>

          <form action="/api/auth/login" method="post" className="mt-6 space-y-4">
            <input type="hidden" name="next" value={next} />
            <label className="block space-y-2">
              <span className="text-sm text-slate-300">Email</span>
              <input
                type="email"
                name="email"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-sky-500/30 focus:ring-2"
                placeholder="owner@equitybuilders.local"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm text-slate-300">Password</span>
              <input
                type="password"
                name="password"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-sky-500/30 focus:ring-2"
                placeholder="EquityBuilders-2026"
              />
            </label>

            {error ? (
              <p className="rounded-xl border border-rose-800 bg-rose-950/40 px-3 py-2 text-sm text-rose-200">
                {error === "invalid_credentials"
                  ? "Invalid credentials. Verify email and password."
                  : "Please provide both email and password."}
              </p>
            ) : null}

            <button
              type="submit"
              className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
            >
              Sign in
            </button>
          </form>
          <p className="mt-6 text-xs text-slate-500">
            By signing in you acknowledge role-based logging, evidence traceability, and
            operational audit controls.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold text-white">Demo directory</h2>
          <p className="mt-2 text-sm text-slate-300">
            Local bootstrap users share the same password:
            <span className="ml-1 rounded bg-slate-800 px-2 py-1 font-mono text-xs text-sky-200">
              EquityBuilders-2026
            </span>
          </p>
          <ul className="mt-4 space-y-3">
            {getDemoDirectoryUsers().map((user) => (
              <li key={user.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {user.email} · {user.role}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <Link href="/" className="text-sm text-sky-300 hover:text-sky-200">
              ← Back to platform overview
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
