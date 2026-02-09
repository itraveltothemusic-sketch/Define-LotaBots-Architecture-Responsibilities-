import { notFound, redirect } from "next/navigation";

import { requireUser } from "@/server/auth/require-user";
import { getDb } from "@/server/db";
import { canAccessModule } from "@/server/auth/rbac";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EvidenceTimelineCard } from "@/modules/intelligence-center/components/evidence-timeline-card";
import { addEvidenceNoteAction } from "./actions";

export default async function PropertyDetailPage({
  params,
}: {
  params: { propertyId: string };
}) {
  const session = await requireUser();
  if (!canAccessModule(session.user.role, "forensic")) redirect("/unauthorized");

  const db = getDb();
  if (!db) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Property</CardTitle>
          <CardDescription>
            Database is not configured. Set <code>DATABASE_URL</code> to load property case files.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const property = await db.property.findUnique({
    where: { id: params.propertyId },
    include: {
      evidence: { orderBy: { createdAt: "desc" }, take: 100 },
    },
  });

  if (!property) return notFound();

  // Record-level access (phase 1)
  if (session.user.role === "OWNER" && property.ownerId && property.ownerId !== session.user.id) {
    redirect("/unauthorized");
  }

  const addNote = addEvidenceNoteAction.bind(null, property.id);

  const evidence = property.evidence.map((e) => ({
    id: e.id,
    type: e.type,
    title: e.title,
    description: e.description,
    verificationStatus: e.verificationStatus,
    capturedAt: e.capturedAt,
    createdAt: e.createdAt,
  }));

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{property.displayName}</CardTitle>
          <CardDescription>
            {[property.addressLine1, [property.city, property.region].filter(Boolean).join(", "), property.postalCode]
              .filter(Boolean)
              .join(" · ") || "Address not captured yet"}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
          Evidence and notes added here become part of the auditable case file and will influence ATOS guidance.
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add evidence note</CardTitle>
            <CardDescription>
              Use notes to capture inspection observations, carrier communications, or missing-document checklists.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={addNote} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                  Title
                </label>
                <input
                  name="title"
                  required
                  minLength={3}
                  className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-700 dark:focus:ring-zinc-800"
                  placeholder="e.g., Roof inspection summary (north wing)"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                  Details
                </label>
                <textarea
                  name="description"
                  required
                  minLength={3}
                  className="min-h-28 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-700 dark:focus:ring-zinc-800"
                  placeholder="Write what was observed, what evidence exists, and what is missing."
                />
              </div>
              <Button type="submit">Add note</Button>
              <div className="text-xs text-zinc-500 dark:text-zinc-500">
                Write access is currently limited to Owners (their own properties) and Internal users.
              </div>
            </form>
          </CardContent>
        </Card>

        <EvidenceTimelineCard evidence={evidence} />
      </div>
    </div>
  );
}

