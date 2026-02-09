interface StatusBadgeProps {
  label: string;
  tone?:
    | "neutral"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "critical";
}

const toneMap: Record<NonNullable<StatusBadgeProps["tone"]>, string> = {
  neutral: "bg-slate-500/10 text-slate-700 ring-slate-500/20",
  success: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-700 ring-amber-500/20",
  danger: "bg-rose-500/10 text-rose-700 ring-rose-500/20",
  info: "bg-blue-500/10 text-blue-700 ring-blue-500/20",
  critical: "bg-fuchsia-600/10 text-fuchsia-800 ring-fuchsia-600/30",
};

export function StatusBadge({ label, tone = "neutral" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${toneMap[tone]}`}
    >
      {label}
    </span>
  );
}
