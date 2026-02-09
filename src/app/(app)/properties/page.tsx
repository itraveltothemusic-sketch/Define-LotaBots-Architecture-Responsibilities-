import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/db/prisma";
import { getSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PropertiesPage() {
  const session = await getSession();
  if (!session?.user) redirect("/sign-in");
  if (!session.user.orgId) redirect("/sign-in");

  const properties = await prisma.property.findMany({
    where: { orgId: session.user.orgId },
    orderBy: { createdAt: "desc" },
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
          <h1 className="text-2xl font-semibold tracking-tight">Properties</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Asset records that anchor inspections, evidence, claims, and equity outcomes.
          </p>
        </div>
        <Link href="/properties/new">
          <Button>Create property</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All properties</CardTitle>
          <CardDescription>
            Evidence counts indicate documentation strength. Click to open the forensic timeline.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {properties.length === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-300">
              <div className="font-medium text-zinc-900 dark:text-zinc-100">
                No properties yet.
              </div>
              <div>
                Create a property record to begin building a defensible evidence timeline.
              </div>
              <Link href="/properties/new">
                <Button size="sm">Create property</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-zinc-200 overflow-hidden rounded-md border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
              {properties.map((p) => (
                <Link
                  key={p.id}
                  href={`/properties/${p.id}`}
                  className="block bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900/30"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {p.displayName}
                      </div>
                      <div className="truncate text-xs text-zinc-600 dark:text-zinc-400">
                        {p.city}, {p.region} • {p.status}
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-3 text-xs text-zinc-600 dark:text-zinc-400">
                      <div>Evidence: {p._count.evidence}</div>
                      <div>Inspections: {p._count.inspections}</div>
                      <div>Claims: {p._count.claims}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

