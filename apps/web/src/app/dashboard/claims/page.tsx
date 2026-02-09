import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClaimsPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Insurance Intelligence</CardTitle>
          <CardDescription>
            Claim lifecycle tracking, carrier interaction logs, and scope comparison for discrepancy detection.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          <div className="font-medium text-zinc-900 dark:text-zinc-100">What happens here</div>
          <ul className="list-inside list-disc space-y-1">
            <li>Track claims from notice of loss through settlement.</li>
            <li>Log carrier interactions with attachments and outcomes.</li>
            <li>Compare carrier scope vs contractor/forensic scope with explainable deltas.</li>
          </ul>
          <div className="pt-2">
            This route is scaffolded; next iteration will add claim records + interaction timeline and scope deltas.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

