import Link from "next/link";
import { redirect } from "next/navigation";

import { authenticateAction } from "@/app/login/actions";
import { getSession } from "@/lib/auth/session";

const roleOptions = ["Owner", "Internal", "Adjuster", "Contractor"] as const;

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect("/dashboard/intelligence");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-16">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl lg:grid-cols-2">
        <section className="relative border-b border-white/10 p-8 lg:border-b-0 lg:border-r">
          <p className="text-xs uppercase tracking-[0.22em] text-indigo-300">
            Equity Builders
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-white">
            Forensic Property Intelligence Platform
          </h1>
          <p className="mt-4 text-sm text-slate-300">
            Transform storm-damaged commercial assets into documented equity gains
            with forensic certainty, insurance intelligence, and execution control.
          </p>

          <ul className="mt-8 space-y-4 text-sm text-slate-200">
            <li>• Explainable AI guidance with ATOS</li>
            <li>• Chain-of-custody evidence confidence</li>
            <li>• Claim-to-equity outcome traceability</li>
          </ul>

          <Link
            href="/"
            className="mt-8 inline-flex rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Back to overview
          </Link>
        </section>

        <section className="p-8">
          <h2 className="text-xl font-semibold text-white">Secure access</h2>
          <p className="mt-1 text-sm text-slate-300">
            Sign in with your operational role to open the command center.
          </p>

          <form action={authenticateAction} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-300">
                Display name
              </span>
              <input
                name="displayName"
                required
                placeholder="Jordan Lee"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none ring-indigo-400 focus:ring"
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-300">
                Role
              </span>
              <select
                name="role"
                required
                defaultValue="Owner"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none ring-indigo-400 focus:ring"
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              Enter platform
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
