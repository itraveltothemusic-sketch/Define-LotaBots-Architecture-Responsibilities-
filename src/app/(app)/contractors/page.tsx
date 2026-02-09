import { redirect } from "next/navigation";
import { prisma } from "@/db/prisma";
import { getSession } from "@/lib/auth/session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ContractorsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/sign-in");
  if (!session.user.orgId) redirect("/sign-in");

  const orgId = session.user.orgId;
  const contractors = await prisma.contractor.count({ where: { orgId } });

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Contractor Execution</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Onboard contractors, assign scope, verify progress, and track compliance.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contractors</CardTitle>
          <CardDescription>Execution partners in your workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold tracking-tight">{contractors}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coming next (production build)</CardTitle>
          <CardDescription>
            Scope assignment and verification will connect directly to property evidence and claim strategy.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
          <div>- Contractor onboarding + role controls.</div>
          <div>- Scope assignment per property with progress verification checkpoints.</div>
          <div>- Compliance tracking (documentation, permits, safety, lien releases).</div>
        </CardContent>
      </Card>
    </div>
  );
}

