import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import { hasDatabaseConfigured } from "@/server/env";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInForm } from "./sign-in-form";

export default async function SignInPage() {
  const session = await getSession();
  if (session?.user) redirect("/dashboard");

  const dbReady = hasDatabaseConfigured();

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-black">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-6 py-14">
        <div className="space-y-2">
          <Link
            href="/"
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            ← Back to landing
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Sign in
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Access is role-based. Every action is attributable and audit-ready.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Credentials</CardTitle>
            <CardDescription>
              {dbReady
                ? "Use your email and password."
                : "Database is not configured yet. The UI will render, but authentication is disabled until DATABASE_URL is set."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignInForm disabled={!dbReady} />
          </CardContent>
        </Card>

        <div className="text-xs text-zinc-500 dark:text-zinc-500">
          If you’re setting this up locally, copy <code>.env.example</code> to{" "}
          <code>apps/web/.env.local</code> and set <code>DATABASE_URL</code> and{" "}
          <code>AUTH_SECRET</code>.
        </div>
      </div>
    </div>
  );
}

