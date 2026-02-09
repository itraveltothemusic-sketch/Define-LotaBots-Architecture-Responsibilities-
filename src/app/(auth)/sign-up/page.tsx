import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createAccount } from "./actions";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const error = searchParams?.error;
  const dbConfigured = Boolean(process.env.DATABASE_URL);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="text-sm font-semibold tracking-tight">Equity Builders</div>
        <h1 className="text-2xl font-semibold tracking-tight">Request access</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Create your organization workspace. You’ll be assigned the{" "}
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            Owner
          </span>{" "}
          role.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New workspace</CardTitle>
          <CardDescription>
            This creates a secure organization boundary for properties, evidence,
            claims, and execution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!dbConfigured ? (
            <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
              Set <span className="font-medium">DATABASE_URL</span> in your environment to enable sign-up.
              See <span className="font-medium">.env.example</span>.
            </div>
          ) : null}
          {error ? (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
              {error === "exists"
                ? "An account with that email already exists. Please sign in."
                : "Please check your inputs and try again."}
            </div>
          ) : null}

          {dbConfigured ? (
            <form action={createAccount} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="organizationName">Organization name</Label>
              <Input
                id="organizationName"
                name="organizationName"
                placeholder="e.g., Gulf Coast Commercial Holdings"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Your name</Label>
                <Input id="name" name="name" placeholder="Full name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Minimum 12 characters"
                required
              />
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                For enterprise deployments, this will evolve to invites + SSO.
              </p>
            </div>

            <Button className="w-full" size="lg" type="submit">
              Create workspace
            </Button>
            </form>
          ) : null}
        </CardContent>
      </Card>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Already have access?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-zinc-900 hover:underline dark:text-zinc-100"
        >
          Sign in
        </Link>
        .
      </p>
    </div>
  );
}

