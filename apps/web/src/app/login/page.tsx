import { redirect } from "next/navigation";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { EB_DEMO_MODE } from "@/lib/env";
import { DEMO_USERS, roleLabel } from "@/lib/auth/demo-users";
import { createSessionCookie } from "@/lib/auth/session";
import { prisma } from "@/server/db/prisma";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  returnTo: z.string().optional(),
});

async function loginAction(formData: FormData) {
  "use server";

  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    returnTo: formData.get("returnTo") ?? undefined,
  });

  if (!parsed.success) {
    redirect("/login?error=invalid");
  }

  const returnTo = parsed.data.returnTo;

  if (!EB_DEMO_MODE) {
    // Production path: database-backed auth.
    if (!process.env.DATABASE_URL) {
      redirect("/login?error=db_not_configured");
    }

    const user = await prisma().user.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
    });

    if (!user?.passwordHash) {
      redirect("/login?error=bad_credentials");
    }

    const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!ok) {
      redirect("/login?error=bad_credentials");
    }

    await createSessionCookie({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    if (returnTo && returnTo.startsWith("/app")) redirect(returnTo);
    redirect("/app");
  }

  const match = DEMO_USERS.find(
    (u) =>
      u.email.toLowerCase() === parsed.data.email.toLowerCase() &&
      u.password === parsed.data.password,
  );

  if (!match) {
    redirect("/login?error=bad_credentials");
  }

  await createSessionCookie({
    id: match.id,
    email: match.email,
    name: match.name,
    role: match.role,
  });

  if (returnTo && returnTo.startsWith("/app")) {
    redirect(returnTo);
  }
  redirect("/app");
}

export default async function LoginPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : "";
  const returnTo =
    typeof searchParams.returnTo === "string" ? searchParams.returnTo : "";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <main className="mx-auto grid max-w-5xl gap-10 px-6 py-16 md:grid-cols-12">
        <section className="md:col-span-6">
          <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-4 text-sm leading-6 text-zinc-300">
            Equity Builders is evidence-first. Access is role-based and every
            action is attributable.
          </p>

          <div className="mt-8 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-300">
              Demo mode
            </div>
            <p className="mt-2 text-sm text-zinc-300">
              This repository runs immediately with demo users while database
              auth is being wired. Disable by setting{" "}
              <code className="text-zinc-100">EB_DEMO_MODE=0</code>.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {DEMO_USERS.map((u) => (
                <li
                  key={u.id}
                  className="flex items-center justify-between rounded-xl bg-black/30 px-3 py-2 ring-1 ring-white/10"
                >
                  <div>
                    <div className="font-semibold text-zinc-100">{u.email}</div>
                    <div className="text-xs text-zinc-400">
                      {roleLabel(u.role)} — password:{" "}
                      <span className="font-mono text-zinc-200">password</span>
                    </div>
                  </div>
                  <form
                    action={loginAction}
                    className="flex items-center gap-2"
                  >
                    <input type="hidden" name="email" value={u.email} />
                    <input type="hidden" name="password" value="password" />
                    {returnTo ? (
                      <input type="hidden" name="returnTo" value={returnTo} />
                    ) : null}
                    <button className="rounded-lg bg-emerald-400 px-3 py-2 text-xs font-semibold text-zinc-950 hover:bg-emerald-300">
                      Continue
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="md:col-span-6">
          <div className="rounded-3xl bg-gradient-to-b from-white/10 to-white/5 p-6 ring-1 ring-white/10">
            <div className="text-sm font-semibold text-zinc-100">
              Credentials
            </div>

            {error ? (
              <div className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-200 ring-1 ring-red-500/20">
                {error === "bad_credentials"
                  ? "Invalid email or password."
                  : error === "demo_disabled"
                    ? "Demo mode is disabled. Configure production auth to sign in."
                    : error === "db_not_configured"
                      ? "Database auth is enabled, but DATABASE_URL is not configured."
                    : "Please check your inputs and try again."}
              </div>
            ) : null}

            <form action={loginAction} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-200">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  className="mt-2 w-full rounded-xl bg-black/30 px-3 py-2 text-sm text-zinc-100 ring-1 ring-white/10 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-200">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="mt-2 w-full rounded-xl bg-black/30 px-3 py-2 text-sm text-zinc-100 ring-1 ring-white/10 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                  required
                />
              </div>

              <button className="w-full rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-zinc-950 hover:bg-emerald-300">
                Sign in
              </button>

              <div className="text-xs text-zinc-400">
                By continuing, you acknowledge this environment must be operated
                with evidence-grade documentation standards.
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

