import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/db/prisma";
import { getSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ClaimsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/sign-in");
  if (!session.user.orgId) redirect("/sign-in");

  const orgId = session.user.orgId;
  const [claims, properties] = await Promise.all([
    prisma.claim.count({ where: { property: { orgId } } }),
    prisma.property.count({ where: { orgId } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Insurance Intelligence</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Track claim lifecycle truth, carrier interactions, and scope discrepancies.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/intelligence">
            <Button variant="secondary">Back to Intelligence</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Claims</CardTitle>
            <CardDescription>Carrier lifecycle records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tracking-tight">{claims}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Eligible properties</CardTitle>
            <CardDescription>Properties in your org boundary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tracking-tight">{properties}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming next (production build)</CardTitle>
          <CardDescription>
            Claim creation, carrier interaction logs, and discrepancy detection will be wired to the evidence timeline.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
          <div>- Claim lifecycle states with audit trail.</div>
          <div>- Carrier interaction logs (email/phone/portal/meetings).</div>
          <div>- Scope versioning + discrepancy alerts tied to evidence categories.</div>
        </CardContent>
      </Card>
    </div>
  );
}

