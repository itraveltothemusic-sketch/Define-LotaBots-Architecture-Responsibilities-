import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/db/prisma";
import { getSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function IntelligenceCenterPage() {
  const session = await getSession();
  if (!session?.user) redirect("/sign-in");
  if (!session.user.orgId) redirect("/sign-in");

  const orgId = session.user.orgId;

  const properties = await prisma.property.findMany({
    where: { orgId },
    orderBy: { createdAt: "desc" },
    take: 8,
    select: {
      id: true,
      displayName: true,
      city: true,
      region: true,
      status: true,
      createdAt: true,
      _count: { select: { evidence: true, inspections: true, claims: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Intelligence Center</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Central command: property truth, evidence timeline, and strategy guidance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/properties/new">
            <Button>Create property</Button>
          </Link>
          <Link href="/properties">
            <Button variant="secondary">View all properties</Button>
          </Link>
        </div>
      </div>

      {properties.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No properties yet</CardTitle>
            <CardDescription>
              Start by creating a property record—this is the root of the forensic timeline.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/properties/new">
              <Button>Create your first property</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Active properties</CardTitle>
              <CardDescription>
                High-signal overview. Select a property for deeper evidence review.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {properties.map((p) => (
                <Link
                  key={p.id}
                  href={`/properties/${p.id}`}
                  className="block rounded-md border border-zinc-200 p-3 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {p.displayName}
                      </div>
                      <div className="truncate text-xs text-zinc-600 dark:text-zinc-400">
                        {p.city}, {p.region} • {p.status}
                      </div>
                    </div>
                    <div className="shrink-0 text-right text-xs text-zinc-600 dark:text-zinc-400">
                      <div>Evidence: {p._count.evidence}</div>
                      <div>Inspections: {p._count.inspections}</div>
                      <div>Claims: {p._count.claims}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evidence & documentation timeline</CardTitle>
              <CardDescription>
                This view becomes the authoritative narrative for insurance and equity outcomes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-300">
                Select a property to view its timeline. ATOS will highlight missing artifacts,
                weak provenance, and strategic next steps.
              </div>
              <div className="flex items-center gap-3">
                <Link href="/properties">
                  <Button variant="secondary">Open Properties</Button>
                </Link>
                <Link href="/claims">
                  <Button variant="ghost">Insurance Intelligence</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

