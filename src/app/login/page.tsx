import Link from "next/link";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth/session";
import { loginAction } from "@/app/login/actions";

const roleOptions = [
  {
    value: "OWNER",
    label: "Owner",
    detail: "Portfolio oversight, equity reporting, and strategic decisions.",
  },
  {
    value: "CONTRACTOR",
    label: "Contractor",
    detail: "Execution delivery, progress verification, and compliance completion.",
  },
  {
    value: "ADJUSTER",
    label: "Adjuster",
    detail: "Claim review, evidence validation, and scope adjudication.",
  },
  {
    value: "INTERNAL",
    label: "Internal",
    detail: "Cross-functional command, forensic management, and coordination.",
  },
] as const;

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getSession();
  const params = await searchParams;

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 py-10">
      <div className="w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-slate-950/70">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <section>
            <Badge label="Secure Platform Access" variant="info" />
            <h1 className="mt-4 text-3xl font-semibold text-white">Welcome to Equity Builders</h1>
            <p className="mt-3 text-sm text-slate-300">
              Access is role-scoped to protect evidence integrity, claims confidentiality, and execution accountability.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li>• Session tokens are signed to prevent tampering.</li>
              <li>• Module access is constrained by operational role.</li>
              <li>• ATOS guidance is always evidence-aware and explainable.</li>
            </ul>
            <Link href="/" className="mt-6 inline-block text-sm text-sky-300 hover:text-sky-200">
              Back to platform overview
            </Link>
          </section>

          <section>
            <form action={loginAction} className="space-y-5 rounded-xl border border-slate-700 bg-slate-950/70 p-6">
              <div>
                <label htmlFor="fullName" className="text-sm font-semibold text-slate-200">
                  Full name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  required
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none ring-sky-500 transition focus:ring-2"
                  placeholder="Jordan Rivera"
                />
              </div>

              <div>
                <label htmlFor="email" className="text-sm font-semibold text-slate-200">
                  Work email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none ring-sky-500 transition focus:ring-2"
                  placeholder="jrivera@equitybuilders.com"
                />
              </div>

              <div>
                <label htmlFor="role" className="text-sm font-semibold text-slate-200">
                  Operational role
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none ring-sky-500 transition focus:ring-2"
                  defaultValue="OWNER"
                >
                  {roleOptions.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Role intent</p>
                  <ul className="mt-2 space-y-1 text-xs text-slate-300">
                    {roleOptions.map((role) => (
                      <li key={role.value}>
                        <span className="font-semibold text-slate-200">{role.label}:</span> {role.detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {params.error === "validation" ? (
                <p className="rounded-md border border-rose-900 bg-rose-950/40 px-3 py-2 text-sm text-rose-200">
                  The submitted values were invalid. Please review your input.
                </p>
              ) : null}

              <button
                type="submit"
                className="w-full rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
              >
                Enter Platform
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
