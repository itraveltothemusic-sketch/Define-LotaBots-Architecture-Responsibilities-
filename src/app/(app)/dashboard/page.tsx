import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/db/prisma";
import { getSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.user) redirect("/sign-in");
  if (!session.user.orgId) redirect("/sign-in");

  const orgId = session.user.orgId;

  const [properties, inspections, evidence, claims] = await Promise.all([
    prisma.property.count({ where: { orgId } }),
    prisma.inspection.count({ where: { property: { orgId } } }),
    prisma.evidence.count({ where: { property: { orgId } } }),
    prisma.claim.count({ where: { property: { orgId } } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            High-signal operational summary. ATOS will guide the next best actions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/properties/new">
            <Button>Create property</Button>
          </Link>
          <Link href="/intelligence">
            <Button variant="secondary">Open Intelligence Center</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Properties", value: properties, hint: "Assets under investigation" },
          { title: "Inspections", value: inspections, hint: "Forensic anchor records" },
          { title: "Evidence items", value: evidence, hint: "Photos, docs, notes, video" },
          { title: "Claims", value: claims, hint: "Carrier lifecycle tracking" },
        ].map((k) => (
          <Card key={k.title}>
            <CardHeader>
              <CardTitle>{k.title}</CardTitle>
              <CardDescription>{k.hint}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold tracking-tight">{k.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Intelligence Center (preview)</CardTitle>
          <CardDescription>
            The heart of the platform: property overview, evidence timeline, and claim strategy.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Start with properties and evidence. ATOS will surface gaps and opportunities.
          </div>
          <Link href="/intelligence">
            <Button variant="secondary">Go to Intelligence Center</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

