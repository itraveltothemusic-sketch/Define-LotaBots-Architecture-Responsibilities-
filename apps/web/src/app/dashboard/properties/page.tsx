import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PropertiesPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Forensic Property</CardTitle>
          <CardDescription>
            Property profiles, inspection records, media/document ingestion, and damage classification.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          <div className="font-medium text-zinc-900 dark:text-zinc-100">What happens here</div>
          <ul className="list-inside list-disc space-y-1">
            <li>Create/maintain property case files (identity, address, stakeholders).</li>
            <li>Capture inspections with timestamped observations.</li>
            <li>Ingest photos, videos, documents with provenance and verification status.</li>
            <li>Classify damage with confidence and evidence links.</li>
          </ul>
          <div className="pt-2">
            This route is scaffolded; next iteration will add property list + create flow and evidence ingestion.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

