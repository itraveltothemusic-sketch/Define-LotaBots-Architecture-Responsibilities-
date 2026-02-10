interface StatCardProps {
  label: string;
  value: string;
  trend: string;
}

export function StatCard({ label, value, trend }: StatCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      <p className="mt-2 text-xs text-slate-600">{trend}</p>
    </article>
  );
}
