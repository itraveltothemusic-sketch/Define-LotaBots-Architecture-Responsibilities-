import { Card } from "@/components/ui/card";

interface MetricCardProps {
  label: string;
  value: string;
  support?: string;
}

export function MetricCard({ label, value, support }: MetricCardProps) {
  return (
    <Card className="min-h-28">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      {support ? <p className="mt-2 text-sm text-slate-400">{support}</p> : null}
    </Card>
  );
}
