import { redirect } from "next/navigation";
import { prisma } from "@/db/prisma";
import { getSession } from "@/lib/auth/session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EquityPage() {
  const session = await getSession();
  if (!session?.user) redirect("/sign-in");
  if (!session.user.orgId) redirect("/sign-in");

  const orgId = session.user.orgId;
  const reports = await prisma.equityReport.count({ where: { property: { orgId } } });

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Equity Outcomes</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Quantify before/after valuation, claim vs payout delta, and the equity gain narrative.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Equity reports</CardTitle>
          <CardDescription>Verified outcome artifacts (per property)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold tracking-tight">{reports}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coming next (production build)</CardTitle>
          <CardDescription>
            This module will produce investor-grade reports grounded in inspections, evidence, and claim truth.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
          <div>- Before/after valuation inputs and provenance.</div>
          <div>- Claim vs payout delta analysis with supporting artifacts.</div>
          <div>- Narrative report generation with explicit assumptions and audit trail.</div>
        </CardContent>
      </Card>
    </div>
  );
}

