interface KpiCardProps {
  label: string;
  value: string;
  trend?: string;
  intent?: "default" | "positive" | "alert";
}

const intentClass: Record<NonNullable<KpiCardProps["intent"]>, string> = {
  default: "border-slate-200 bg-white",
  positive: "border-emerald-200 bg-emerald-50/70",
  alert: "border-rose-200 bg-rose-50/70",
};

export function KpiCard({
  label,
  value,
  trend,
  intent = "default",
}: KpiCardProps) {
  return (
    <article
      className={`rounded-2xl border p-4 shadow-sm shadow-slate-200/60 ${intentClass[intent]}`}
    >
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      {trend ? <p className="mt-2 text-xs text-slate-600">{trend}</p> : null}
    </article>
  );
}
