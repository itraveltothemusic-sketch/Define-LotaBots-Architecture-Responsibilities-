import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface MetricCardProps {
  label: string;
  value: string;
  detail: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
}

export function MetricCard({ label, value, detail, tone = "neutral" }: MetricCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{detail}</p>
        </div>
        <Badge label={tone.toUpperCase()} variant={tone} />
      </div>
    </Card>
  );
}
