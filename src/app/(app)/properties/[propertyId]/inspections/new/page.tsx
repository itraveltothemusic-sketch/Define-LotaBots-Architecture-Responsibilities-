import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createInspection } from "./actions";

export default function NewInspectionPage({
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
          Forensic Property Module
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">New inspection</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Inspections anchor what was observed, when it was observed, and by whom.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inspection record</CardTitle>
          <CardDescription>
            Keep the summary factual and reference evidence artifacts where possible.
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
              await createInspection(propertyId, formData);
            }}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="performedAt">Performed at</Label>
              <Input id="performedAt" name="performedAt" type="datetime-local" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inspectorName">Inspector name</Label>
              <Input
                id="inspectorName"
                name="inspectorName"
                placeholder="e.g., Jordan Reyes"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                name="summary"
                placeholder="What was observed? Where? What damage categories are implicated? What documentation is needed next?"
                required
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <Link
                href={`/properties/${propertyId}`}
                className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
              >
                Cancel
              </Link>
              <Button type="submit">Save inspection</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

