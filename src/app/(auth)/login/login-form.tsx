"use client";

import { useActionState } from "react";

import { loginAction, type LoginFormState } from "@/app/(auth)/login/actions";
import { ROLE_LABELS } from "@/lib/auth/roles";

const initialState: LoginFormState = {};

const bootstrapCredentials = [
  { email: "owner@equitybuilders.io", role: "OWNER", password: "OwnerPass!2026" },
  {
    email: "contractor@equitybuilders.io",
    role: "CONTRACTOR",
    password: "ContractorPass!2026",
  },
  {
    email: "adjuster@equitybuilders.io",
    role: "ADJUSTER",
    password: "AdjusterPass!2026",
  },
  {
    email: "internal@equitybuilders.io",
    role: "INTERNAL",
    password: "InternalPass!2026",
  },
] as const;

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="grid gap-6 md:grid-cols-[1.1fr,0.9fr]">
      <form
        action={formAction}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h1 className="text-xl font-semibold text-slate-900">
          Sign in to Equity Builders
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Access forensic intelligence, claim controls, execution workflows, and
          equity analytics from one verified command surface.
        </p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-cyan-500 transition focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-cyan-500 transition focus:ring-2"
            />
          </label>
        </div>

        {state.error && (
          <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <aside className="rounded-xl border border-slate-200 bg-slate-950 p-6 text-slate-100 shadow-sm">
        <h2 className="text-lg font-semibold text-white">Bootstrap access</h2>
        <p className="mt-2 text-sm text-slate-300">
          Seeded accounts are included for local role testing. Replace with
          identity-provider backed users before production launch.
        </p>
        <ul className="mt-5 space-y-3">
          {bootstrapCredentials.map((credential) => (
            <li
              key={credential.email}
              className="rounded-md border border-slate-800 bg-slate-900 p-3"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                {ROLE_LABELS[credential.role]}
              </p>
              <p className="mt-1 text-sm text-slate-200">{credential.email}</p>
              <p className="mt-1 text-xs text-slate-400">{credential.password}</p>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
