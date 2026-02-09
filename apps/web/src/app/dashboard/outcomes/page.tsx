import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OutcomesPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Equity Outcomes</CardTitle>
          <CardDescription>
            Before/after valuation, claim vs payout delta, and defensible equity gain narratives.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          <div className="font-medium text-zinc-900 dark:text-zinc-100">What happens here</div>
          <ul className="list-inside list-disc space-y-1">
            <li>Record valuation snapshots and assumptions.</li>
            <li>Compute claim vs payout delta and document causality.</li>
            <li>Generate reports with evidence links and verification status.</li>
          </ul>
          <div className="pt-2">
            This route is scaffolded; next iteration will add outcome calculators and report generation.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

