import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { hasDatabaseConfigured } from "@/server/env";

export default function DashboardHomePage() {
  const dbReady = hasDatabaseConfigured();

  return (
    <div className="space-y-4">
      {!dbReady ? (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30">
          <CardHeader>
            <CardTitle>Degraded mode</CardTitle>
            <CardDescription>
              Database is not configured. Authentication may work via existing session, but data-backed
              workflows are disabled until <code>DATABASE_URL</code> is set.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Intelligence Center</CardTitle>
          <CardDescription>
            The heart of the platform: property overview, evidence timeline, risks, and guided next actions.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Start here for a defensible case file and execution plan.
          </div>
          <ButtonLink href="/dashboard/intelligence">Open Intelligence Center</ButtonLink>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Forensic Property Module</CardTitle>
            <CardDescription>Profiles, inspections, ingestion, damage classification.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
            Go to{" "}
            <Link className="underline underline-offset-4 hover:no-underline" href="/dashboard/properties">
              Properties
            </Link>{" "}
            to begin building a case file.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Insurance Intelligence Module</CardTitle>
            <CardDescription>Claim lifecycle, interactions, scope delta detection.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
            Go to{" "}
            <Link className="underline underline-offset-4 hover:no-underline" href="/dashboard/claims">
              Claims
            </Link>{" "}
            to track carrier-facing work.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

