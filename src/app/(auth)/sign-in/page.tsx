import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInForm } from "./SignInForm";

export default function SignInPage() {
  const dbConfigured = Boolean(process.env.DATABASE_URL);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="text-sm font-semibold tracking-tight">Equity Builders</div>
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Access your Intelligence Center and forensic workflows.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Use your issued credentials. ATOS guidance is available after sign-in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!dbConfigured ? (
            <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
              Set <span className="font-medium">DATABASE_URL</span> in your environment to enable sign-in.
              See <span className="font-medium">.env.example</span>.
            </div>
          ) : null}
          <SignInForm disabled={!dbConfigured} />
        </CardContent>
      </Card>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Need access?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-zinc-900 hover:underline dark:text-zinc-100"
        >
          Request access
        </Link>
        .
      </p>
    </div>
  );
}

