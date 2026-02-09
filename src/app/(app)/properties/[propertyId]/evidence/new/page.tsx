import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createEvidence } from "./actions";

export default function NewEvidencePage({
  params,
  searchParams,
}: {
  params: { propertyId: string };
  searchParams?: { error?: string };
}) {
  const { propertyId } = params;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
          Evidence ingestion
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Add evidence</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Evidence items are the backbone of defensibility. Capture provenance whenever possible.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evidence item</CardTitle>
          <CardDescription>
            Today you can attach URLs and integrity hashes. Cloud storage ingestion (S3/R2) is the next step.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {searchParams?.error ? (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
              Please check your inputs and try again.
            </div>
          ) : null}

          <form
            action={async (formData) => {
              "use server";
              await createEvidence(propertyId, formData);
            }}
            className="space-y-5"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  name="type"
                  required
                  className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <option value="PHOTO">Photo</option>
                  <option value="VIDEO">Video</option>
                  <option value="DOCUMENT">Document</option>
                  <option value="NOTE">Note</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="capturedAt">Captured at (optional)</Label>
                <Input id="capturedAt" name="capturedAt" type="datetime-local" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., East elevation — window header damage"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="What is shown? Where was it captured? What claim/coverage question does it answer?"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sourceUrl">Source URL (optional)</Label>
                <Input
                  id="sourceUrl"
                  name="sourceUrl"
                  placeholder="https://…"
                />
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Use a stable URL from your storage system (S3/R2/SharePoint/etc.).
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sha256">SHA-256 (optional)</Label>
                <Input
                  id="sha256"
                  name="sha256"
                  placeholder="64 hex characters"
                />
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Integrity signal: proves the artifact hasn’t changed since ingestion.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <Link
                href={`/properties/${propertyId}`}
                className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
              >
                Cancel
              </Link>
              <Button type="submit">Add evidence</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

