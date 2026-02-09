import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/db/prisma";
import { getSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addEvidenceNote } from "./actions";

export default async function PropertyDetailPage({
  params,
  searchParams,
}: {
  params: { propertyId: string };
  searchParams?: { error?: string };
}) {
  const session = await getSession();
  if (!session?.user) redirect("/sign-in");
  if (!session.user.orgId) redirect("/sign-in");

  const { propertyId } = params;

  const property = await prisma.property.findFirst({
    where: { id: propertyId, orgId: session.user.orgId },
    include: {
      evidence: { orderBy: { createdAt: "desc" }, take: 25 },
      inspections: { orderBy: { performedAt: "desc" }, take: 10 },
      claims: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });

  if (!property) redirect("/properties");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
            Property profile
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{property.displayName}</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {property.address1}
            {property.address2 ? `, ${property.address2}` : ""} • {property.city},{" "}
            {property.region} {property.postalCode}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/intelligence">
            <Button variant="secondary">Back to Intelligence</Button>
          </Link>
          <Link href="/properties">
            <Button variant="ghost">All properties</Button>
          </Link>
          <Link href={`/properties/${propertyId}/evidence/new`}>
            <Button>Add evidence</Button>
          </Link>
          <Link href={`/properties/${propertyId}/inspections/new`}>
            <Button variant="secondary">Add inspection</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Evidence timeline</CardTitle>
            <CardDescription>
              Every artifact strengthens defensibility. Add notes, URLs, timestamps, and integrity hashes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {searchParams?.error ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
                Please check your input and try again.
              </div>
            ) : null}

            <form
              action={async (formData) => {
                "use server";
                await addEvidenceNote(propertyId, formData);
              }}
              className="space-y-3 rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30"
            >
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Add evidence note
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="e.g., Roof membrane uplift observed (NW corner)" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Details (optional)</Label>
                <Input id="description" name="description" placeholder="Capture what was observed, where, and why it matters." />
              </div>
              <div className="flex justify-end">
                <Button size="sm" type="submit">
                  Add to timeline
                </Button>
              </div>
            </form>

            {property.evidence.length === 0 ? (
              <div className="rounded-md border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                No evidence yet. Add notes now, then attach photos/video/documents to strengthen provenance.
              </div>
            ) : (
              <div className="space-y-2">
                {property.evidence.map((e) => (
                  <div
                    key={e.id}
                    className="rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {e.title}
                        </div>
                        <div className="text-xs text-zinc-600 dark:text-zinc-400">
                          {e.type} • {new Date(e.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    {e.description ? (
                      <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                        {e.description}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Forensic anchors</CardTitle>
              <CardDescription>
                Inspections and claims tie evidence to lifecycle decisions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">Status</div>
                  <div className="mt-1 text-sm font-semibold">{property.status}</div>
                </div>
                <div className="rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">Inspections</div>
                  <div className="mt-1 text-sm font-semibold">{property.inspections.length}</div>
                </div>
                <div className="rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">Claims</div>
                  <div className="mt-1 text-sm font-semibold">{property.claims.length}</div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  Recent inspections
                </div>
                <Link href={`/properties/${propertyId}/inspections/new`}>
                  <Button size="sm" variant="secondary">
                    New inspection
                  </Button>
                </Link>
              </div>

              {property.inspections.length === 0 ? (
                <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-400">
                  No inspections yet. Create an inspection to anchor what was observed and when.
                </div>
              ) : (
                <div className="space-y-2">
                  {property.inspections.map((i) => (
                    <div
                      key={i.id}
                      className="rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {i.inspectorName}
                          </div>
                          <div className="text-xs text-zinc-600 dark:text-zinc-400">
                            {new Date(i.performedAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                        {i.summary}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What ATOS looks for here</CardTitle>
              <CardDescription>
                Guidance is generated strictly from this property’s data and timeline coverage.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <div>
                - Missing evidence categories (roof, envelope, interior, mechanical).
              </div>
              <div>- Weak provenance (no timestamps, unclear source, no integrity signals).</div>
              <div>- Claim risks (no interaction logs, scope drift, incomplete documentation).</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

